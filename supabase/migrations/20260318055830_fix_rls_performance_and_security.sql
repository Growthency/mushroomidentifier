/*
  # Fix RLS Performance and Security Issues

  1. Performance Optimizations
    - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
    - This prevents re-evaluation of the function for each row, improving query performance at scale

  2. Security Enhancements
    - Enable RLS on `ip_usage` table (no user access policies needed - backend only)
    - Enable RLS on `contact_requests` table (no user access policies needed - backend only)

  3. Changes Made
    - Drop and recreate all affected policies with optimized auth function calls
    - Enable RLS on previously unprotected tables
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;

-- Recreate profiles policies with optimized auth function
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Recreate analyses policies with optimized auth function
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Recreate transactions policy with optimized auth function
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Enable RLS on ip_usage table (backend-only access, no user policies)
ALTER TABLE ip_usage ENABLE ROW LEVEL SECURITY;

-- Enable RLS on contact_requests table (backend-only access, no user policies)
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;