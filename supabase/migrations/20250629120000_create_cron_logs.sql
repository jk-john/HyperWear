CREATE TABLE public.cron_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "timestamp" timestamptz NOT NULL DEFAULT now(),
    status text NOT NULL,
    message text NULL,
    details jsonb NULL,
    CONSTRAINT cron_logs_pkey PRIMARY KEY (id)
);

ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view cron logs"
ON public.cron_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow service_role to insert new cron logs"
ON public.cron_logs FOR INSERT
TO service_role
WITH CHECK (true); 