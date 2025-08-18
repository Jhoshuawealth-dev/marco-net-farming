-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update followers count
  IF TG_TABLE_NAME = 'follows' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.profiles 
      SET followers_count = followers_count + 1
      WHERE user_id = NEW.following_id;
      
      UPDATE public.profiles 
      SET following_count = following_count + 1
      WHERE user_id = NEW.follower_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.profiles 
      SET followers_count = GREATEST(0, followers_count - 1)
      WHERE user_id = OLD.following_id;
      
      UPDATE public.profiles 
      SET following_count = GREATEST(0, following_count - 1)
      WHERE user_id = OLD.follower_id;
    END IF;
  END IF;
  
  -- Update posts count
  IF TG_TABLE_NAME = 'posts' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.profiles 
      SET posts_count = posts_count + 1
      WHERE user_id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.profiles 
      SET posts_count = GREATEST(0, posts_count - 1)
      WHERE user_id = OLD.user_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;