-- Add signup_ip to profiles for IP-based duplicate account detection
-- Add plan column if not already present
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS signup_ip TEXT,
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for fast IP lookup on signup
CREATE INDEX IF NOT EXISTS idx_profiles_signup_ip ON profiles (signup_ip);

-- Index for referral code lookup
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles (referral_code);
