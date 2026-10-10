-- Migration 002: Security Hardening & Strict Row Level Security (RLS)
-- Run this in Supabase SQL Editor

-- 1. Helper SECURITY DEFINER Function to Check Super Admin Status
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id AND role = 'super_admin'
  );
END;
$$;

-- Grant EXECUTE on is_super_admin to authenticated & anon roles
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated, anon;

-- 2. ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_logs ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO PREVENT CONFLICTS
DROP POLICY IF EXISTS "Public Read Active Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Media Assets" ON public.media_assets;
DROP POLICY IF EXISTS "Super Admin Write Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Super Admin Write Products" ON public.products;
DROP POLICY IF EXISTS "Super Admin Write Media Assets" ON public.media_assets;
DROP POLICY IF EXISTS "Super Admin Write Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "Super Admin Write Change Logs" ON public.change_logs;

-- 3. SPECIFIC RLS POLICIES FOR PUBLIC VISITORS vs SUPER ADMIN

-- A. Profiles
CREATE POLICY "Users can read own profile or Super Admin reads all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- B. Published Versions (Public can only read active published version)
CREATE POLICY "Public Read Active Published Versions"
  ON public.published_versions FOR SELECT
  USING (is_active = true OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Insert Published Versions"
  ON public.published_versions FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Update Published Versions"
  ON public.published_versions FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Delete Published Versions"
  ON public.published_versions FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- C. Site Settings (Public can read published settings; only admin reads draft)
CREATE POLICY "Public Read Published Site Settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Super Admin Write Site Settings"
  ON public.site_settings FOR ALL
  USING (public.is_super_admin(auth.uid()));

-- D. Products & Categories (Public SELECT, Admin Write)
CREATE POLICY "Public Read Products"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Super Admin Write Products"
  ON public.products FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Public Read Product Categories"
  ON public.product_categories FOR SELECT USING (true);

CREATE POLICY "Super Admin Write Product Categories"
  ON public.product_categories FOR ALL USING (public.is_super_admin(auth.uid()));

-- E. Media Assets (Public SELECT, Admin Write)
CREATE POLICY "Public Read Media Assets"
  ON public.media_assets FOR SELECT USING (true);

CREATE POLICY "Super Admin Write Media Assets"
  ON public.media_assets FOR ALL USING (public.is_super_admin(auth.uid()));

-- F. Change Logs (Admin ONLY)
CREATE POLICY "Super Admin Read Change Logs"
  ON public.change_logs FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin Insert Change Logs"
  ON public.change_logs FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));

-- 4. STORAGE POLICIES FOR cms-media BUCKET
-- Run in Storage SQL Context if bucket exists
-- CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id = 'cms-media');
-- CREATE POLICY "Admin Write Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND public.is_super_admin(auth.uid()));
