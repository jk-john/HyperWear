-- Alter orders table to store an array of transaction hashes
ALTER TABLE public.orders
DROP COLUMN IF EXISTS tx_hash,
ADD COLUMN tx_hashes TEXT[] DEFAULT '{}';

-- Reset paid_amount and remaining_amount on existing underpaid/pending orders
-- This ensures that the new verification logic correctly recalculates the totals from scratch
UPDATE public.orders
SET
  paid_amount = 0,
  remaining_amount = total,
  tx_hashes = '{}'
WHERE
  status IN ('pending', 'underpaid'); 