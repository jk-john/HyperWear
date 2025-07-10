-- First, ensure that Row Level Security (RLS) is enabled on the orders table.
-- This is a foundational security feature in Supabase.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view their own orders.
-- This rule checks if the 'user_id' on an order matches the ID of the
-- person trying to view it. If they don't match, the order is hidden.
CREATE POLICY "Allow users to view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow authenticated users to create new orders for themselves.
-- This rule ensures that when a user creates a new order, the 'user_id'
-- for that order is set to their own ID.
CREATE POLICY "Allow users to create their own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id); 