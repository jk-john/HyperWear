-- Enable pg_cron extension if not already enabled
-- You can do this in your Supabase dashboard under Database > Extensions
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- Enable http extension if not already enabled
-- CREATE EXTENSION IF NOT EXISTS http;

-- It's recommended to store your secrets in the Supabase Vault and access them via a SECURITY DEFINER function.
-- Hardcoding secrets is not recommended for production environments.

-- Replace the following placeholders with your actual Supabase project reference and the secret bearer token
-- you've created in your Vault (`PAYMENT_VERIFIER_BEARER`).
-- e.g., 'https://your-project-ref.supabase.co/functions/v1/payment-verifier'
-- e.g., '"Authorization": "Bearer your-secret-token"'

-- First, unschedule any existing cron job with the same name to avoid duplicates.
-- The `if_exists` parameter prevents an error if the job doesn't exist.
SELECT cron.unschedule('payment-verifier-job', if_exists := true);

-- Schedule the payment verifier to run every 5 minutes.
-- This job calls the 'payment-verifier' Edge Function.
SELECT cron.schedule(
  'payment-verifier-job', -- A unique name for your cron job.
  '*/5 * * * *',           -- The schedule: runs every 5 minutes.
  $$
  SELECT
    net.http_post(
      -- Replace <YOUR_PROJECT_REF> with your actual Supabase project reference.
      url:='https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/payment-verifier',
      headers:='{
        "Content-Type": "application/json",
        "Authorization": "Bearer ' || vault.secret('PAYMENT_VERIFIER_BEARER') || '"
      }'::jsonb,
      body:='{"source": "cron"}'::jsonb
    ) AS request_id;
  $$
); 