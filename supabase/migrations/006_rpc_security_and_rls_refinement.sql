-- Migration 006: RLS Refinement, Explicit Anonymous Decoupling & Server-Verified Audit Trail
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. FUNCTION ROLE SECURITY & DECOUPLING
-- ============================================================================
-- Revoke EXECUTE on is_super_admin from PUBLIC and anon
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM anon;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Grant EXECUTE exclusively to authenticated role
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;


-- ============================================================================
-- 2. DECOUPLED RLS POLICIES (NO is_super_admin EVALUATION FOR ANON)
-- ============================================================================

-- A. Published Versions
ALTER TABLE public.published_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "published_versions_select" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_write" ON public.published_versions;
DROP POLICY IF EXISTS "Public Read Active Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "Super Admin Write Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_public_select" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_admin_all" ON public.published_versions;

-- Policy 1: Public/Anon can read ONLY active published versions (Evaluates ONLY is_active = true)
CREATE POLICY "published_versions_public_select" ON public.published_versions
  FOR SELECT TO public
  USING (is_active = true);

-- Policy 2: Authenticated Super Admin has full management access
CREATE POLICY "published_versions_admin_all" ON public.published_versions
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));


-- B. Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile or Super Admin reads all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- Policy 1: Authenticated users can read their own profile
CREATE POLICY "profiles_self_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Super Admin can manage all profiles
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));


-- C. Site Settings (Published Data Table)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_write" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Published Site Settings" ON public.site_settings;

CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT TO public
  USING (true);

CREATE POLICY "site_settings_admin_write" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));


-- D. Site Drafts (Admin ONLY - Closed to public/anon)
ALTER TABLE public.site_drafts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_drafts_admin_all" ON public.site_drafts;

CREATE POLICY "site_drafts_admin_all" ON public.site_drafts
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));


-- E. Content & Product Tables (Public SELECT, Authenticated Admin WRITE)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_pages" ON public.pages;
DROP POLICY IF EXISTS "admin_write_pages" ON public.pages;
CREATE POLICY "public_read_pages" ON public.pages FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_pages" ON public.pages FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_page_sections" ON public.page_sections;
DROP POLICY IF EXISTS "admin_write_page_sections" ON public.page_sections;
CREATE POLICY "public_read_page_sections" ON public.page_sections FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_page_sections" ON public.page_sections FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_content_blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "admin_write_content_blocks" ON public.content_blocks;
CREATE POLICY "public_read_content_blocks" ON public.content_blocks FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_content_blocks" ON public.content_blocks FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_products" ON public.products;
DROP POLICY IF EXISTS "admin_write_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_products" ON public.products FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_product_categories" ON public.product_categories;
DROP POLICY IF EXISTS "admin_write_product_categories" ON public.product_categories;
CREATE POLICY "public_read_product_categories" ON public.product_categories FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_product_categories" ON public.product_categories FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_media_assets" ON public.media_assets;
DROP POLICY IF EXISTS "admin_write_media_assets" ON public.media_assets;
CREATE POLICY "public_read_media_assets" ON public.media_assets FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_media_assets" ON public.media_assets FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_navigation_items" ON public.navigation_items;
DROP POLICY IF EXISTS "admin_write_navigation_items" ON public.navigation_items;
CREATE POLICY "public_read_navigation_items" ON public.navigation_items FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_navigation_items" ON public.navigation_items FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_footer_settings" ON public.footer_settings;
DROP POLICY IF EXISTS "admin_write_footer_settings" ON public.footer_settings;
CREATE POLICY "public_read_footer_settings" ON public.footer_settings FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_footer_settings" ON public.footer_settings FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_seo_settings" ON public.seo_settings;
DROP POLICY IF EXISTS "admin_write_seo_settings" ON public.seo_settings;
CREATE POLICY "public_read_seo_settings" ON public.seo_settings FOR SELECT TO public USING (true);
CREATE POLICY "admin_write_seo_settings" ON public.seo_settings FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- F. Change Logs (Admin ONLY)
ALTER TABLE public.change_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_change_logs" ON public.change_logs;
DROP POLICY IF EXISTS "change_logs_admin_all" ON public.change_logs;

CREATE POLICY "change_logs_admin_all" ON public.change_logs
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));


-- ============================================================================
-- 3. PUBLICATION RPC WITH SERVER-VERIFIED USER IDENTITY & ADVISORY LOCKS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.publish_cms_draft(
  p_cms_data JSONB,
  p_user_email TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_verified_email TEXT;
  v_next_version INT;
  v_version_id TEXT;
  v_published_at TIMESTAMPTZ := NOW();
BEGIN
  -- A. Acquire Database Advisory Lock for absolute transaction serialization
  -- Prevents race conditions and multiple active versions across concurrent calls
  PERFORM pg_advisory_xact_lock(hashtext('site_settings_publish_lock'));

  -- B. Verify caller authentication in PostgreSQL session
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Akses Ditolak: Anda harus terautentikasi untuk mempublikasikan data.';
  END IF;

  -- C. Verify Super Admin Role directly in Database
  IF NOT public.is_super_admin(v_user_id) THEN
    RAISE EXCEPTION 'Akses Ditolak: Hanya Super Admin terverifikasi yang diperbolehkan mempublikasikan website.';
  END IF;

  -- D. Securely extract caller verified email from auth JWT session (Do NOT trust frontend input!)
  SELECT COALESCE(
    auth.jwt() ->> 'email',
    (SELECT email FROM auth.users WHERE id = v_user_id),
    (SELECT email FROM public.profiles WHERE id = v_user_id),
    'super_admin'
  ) INTO v_verified_email;

  -- E. Validate payload structure
  IF p_cms_data IS NULL OR NOT (p_cms_data ? 'settings') OR NOT (p_cms_data ? 'sections') THEN
    RAISE EXCEPTION 'Validasi Gagal: Payload data CMS tidak lengkap atau rusak.';
  END IF;

  -- F. Determine next version number (Serialized safely under advisory lock)
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_version
  FROM public.published_versions;

  -- High-precision collision-proof version ID
  v_version_id := 'ver_' || to_char(v_published_at, 'YYYYMMDDHH24MISSMS') || '_' || gen_random_uuid()::text;

  -- G. Inject verified metadata into payload JSON
  p_cms_data := jsonb_set(p_cms_data, '{version}', to_jsonb(v_next_version));
  p_cms_data := jsonb_set(p_cms_data, '{lastUpdated}', to_jsonb(v_published_at::TEXT));
  p_cms_data := jsonb_set(p_cms_data, '{isPublished}', 'true'::jsonb);

  -- H. Deactivate all currently active versions
  UPDATE public.published_versions
  SET is_active = false
  WHERE is_active = true;

  -- I. Record new published version
  INSERT INTO public.published_versions (
    id,
    version_number,
    data,
    published_at,
    published_by,
    is_active,
    note
  ) VALUES (
    v_version_id,
    v_next_version,
    p_cms_data,
    v_published_at,
    v_verified_email,
    true,
    'Publikasi Atomik Versi ' || v_next_version
  );

  -- J. Update public site_settings (published data ONLY)
  INSERT INTO public.site_settings (id, data, updated_at, updated_by)
  VALUES ('main_settings', p_cms_data, v_published_at, v_verified_email)
  ON CONFLICT (id) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at,
    updated_by = EXCLUDED.updated_by;

  -- K. Synchronize site_drafts so working draft matches published state
  INSERT INTO public.site_drafts (id, draft_data, updated_at, updated_by)
  VALUES ('main_settings', p_cms_data, v_published_at, v_verified_email)
  ON CONFLICT (id) DO UPDATE SET
    draft_data = EXCLUDED.draft_data,
    updated_at = EXCLUDED.updated_at,
    updated_by = EXCLUDED.updated_by;

  -- L. Record audit change log with verified email
  INSERT INTO public.change_logs (
    id,
    user_email,
    action,
    entity_type,
    entity_id,
    details,
    timestamp
  ) VALUES (
    'log_' || to_char(v_published_at, 'YYYYMMDDHH24MISSMS') || '_' || gen_random_uuid()::text,
    v_verified_email,
    'PUBLISH',
    'FULL_CMS',
    'v' || v_next_version,
    'Publikasi atomik berhasil dieksekusi oleh ' || v_verified_email,
    v_published_at
  );

  RETURN jsonb_build_object(
    'success', true,
    'version', v_next_version,
    'publishedAt', v_published_at,
    'publishedBy', v_verified_email,
    'data', p_cms_data
  );
EXCEPTION WHEN OTHERS THEN
  -- Any exception causes PostgreSQL to rollback all updates in this transaction
  RAISE EXCEPTION 'Transaksi Publikasi Gagal: %', SQLERRM;
END;
$$;

-- Grant execution permission exclusively to authenticated users
REVOKE EXECUTE ON FUNCTION public.publish_cms_draft(JSONB, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.publish_cms_draft(JSONB, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.publish_cms_draft(JSONB, TEXT) TO authenticated;
