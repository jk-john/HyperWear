CREATE TABLE public.email_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NULL,
    email_type text NOT NULL,
    to_email text NOT NULL,
    status text NOT NULL,
    error text NULL,
    sent_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT email_logs_pkey PRIMARY KEY (id),
    CONSTRAINT email_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view their own email logs"
ON public.email_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow service_role to insert new email logs"
ON public.email_logs FOR INSERT
TO service_role
WITH CHECK (true); 