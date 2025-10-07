-- Drop the old trigger that rewards on INSERT
DROP TRIGGER IF EXISTS on_post_creation_reward ON posts;

-- Create new trigger that rewards on approval (UPDATE)
CREATE OR REPLACE FUNCTION public.handle_post_approval_reward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only reward when status changes from pending to approved
  IF NEW.approval_status = 'approved' AND (OLD.approval_status IS NULL OR OLD.approval_status = 'pending') THEN
    UPDATE users
    SET zuka_balance = zuka_balance + 50
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger on UPDATE instead of INSERT
CREATE TRIGGER on_post_approval_reward
  AFTER UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_post_approval_reward();