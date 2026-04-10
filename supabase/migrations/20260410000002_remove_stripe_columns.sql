-- Remove all Stripe-related columns — Paddle is now the Merchant of Record

-- Drop stripe_customer_id from profiles
ALTER TABLE profiles
  DROP COLUMN IF EXISTS stripe_customer_id;

-- Drop stripe_payment_id from transactions
ALTER TABLE transactions
  DROP COLUMN IF EXISTS stripe_payment_id;
