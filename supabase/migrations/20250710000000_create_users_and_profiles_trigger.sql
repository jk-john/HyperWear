-- The 'users' table already exists. This migration now only adds the logic to automatically create user profiles.

-- Drop policies if they exist, to avoid errors on re-running
-- DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.users;
-- DROP POLICY IF EXISTS "Users can insert their own profile." ON public.users;
-- DROP POLICY IF EXISTS "Users can update own profile." ON public.users;

-- RLS for users table
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR
-- SELECT
--   USING (TRUE);
--
-- CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT
-- WITH
--   CHECK (auth.uid () = id);
--
-- CREATE POLICY "Users can update own profile." ON public.users FOR
-- UPDATE
--   USING (auth.uid () = id);

-- Function to create a profile for a new user
CREATE
OR REPLACE FUNCTION public.handle_new_user () RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user (); 