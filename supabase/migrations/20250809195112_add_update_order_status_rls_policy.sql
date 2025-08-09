-- Policy: Allow users to cancel their own pending orders
CREATE POLICY "Allow users to cancel their own pending orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  status = 'cancelled' AND
  (SELECT status FROM public.orders WHERE id = orders.id) = 'pending'
);
