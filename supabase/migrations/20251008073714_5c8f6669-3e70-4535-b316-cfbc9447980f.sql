-- Create trigger to sync display_name from profiles to users table
CREATE OR REPLACE FUNCTION public.sync_profile_to_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Update the users table when profile display_name changes
  UPDATE users
  SET full_name = NEW.display_name
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for syncing profile updates to users
DROP TRIGGER IF EXISTS on_profile_update_sync_users ON profiles;
CREATE TRIGGER on_profile_update_sync_users
  AFTER INSERT OR UPDATE OF display_name ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_to_users();

-- Create trigger to sync full_name from users to profiles table
CREATE OR REPLACE FUNCTION public.sync_users_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Update the profiles table when users full_name changes
  UPDATE profiles
  SET display_name = NEW.full_name
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for syncing user updates to profiles
DROP TRIGGER IF EXISTS on_users_update_sync_profile ON users;
CREATE TRIGGER on_users_update_sync_profile
  AFTER INSERT OR UPDATE OF full_name ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_users_to_profile();