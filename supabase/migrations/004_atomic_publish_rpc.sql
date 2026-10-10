-- Migration 004: Atomic RPC Publication Function & Comprehensive RLS Verification
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. ATOMIC PUBLICATION RPC FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.publish_cms_draft(
  p_cms_data JSONB,
  p_user_email TEXT DEFAULT 'super_admin'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_next_version INT;
  v_version_id TEXT;
  v_published_at TIMESTAMPTZ := NOW();
BEGIN
  -- A. Verify caller authentication & Super Admin role
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Akses Ditolak: Anda harus login terlebih dahulu.';
  END IF;

  IF NOT public.is_super_admin(v_user_id) THEN
    RAISE EXCEPTION 'Akses Ditolak: Hanya Super Admin terverifikasi yang diperbolehkan mempublikasikan website.';
  END IF;

  -- B. Validate payload structure
  IF p_cms_data IS NULL OR NOT (p_cms_data ? 'settings') OR NOT (p_cms_data ? 'sections') THEN
    RAISE EXCEPTION 'Validasi Gagal: Payload data CMS tidak lengkap atau rusak.';
  END IF;

  -- C. Lock main_settings row to prevent concurrent publishing race conditions
  PERFORM 1 FROM public.site_settings WHERE id = 'main_settings' FOR UPDATE;

  -- D. Determine next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_version
  FROM public.published_versions;

  v_version_id := 'ver_' || EXTRACT(EPOCH FROM v_published_at)::BIGINT;

  -- E. Inject calculated version and metadata into payload
  p_cms_data := jsonb_set(p_cms_data, '{version}', to_jsonb(v_next_version));
  p_cms_data := jsonb_set(p_cms_data, '{lastUpdated}', to_jsonb(v_published_at::TEXT));
  p_cms_data := jsonb_set(p_cms_data, '{isPublished}', 'true'::jsonb);

  -- F. Deactivate all currently active versions
  UPDATE public.published_versions
  SET is_active = false
  WHERE is_active = true;

  -- G. Record new published version
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
    p_user_email,
    true,
    'Publikasi Atomik Versi ' || v_next_version
  );

  -- H. Update public site_settings (published data ONLY)
  INSERT INTO public.site_settings (id, data, updated_at, updated_by)
  VALUES ('main_settings', p_cms_data, v_published_at, p_user_email)
  ON CONFLICT (id) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at,
    updated_by = EXCLUDED.updated_by;

  -- I. Synchronize site_drafts so working draft matches published state
  INSERT INTO public.site_drafts (id, draft_data, updated_at, updated_by)
  VALUES ('main_settings', p_cms_data, v_published_at, p_user_email)
  ON CONFLICT (id) DO UPDATE SET
    draft_data = EXCLUDED.draft_data,
    updated_at = EXCLUDED.updated_at,
    updated_by = EXCLUDED.updated_by;

  -- J. Record change log entry
  INSERT INTO public.change_logs (
    id,
    user_email,
    action,
    entity_type,
    entity_id,
    details,
    timestamp
  ) VALUES (
    'log_' || EXTRACT(EPOCH FROM v_published_at)::BIGINT,
    p_user_email,
    'PUBLISH',
    'FULL_CMS',
    'v' || v_next_version,
    'Publikasi atomik berhasil dieksekusi oleh ' || p_user_email,
    v_published_at
  );

  RETURN jsonb_build_object(
    'success', true,
    'version', v_next_version,
    'publishedAt', v_published_at,
    'publishedBy', p_user_email,
    'data', p_cms_data
  );
EXCEPTION WHEN OTHERS THEN
  -- Exception triggers immediate transaction rollback
  RAISE EXCEPTION 'Transaksi Gagal: %', SQLERRM;
END;
$$;

-- Grant execution permission on RPC function
GRANT EXECUTE ON FUNCTION public.publish_cms_draft(JSONB, TEXT) TO authenticated;


-- ============================================================================
-- 2. COMPREHENSIVE ROW LEVEL SECURITY (RLS) AUDIT & ENFORCEMENT
-- ============================================================================

-- A. Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_super_admin(auth.uid()));

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_super_admin(auth.uid()));

CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE USING (public.is_super_admin(auth.uid()));

-- B. Site Settings (Public reads published settings; Super Admin manages)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_write" ON public.site_settings;

CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "site_settings_admin_write" ON public.site_settings
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- C. Site Drafts (STRICT Super Admin Only)
ALTER TABLE public.site_drafts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_drafts_admin_all" ON public.site_drafts;

CREATE POLICY "site_drafts_admin_all" ON public.site_drafts
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- D. Published Versions
ALTER TABLE public.published_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "published_versions_select" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_write" ON public.published_versions;

CREATE POLICY "published_versions_select" ON public.published_versions
  FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));

CREATE POLICY "published_versions_write" ON public.published_versions
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- E. Pages, Sections, Content Blocks, Products, Categories, Media, Nav, Footer, SEO
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
CREATE POLICY "public_read_pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "admin_write_pages" ON public.pages FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_page_sections" ON public.page_sections;
DROP POLICY IF EXISTS "admin_write_page_sections" ON public.page_sections;
CREATE POLICY "public_read_page_sections" ON public.page_sections FOR SELECT USING (true);
CREATE POLICY "admin_write_page_sections" ON public.page_sections FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_content_blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "admin_write_content_blocks" ON public.content_blocks;
CREATE POLICY "public_read_content_blocks" ON public.content_blocks FOR SELECT USING (true);
CREATE POLICY "admin_write_content_blocks" ON public.content_blocks FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_products" ON public.products;
DROP POLICY IF EXISTS "admin_write_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products FOR SELECT USING (true);
CREATE POLICY "admin_write_products" ON public.products FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_product_categories" ON public.product_categories;
DROP POLICY IF EXISTS "admin_write_product_categories" ON public.product_categories;
CREATE POLICY "public_read_product_categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "admin_write_product_categories" ON public.product_categories FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_media_assets" ON public.media_assets;
DROP POLICY IF EXISTS "admin_write_media_assets" ON public.media_assets;
CREATE POLICY "public_read_media_assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "admin_write_media_assets" ON public.media_assets FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_navigation_items" ON public.navigation_items;
DROP POLICY IF EXISTS "admin_write_navigation_items" ON public.navigation_items;
CREATE POLICY "public_read_navigation_items" ON public.navigation_items FOR SELECT USING (true);
CREATE POLICY "admin_write_navigation_items" ON public.navigation_items FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_footer_settings" ON public.footer_settings;
DROP POLICY IF EXISTS "admin_write_footer_settings" ON public.footer_settings;
CREATE POLICY "public_read_footer_settings" ON public.footer_settings FOR SELECT USING (true);
CREATE POLICY "admin_write_footer_settings" ON public.footer_settings FOR ALL USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "public_read_seo_settings" ON public.seo_settings;
DROP POLICY IF EXISTS "admin_write_seo_settings" ON public.seo_settings;
CREATE POLICY "public_read_seo_settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "admin_write_seo_settings" ON public.seo_settings FOR ALL USING (public.is_super_admin(auth.uid()));

-- F. Change Logs (Admin ONLY)
ALTER TABLE public.change_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_change_logs" ON public.change_logs;
CREATE POLICY "admin_change_logs" ON public.change_logs FOR ALL USING (public.is_super_admin(auth.uid()));
