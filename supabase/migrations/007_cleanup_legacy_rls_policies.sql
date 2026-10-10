-- Migration 007: Complete Cleanup of Legacy RLS Policies & Unified Security Matrix
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. ENSURE RLS IS ENABLED ON ALL TABLES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_drafts ENABLE ROW LEVEL SECURITY;
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

-- ============================================================================
-- 2. DYNAMICALLY DROP ALL EXISTING/LEGACY POLICIES FOR A 100% CLEAN SLATE
-- ============================================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Explicitly drop known legacy policy names as safeguard
DROP POLICY IF EXISTS "Public Read Active Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "Super Admin Insert Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "Super Admin Update Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "Super Admin Delete Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "Super Admin Write Published Versions" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_select" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_write" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_public_select" ON public.published_versions;
DROP POLICY IF EXISTS "published_versions_admin_all" ON public.published_versions;

DROP POLICY IF EXISTS "Users can read own profile or Super Admin reads all" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Super Admin Write Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Published Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_write" ON public.site_settings;

DROP POLICY IF EXISTS "Super Admin Only Site Drafts Select" ON public.site_drafts;
DROP POLICY IF EXISTS "Super Admin Only Site Drafts Insert" ON public.site_drafts;
DROP POLICY IF EXISTS "Super Admin Only Site Drafts Update" ON public.site_drafts;
DROP POLICY IF EXISTS "Super Admin Only Site Drafts Delete" ON public.site_drafts;
DROP POLICY IF EXISTS "site_drafts_admin_all" ON public.site_drafts;

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Super Admin Write Products" ON public.products;
DROP POLICY IF EXISTS "public_read_products" ON public.products;
DROP POLICY IF EXISTS "admin_write_products" ON public.products;

DROP POLICY IF EXISTS "Public Read Product Categories" ON public.product_categories;
DROP POLICY IF EXISTS "Super Admin Write Product Categories" ON public.product_categories;
DROP POLICY IF EXISTS "public_read_product_categories" ON public.product_categories;
DROP POLICY IF EXISTS "admin_write_product_categories" ON public.product_categories;

DROP POLICY IF EXISTS "Public Read Media Assets" ON public.media_assets;
DROP POLICY IF EXISTS "Super Admin Write Media Assets" ON public.media_assets;
DROP POLICY IF EXISTS "public_read_media_assets" ON public.media_assets;
DROP POLICY IF EXISTS "admin_write_media_assets" ON public.media_assets;

DROP POLICY IF EXISTS "Super Admin Read Change Logs" ON public.change_logs;
DROP POLICY IF EXISTS "Super Admin Insert Change Logs" ON public.change_logs;
DROP POLICY IF EXISTS "Super Admin Write Change Logs" ON public.change_logs;
DROP POLICY IF EXISTS "admin_change_logs" ON public.change_logs;
DROP POLICY IF EXISTS "change_logs_admin_all" ON public.change_logs;

-- ============================================================================
-- 3. APPLY UNIFIED, DECOUPLED, AND COMPLETE RLS POLICIES
-- ============================================================================

-- A. Profiles
-- 1. Self SELECT (Authenticated users can read their own profile by ID or verified JWT email)
CREATE POLICY "profiles_self_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    auth.uid() = id 
    OR LOWER(email) = LOWER(auth.jwt() ->> 'email')
    OR public.is_super_admin(auth.uid())
  );

-- 2. Super Admin ALL (Super admins can perform ALL operations on profiles)
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));


-- B. Published Versions
-- 1. Public SELECT (Visitors/Anon can read ONLY active published versions, no is_super_admin evaluation)
CREATE POLICY "published_versions_public_select" ON public.published_versions
  FOR SELECT TO public
  USING (is_active = true);

-- 2. Super Admin ALL (Super admins can read all versions and modify)
CREATE POLICY "published_versions_admin_all" ON public.published_versions
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));


-- C. Site Settings (Public Published Data)
-- 1. Public SELECT
CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT TO public
  USING (true);

-- 2. Super Admin ALL
CREATE POLICY "site_settings_admin_write" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));


-- D. Site Drafts (Strict Super Admin ONLY)
-- Closed to public/anon visitors
CREATE POLICY "site_drafts_admin_all" ON public.site_drafts
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));


-- E. Content & Product Tables (Public SELECT, Authenticated Super Admin ALL)

-- Pages
CREATE POLICY "public_read_pages" ON public.pages
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_pages" ON public.pages
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Page Sections
CREATE POLICY "public_read_page_sections" ON public.page_sections
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_page_sections" ON public.page_sections
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Content Blocks
CREATE POLICY "public_read_content_blocks" ON public.content_blocks
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_content_blocks" ON public.content_blocks
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Products
CREATE POLICY "public_read_products" ON public.products
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Product Categories
CREATE POLICY "public_read_product_categories" ON public.product_categories
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_product_categories" ON public.product_categories
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Media Assets
CREATE POLICY "public_read_media_assets" ON public.media_assets
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_media_assets" ON public.media_assets
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Navigation Items
CREATE POLICY "public_read_navigation_items" ON public.navigation_items
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_navigation_items" ON public.navigation_items
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Footer Settings
CREATE POLICY "public_read_footer_settings" ON public.footer_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_footer_settings" ON public.footer_settings
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- SEO Settings
CREATE POLICY "public_read_seo_settings" ON public.seo_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_write_seo_settings" ON public.seo_settings
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));


-- F. Change Logs (Super Admin ONLY)
CREATE POLICY "change_logs_admin_all" ON public.change_logs
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- ============================================================================
-- 4. VERIFY SECURITY DEFINER ROLE CHECK FUNCTION
-- ============================================================================
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

GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
