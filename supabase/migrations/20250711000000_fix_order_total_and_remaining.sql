-- Drop the trigger and function
DROP TRIGGER IF EXISTS set_remaining_amount_trigger ON public.orders;
DROP FUNCTION IF EXISTS set_initial_remaining_amount();

-- Add a new total_usd column to store the total in USD
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_usd NUMERIC(10, 2);

-- Update existing orders to populate total_usd
-- For HYPE, we can't know the historic USD value, so we leave it null for now
-- For other methods, total was already in USD
UPDATE public.orders
SET total_usd = total
WHERE payment_method != 'HYPE';

-- Rename original total to total_token_amount
ALTER TABLE public.orders RENAME COLUMN total TO total_token_amount;

-- Now, rename total_usd to total
ALTER TABLE public.orders RENAME COLUMN total_usd TO total;

-- We need to adjust remaining_amount for old HYPE orders
-- As we can't know the historic conversion, this is a compromise.
-- We'll assume a 1:1 for past orders for simplicity, though this is not accurate.
UPDATE public.orders
SET remaining_amount = total_token_amount
WHERE payment_method = 'HYPE' AND total IS NULL;

-- For other payment methods, the remaining amount was correctly set against total (which was USD)
-- So we ensure remaining amount is based on token amount
UPDATE public.orders
SET remaining_amount = total_token_amount
WHERE payment_method != 'HYPE'; 