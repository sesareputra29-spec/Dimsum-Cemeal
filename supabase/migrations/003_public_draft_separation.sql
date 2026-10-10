-- Migration 003: Public & Draft Data Separation, Role Escalation Protection & Storage Security
-- Run this in Supabase SQL Editor

-- 1. Create Dedicated Table for Site Drafts (Admin ONLY)
CREATE TABLE IF NOT EXISTS public.site_drafts (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  draft_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS on site_drafts
ALTER TABLE public.site_drafts ENABLE ROW LEVEL SECURITY;

-- 2. Migrate existing draft_data from site_settings to site_drafts if site_settings has draft_data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'site_settings' 
      AND column_name = 'draft_data'
  ) THEN
    INSERT INTO public.site_drafts (id, draft_data, updated_at, updated_by)
    SELECT id, draft_data, updated_at, updated_by
    FROM public.site_settings
    WHERE draft_data IS NOT NULL
    ON CONFLICT (id) DO UPDATE SET
      draft_data = EXCLUDED.draft_data,
      updated_at = EXCLUDED.updated_at,
      updated_by = EXCLUDED.updated_by;

    -- Safely drop draft_data column from site_settings to eliminate leakage risk
    ALTER TABLE public.site_settings DROP COLUMN draft_data;
  END IF;
END $$;

-- 3. RLS Policies for site_drafts (Strict Super Admin Access ONLY)
DROP POLICY IF EXISTS "Super Admin Only Site Drafts Select" ON public.site_drafts;
DROP POLICY IF EXISTS "Super Admin Only Site Drafts Insert" ON public.site_drafts;
DROP POLICY IF EXISTS "Super Admin Only Site Drafts Update" ON public.site_drafts;
DROP POLICY IF EXISTS "Super Admin Only Site Drafts Delete" ON public.site_drafts;

CREATE POLICY "Super Admin Only Site Drafts Select"
  ON public.site_drafts FOR SELECT
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Only Site Drafts Insert"
  ON public.site_drafts FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Only Site Drafts Update"
  ON public.site_drafts FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Only Site Drafts Delete"
  ON public.site_drafts FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- 4. Prevent Role Self-Escalation via Trigger
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Keamanan Terlanggar: Hanya Super Admin yang dapat mengubah role pengguna.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trigger_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- 5. Storage Policies for cms-media Bucket (Supabase Storage)
-- Ensure cms-media bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Read Storage CMS Media" ON storage.objects;
DROP POLICY IF EXISTS "Super Admin Upload Storage CMS Media" ON storage.objects;
DROP POLICY IF EXISTS "Super Admin Update Storage CMS Media" ON storage.objects;
DROP POLICY IF EXISTS "Super Admin Delete Storage CMS Media" ON storage.objects;

CREATE POLICY "Public Read Storage CMS Media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-media');

CREATE POLICY "Super Admin Upload Storage CMS Media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cms-media' AND public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Update Storage CMS Media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'cms-media' AND public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Delete Storage CMS Media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cms-media' AND public.is_super_admin(auth.uid()));
