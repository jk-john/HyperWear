-- Add the total_token_amount column to the orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS total_token_amount numeric;

-- Backfill existing HYPE orders where total_token_amount might be null
-- This is a safe operation; it will only update if the value is currently NULL.
-- We assume the 'remaining_amount' on initial creation was set to the token amount.
UPDATE public.orders
SET total_token_amount = remaining_amount
WHERE
  payment_method IN ('HYPE', 'USDHL', 'USDT0') AND total_token_amount IS NULL; 