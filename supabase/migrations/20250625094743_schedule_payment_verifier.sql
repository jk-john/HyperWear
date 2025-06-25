-- Schedule the payment-verifier function to run every 5 minutes
SELECT cron.schedule(
    'payment-verifier-cron',
    '*/5 * * * *', -- Every 5 minutes
    $$
    SELECT net.http_post(
        url:='https://jhxxuhisdypknlvhaklm.supabase.co/functions/v1/payment-verifier',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni7subMWz4M1_mN46mWvNsCgvM"}'
    );
    $$
);
