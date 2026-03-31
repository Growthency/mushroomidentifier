/*
  # Fix Security Issues

  1. Remove Unused Indexes
    - Drop `idx_analyses_image_hash` (not being used for lookups yet)
    - Drop `idx_analyses_user_id` (queries use other patterns)
    - Drop `idx_analyses_ip_created` (ip_usage table handles rate limiting)
    - Drop `idx_transactions_user_id` (low transaction volume doesn't need index)

  2. Add RLS Policies for Backend-Only Tables
    - Add restrictive policies for `contact_requests` (admin access only via service role)
    - Add restrictive policies for `ip_usage` (system access only via service role)
    
  Note: These tables are accessed only by the backend API routes using service role key,
  so policies prevent any direct client access while keeping RLS enabled.
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_analyses_image_hash;
DROP INDEX IF EXISTS idx_analyses_user_id;
DROP INDEX IF EXISTS idx_analyses_ip_created;
DROP INDEX IF EXISTS idx_transactions_user_id;

-- Add restrictive RLS policies for contact_requests
-- Only service role can insert contact requests (via API route)
CREATE POLICY "Service role can insert contact requests"
  ON contact_requests FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can view contact requests"
  ON contact_requests FOR SELECT
  TO service_role
  USING (true);

-- Add restrictive RLS policies for ip_usage
-- Only service role can manage IP usage tracking (via API route)
CREATE POLICY "Service role can insert ip usage"
  ON ip_usage FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can view ip usage"
  ON ip_usage FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update ip usage"
  ON ip_usage FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);