-- First, remove duplicate email entries, keeping the earliest one
DELETE FROM subscribers
WHERE
  id IN (
    SELECT
      id
    FROM
      (
        SELECT
          id,
          ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
        FROM
          subscribers
      ) t
    WHERE
      t.rn > 1
  );

-- Then, add a unique constraint to the email column if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conrelid = 'subscribers'::regclass
    AND    conname = 'subscribers_email_key'
  )
  THEN
    ALTER TABLE subscribers ADD CONSTRAINT subscribers_email_key UNIQUE (email);
  END IF;
END;
$$; 