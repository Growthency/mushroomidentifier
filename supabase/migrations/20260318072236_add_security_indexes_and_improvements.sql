/*
  # Security Improvements and Performance Optimization

  1. Performance Improvements
    - Add index on `analyses.user_id` for faster foreign key lookups
    - Add index on `transactions.user_id` for faster foreign key lookups
    - Add index on `ip_usage.ip_address` for faster IP-based queries
    - Add index on `analyses.image_hash` for faster cache lookups

  2. Notes
    - These indexes will significantly improve query performance for user-related operations
    - The IP address index will speed up rate limiting checks
    - The image hash index will accelerate cache lookups for duplicate images
*/

-- Add index for analyses.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);

-- Add index for transactions.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Add index for ip_usage lookups (used for rate limiting)
CREATE INDEX IF NOT EXISTS idx_ip_usage_ip_address ON ip_usage(ip_address);

-- Add index for image hash lookups (used for caching)
CREATE INDEX IF NOT EXISTS idx_analyses_image_hash ON analyses(image_hash);

-- Add index for analyses timestamp for better query performance
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);

-- Add index for transactions timestamp
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);