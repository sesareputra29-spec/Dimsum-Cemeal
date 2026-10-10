-- Migration 008: Fix Super Admin Profile RLS & Auth Alignment
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. ENHANCED SECURITY DEFINER ROLE CHECK FUNCTION (is_super_admin)
-- ============================================================================
-- Revoke execution from PUBLIC and anon
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM anon;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_jwt_email TEXT;
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- A. Check direct ID match in public.profiles
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'super_admin'
  ) THEN
    RETURN TRUE;
  END IF;

  -- B. Fallback match by cryptographically verified JWT session email claim
  SELECT auth.jwt() ->> 'email' INTO v_jwt_email;
  IF v_jwt_email IS NOT NULL AND v_jwt_email <> '' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.profiles
      WHERE LOWER(email) = LOWER(v_jwt_email) AND role = 'super_admin'
    );
  END IF;

  RETURN FALSE;
END;
$$;

-- Grant execution exclusively to authenticated role
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;

-- ============================================================================
-- 2. REFINED RLS POLICIES FOR public.profiles
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- Policy 1: Authenticated users can read their own profile row by UUID OR verified JWT Email
CREATE POLICY "profiles_self_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    auth.uid() = id 
    OR LOWER(email) = LOWER(auth.jwt() ->> 'email')
    OR public.is_super_admin(auth.uid())
  );

-- Policy 2: Super Admin has full write/management access to all profiles
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));
