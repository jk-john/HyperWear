-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

-- Grant usage permissions for the new extensions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT USAGE ON SCHEMA net TO postgres;

-- Unschedule any existing job to prevent conflicts.
-- This makes the migration script idempotent.
SELECT cron.unschedule('payment-verifier-cron');

-- Schedule the 'payment-verifier' function to run every 5 minutes.
-- The function URL and authorization secret are configured for the production environment.
SELECT cron.schedule(
  'payment-verifier-cron',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://jhxxuhisdypknlvhaklm.supabase.co/functions/v1/payment-verifier',
    headers := format('{"Content-Type": "application/json", "Authorization": "Bearer %s"}', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'CRON_SECRET'))::jsonb,
    body := '{}'::jsonb
  );
  $$
); 