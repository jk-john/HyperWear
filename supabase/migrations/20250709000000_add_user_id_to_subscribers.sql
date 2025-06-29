ALTER TABLE public.subscribers
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.subscribers.user_id IS 'Link to the authenticated user, if available.'; 