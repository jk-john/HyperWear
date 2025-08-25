-- Remove redundant columns from the orders table
ALTER TABLE public.orders
DROP COLUMN IF EXISTS selected_color,
DROP COLUMN IF EXISTS selected_size;

-- Rename total columns for clarity
ALTER TABLE public.orders
RENAME COLUMN total TO total_usd;

ALTER TABLE public.orders
RENAME COLUMN total_token_amount TO total_hype;

-- Add foreign key constraint to orders table
ALTER TABLE public.orders
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Add foreign key constraint to user_addresses table
ALTER TABLE public.user_addresses
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Add foreign key constraint to user_profiles table
ALTER TABLE public.user_profiles
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Add foreign key constraint to subscribers table
ALTER TABLE public.subscribers
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;
