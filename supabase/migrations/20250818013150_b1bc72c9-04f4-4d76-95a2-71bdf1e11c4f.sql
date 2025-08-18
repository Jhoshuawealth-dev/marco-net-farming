-- Extend profiles table with comprehensive user profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "contact_visibility": "friends"}',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;

-- Create profile visibility policy
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (
  CASE 
    WHEN privacy_settings->>'profile_visibility' = 'public' THEN true
    WHEN privacy_settings->>'profile_visibility' = 'friends' THEN (
      EXISTS (
        SELECT 1 FROM public.follows 
        WHERE follower_id = auth.uid() AND following_id = user_id
      ) OR user_id = auth.uid()
    )
    WHEN privacy_settings->>'profile_visibility' = 'private' THEN user_id = auth.uid()
    ELSE true
  END
);

-- Create profile stats update functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for profile stats
CREATE TRIGGER update_profile_stats_follows
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_stats();

CREATE TRIGGER update_profile_stats_posts
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_stats();