-- Drop the existing, restrictive policy
DROP POLICY IF EXISTS "Allow users to update their own pending orders" ON public.orders;

-- Create a new, corrected policy
CREATE POLICY "Allow users to update their own pending orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status IN ('pending', 'underpaid'))
WITH CHECK (status IN ('pending', 'underpaid', 'failed', 'cancelled')); 