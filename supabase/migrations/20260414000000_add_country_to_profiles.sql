-- Add country column to profiles for user geolocation tracking
-- Safe: IF NOT EXISTS prevents duplicate errors if column was manually added
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS country TEXT;

-- Index for fast country filtering in admin dashboard
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles (country);
