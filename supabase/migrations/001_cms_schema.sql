-- Dimsum Cemeal Super Admin CMS Database Schema (Base DDL)
-- Run in Supabase SQL Editor

-- 1. Profiles & Roles Table (Default role is 'viewer', NOT 'super_admin')
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'editor', 'viewer')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  data JSONB NOT NULL,
  draft_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

-- 3. Pages Table
CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_published BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Page Sections Table
CREATE TABLE IF NOT EXISTS public.page_sections (
  id TEXT PRIMARY KEY,
  page_id TEXT REFERENCES public.pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  desktop_visible BOOLEAN DEFAULT true,
  mobile_visible BOOLEAN DEFAULT true,
  layout_settings JSONB DEFAULT '{}'::jsonb
);

-- 5. Content Blocks Table
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id TEXT PRIMARY KEY,
  section_id TEXT REFERENCES public.page_sections(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL,
  content JSONB NOT NULL,
  typography_settings JSONB DEFAULT '{}'::jsonb,
  color_settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 7. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  image TEXT,
  category TEXT DEFAULT 'Favorit',
  available BOOLEAN DEFAULT true,
  badge TEXT,
  order_url TEXT,
  sort_order INT DEFAULT 0,
  photo_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  file_size INT,
  alt_text TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Navigation Items Table
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true
);

-- 10. Footer Settings Table
CREATE TABLE IF NOT EXISTS public.footer_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_footer',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SEO Settings Table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_seo',
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT,
  og_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Published Versions Table
CREATE TABLE IF NOT EXISTS public.published_versions (
  id TEXT PRIMARY KEY,
  version_number INT NOT NULL,
  data JSONB NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  published_by TEXT,
  is_active BOOLEAN DEFAULT false,
  note TEXT
);

-- 13. Change Logs Table
CREATE TABLE IF NOT EXISTS public.change_logs (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(available);
CREATE INDEX IF NOT EXISTS idx_published_active ON public.published_versions(is_active);
