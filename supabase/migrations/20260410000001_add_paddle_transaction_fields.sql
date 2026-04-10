-- Add paddle_transaction_id to transactions table
-- Rename stripe_payment_id → kept for backward compat, paddle field added alongside

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS paddle_transaction_id TEXT;

-- Unique constraint to prevent duplicate credit grants (idempotency)
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_paddle_tx_id
  ON transactions (paddle_transaction_id)
  WHERE paddle_transaction_id IS NOT NULL;

-- Index for fast user transaction lookup
CREATE INDEX IF NOT EXISTS idx_transactions_user_id
  ON transactions (user_id);
