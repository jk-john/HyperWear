-- Add Stripe-related columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS amount_subtotal DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS amount_shipping DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS amount_tax DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS amount_total DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- Add unique constraint on stripe_session_id to prevent duplicate orders
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders (stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at);