-- =============================================================================
-- Migration: Paddle subscription fields on profiles + transactions link
-- =============================================================================
-- Switches the site from one-time credit packs to monthly subscription plans.
--
-- Subscription lifecycle tracked here:
--   subscription.created       → status='active', subscription_id set, first
--                                 transaction.completed fires alongside and
--                                 refreshes credits to plan allowance
--   transaction.completed      → monthly renewal; credits refresh to plan
--                                 allowance (refresh model, not stacking)
--   subscription.updated       → scheduled cancel, plan change, etc.
--   subscription.canceled      → immediate or at period_end. Netflix-style:
--                                 user keeps credits + access until
--                                 current_period_end
--   subscription.past_due      → payment retry in progress; access preserved
--                                 as grace period
--
-- Row-level security: profiles RLS is already in place from the base schema
-- (users can SELECT/UPDATE their own row). New columns inherit those policies.
-- =============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,        -- 'active'|'canceled'|'past_due'|'trialing'|'paused'|null
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_canceled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;         -- needed for customer portal sessions

COMMENT ON COLUMN profiles.subscription_id IS
  'Paddle subscription id (sub_...). NULL when user has no subscription.';
COMMENT ON COLUMN profiles.subscription_status IS
  'Paddle subscription status: active/canceled/past_due/trialing/paused. NULL = no subscription.';
COMMENT ON COLUMN profiles.current_period_end IS
  'When the current billing period ends. For canceled subscriptions this is the cutoff when access is revoked.';
COMMENT ON COLUMN profiles.subscription_canceled_at IS
  'When the user requested cancellation. Paid access still runs until current_period_end.';
COMMENT ON COLUMN profiles.paddle_customer_id IS
  'Paddle customer id (ctm_...). Used to open the customer portal for managing the subscription and payment method.';

-- Fast lookup on webhook events (subscription.updated, transaction.completed
-- for a renewal) — we receive a subscription id and need to find the profile.
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id
  ON profiles (subscription_id)
  WHERE subscription_id IS NOT NULL;

-- Link individual transactions back to the subscription that produced them.
-- One-time transactions (legacy) leave this NULL.
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT;

COMMENT ON COLUMN transactions.paddle_subscription_id IS
  'Paddle subscription id that produced this transaction. NULL for one-time purchases.';

CREATE INDEX IF NOT EXISTS idx_transactions_paddle_subscription_id
  ON transactions (paddle_subscription_id)
  WHERE paddle_subscription_id IS NOT NULL;
