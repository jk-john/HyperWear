-- Enable Row Level Security for the order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view their own order items
CREATE POLICY "Allow users to view their own order items"
ON public.order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- Policy: Allow users to add items to their own pending orders
CREATE POLICY "Allow users to add items to their own pending orders"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid() AND orders.status IN ('pending', 'underpaid')
  )
);

-- Policy: Allow users to delete items from their own pending orders
CREATE POLICY "Allow users to delete items from their own pending orders"
ON public.order_items FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid() AND orders.status IN ('pending', 'underpaid')
  )
); 