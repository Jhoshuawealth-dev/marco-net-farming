-- Drop problematic sync triggers and functions that cause circular dependencies
DROP TRIGGER IF EXISTS on_profile_update_sync_users ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_user_update_sync_profile ON public.users CASCADE;

DROP FUNCTION IF EXISTS public.sync_profile_to_users() CASCADE;
DROP FUNCTION IF EXISTS public.sync_users_to_profile() CASCADE;

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert into profiles table (will be skipped by register_admin_with_code if already exists)
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', NEW.email)
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert into users table only if not admin registration
  -- Admin registration will be handled by register_admin_with_code
  IF NEW.raw_user_meta_data->>'user_type' IS NULL OR NEW.raw_user_meta_data->>'user_type' != 'admin' THEN
    INSERT INTO public.users (
      id,
      email,
      full_name,
      country,
      currency_code,
      wallet_balance,
      zuka_balance
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'country', 'US'),
      COALESCE(NEW.raw_user_meta_data->>'currency_code', 'USD'),
      0,
      0
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;