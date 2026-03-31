/*
  # Create MushroomIdentifiers.com Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users) - Primary key
      - `email` (text) - User email
      - `full_name` (text) - Display name
      - `credits` (int) - Available credits for identifications
      - `total_identifications` (int) - Lifetime identification count
      - `stripe_customer_id` (text) - Stripe customer reference
      - `created_at` (timestamptz) - Account creation timestamp

    - `analyses`
      - `id` (uuid) - Primary key
      - `user_id` (uuid, nullable) - References auth.users for logged-in users
      - `ip_address` (text) - IP address for rate limiting and free users
      - `image_hash` (text) - SHA-256 hash for caching identical images
      - `result` (jsonb) - Complete AI analysis result
      - `credits_used` (int) - Credits deducted (default 10)
      - `notes` (text, nullable) - User notes for field journal
      - `created_at` (timestamptz) - Analysis timestamp

    - `ip_usage`
      - `ip_address` (text) - Primary key
      - `count` (int) - Number of free searches today
      - `reset_date` (date) - Date for daily reset

    - `transactions`
      - `id` (uuid) - Primary key
      - `user_id` (uuid) - References auth.users
      - `stripe_payment_id` (text) - Stripe payment reference
      - `credits_added` (int) - Number of credits purchased
      - `amount_paid` (numeric) - Payment amount in dollars
      - `pack_name` (text) - Name of credit pack (Starter/Explorer/Pro)
      - `created_at` (timestamptz) - Purchase timestamp

    - `contact_requests`
      - `id` (uuid) - Primary key
      - `name` (text) - Contact name
      - `email` (text) - Contact email
      - `subject` (text) - Request subject
      - `message` (text) - Request message
      - `created_at` (timestamptz) - Request timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated user access to own data
    - Profiles: users can read/update their own profile
    - Analyses: users can view their own analyses
    - Transactions: users can view their own transactions
    - Contact requests and ip_usage: no direct user access
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  credits INT DEFAULT 0,
  total_identifications INT DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  image_hash TEXT,
  result JSONB NOT NULL,
  credits_used INT DEFAULT 10,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analyses_image_hash ON analyses(image_hash);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_ip_created ON analyses(ip_address, created_at);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- IP usage tracking table
CREATE TABLE IF NOT EXISTS ip_usage (
  ip_address TEXT PRIMARY KEY,
  count INT DEFAULT 0,
  reset_date DATE DEFAULT CURRENT_DATE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  credits_added INT,
  amount_paid NUMERIC(10,2),
  pack_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Contact requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);