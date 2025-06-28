-- Enable the pg_cron extension if it's not already enabled.
-- pg_cron is a simple cron-based job scheduler for PostgreSQL that runs in the background.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA cron;

-- Enable the pg_net extension for making HTTP requests.
-- This is required to call the payment-verifier edge function.
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Enable Supabase Vault for securely storing secrets.
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

-- NOTE: pg_cron is available on all Supabase plans, including the free tier.
-- However, free-tier projects are paused after one week of inactivity, which will
-- also pause the cron jobs. For production applications, consider upgrading to a
-- paid plan or using an external scheduler like Vercel Cron Jobs or GitHub Actions.

-- To avoid errors on subsequent runs, we first unschedule any existing job with the same name.
-- This makes the migration idempotent.
SELECT cron.unschedule('payment-verifier-cron');

-- Schedule the payment-verifier function to run every 5 minutes.
SELECT cron.schedule(
  'payment-verifier-cron',
  '*/5 * * * *', -- Cron expression for every 5 minutes
  $$
  -- The authorization token is securely retrieved from Supabase Vault.
  -- Make sure to set the 'PAYMENT_VERIFIER_BEARER' secret in your Vault.
  SELECT net.http_post(
    url := 'https://jhxxuhisdypknlvhaklm.supabase.co/functions/v1/payment-verifier',
    headers := format('{"Content-Type": "application/json", "Authorization": "Bearer %s"}', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'PAYMENT_VERIFIER_BEARER'))::jsonb
  );
  $$
);
