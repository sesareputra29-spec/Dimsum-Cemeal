-- Migration 005: Strengthen Atomic Publication RPC with Advisory Locks & Restrict Role Function Execution
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. SECURE & RESTRICT ROLE VALIDATION FUNCTION (is_super_admin)
-- ============================================================================
-- Revoke EXECUTE from PUBLIC and anon to prevent role-probing by unauthenticated visitors
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM anon;

-- Explicitly redefine with SECURITY DEFINER and isolated search_path
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
-- 2. ENHANCED ATOMIC PUBLICATION RPC FUNCTION (publish_cms_draft)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.publish_cms_draft(
  p_cms_data JSONB,
  p_user_email TEXT DEFAULT 'super_admin'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_next_version INT;
  v_version_id TEXT;
  v_published_at TIMESTAMPTZ := NOW();
BEGIN
  -- A. Acquire Database Advisory Lock for absolute transaction serialization
  -- Works even if main_settings row does not exist yet!
  PERFORM pg_advisory_xact_lock(hashtext('site_settings_publish_lock'));

  -- B. Verify caller authentication & Super Admin role
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Akses Ditolak: Anda harus login terlebih dahulu.';
  END IF;

  IF NOT public.is_super_admin(v_user_id) THEN
    RAISE EXCEPTION 'Akses Ditolak: Hanya Super Admin terverifikasi yang diperbolehkan mempublikasikan website.';
  END IF;

  -- C. Validate payload structure
  IF p_cms_data IS NULL OR NOT (p_cms_data ? 'settings') OR NOT (p_cms_data ? 'sections') THEN
    RAISE EXCEPTION 'Validasi Gagal: Payload data CMS tidak lengkap atau rusak.';
  END IF;

  -- D. Determine next version number (Serialized safely under advisory lock)
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_version
  FROM public.published_versions;

  -- High precision version ID incorporating millisecond timestamp and random UUID segment
  v_version_id := 'ver_' || to_char(v_published_at, 'YYYYMMDDHH24MISSMS') || '_' || gen_random_uuid()::text;

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
    'log_' || to_char(v_published_at, 'YYYYMMDDHH24MISSMS') || '_' || gen_random_uuid()::text,
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
  -- Any exception causes PostgreSQL to rollback all updates in this transaction
  RAISE EXCEPTION 'Transaksi Publikasi Gagal: %', SQLERRM;
END;
$$;

-- Grant execution permission exclusively to authenticated users
REVOKE EXECUTE ON FUNCTION public.publish_cms_draft(JSONB, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.publish_cms_draft(JSONB, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.publish_cms_draft(JSONB, TEXT) TO authenticated;
