-- Add indexnow_requested_at to track IndexNow submission timestamps separately from Google
ALTER TABLE indexing_cache ADD COLUMN IF NOT EXISTS indexnow_requested_at timestamptz;
