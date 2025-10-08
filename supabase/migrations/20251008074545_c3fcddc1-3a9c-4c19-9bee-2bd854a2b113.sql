-- Fix 1: Update handle_new_user to create both profiles AND users records
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  
  -- Insert into users table with data from metadata
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
  );
  
  RETURN NEW;
END;
$function$;

-- Fix 2: Add trigger to update posts_count on profiles
CREATE OR REPLACE FUNCTION public.update_profile_posts_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles
    SET posts_count = posts_count + 1
    WHERE user_id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET posts_count = GREATEST(posts_count - 1, 0)
    WHERE user_id = OLD.user_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE TRIGGER on_post_change_update_count
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_posts_count();

-- Fix 3: Restructure social_engagement to track individual engagements
DROP TABLE IF EXISTS social_engagement CASCADE;

CREATE TABLE public.social_engagement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  engagement_type text NOT NULL CHECK (engagement_type IN ('like', 'comment', 'share')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, post_id, engagement_type)
);

ALTER TABLE public.social_engagement ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all engagements"
  ON public.social_engagement FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own engagements"
  ON public.social_engagement FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own engagements"
  ON public.social_engagement FOR DELETE
  USING (auth.uid() = user_id);

-- Fix 4: Update engagement reward trigger to work with new structure
CREATE OR REPLACE FUNCTION public.handle_engagement_reward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  reward_amount numeric;
BEGIN
  -- Determine reward based on engagement type
  CASE NEW.engagement_type
    WHEN 'like' THEN reward_amount := 20;
    WHEN 'comment' THEN reward_amount := 20;
    WHEN 'share' THEN reward_amount := 100;
    ELSE reward_amount := 0;
  END CASE;
  
  -- Add reward to user's zuka balance
  UPDATE users
  SET zuka_balance = zuka_balance + reward_amount
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_engagement_reward
  AFTER INSERT ON social_engagement
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_engagement_reward();

-- Fix 5: Fix ad impression tracking to use proper daily limits
CREATE OR REPLACE FUNCTION public.track_ad_impression()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
DECLARE
  cost_per_impression NUMERIC := 0.10;
  daily_count INTEGER;
BEGIN
  -- Check daily impression count
  SELECT COALESCE(impression_count, 0) INTO daily_count
  FROM ad_daily_impressions
  WHERE ad_id = NEW.ad_id AND impression_date = CURRENT_DATE;
  
  -- Only process if under daily limit
  IF COALESCE(daily_count, 0) < 5 THEN
    -- Update spent amount for the ad
    UPDATE adverts
    SET spent = spent + cost_per_impression
    WHERE id = NEW.ad_id AND spent < budget;
    
    -- Mark ad as completed if budget is exhausted
    UPDATE adverts
    SET status = 'completed'
    WHERE id = NEW.ad_id AND spent >= budget;
    
    -- Increment daily impression count
    INSERT INTO ad_daily_impressions (ad_id, impression_date, impression_count)
    VALUES (NEW.ad_id, CURRENT_DATE, 1)
    ON CONFLICT (ad_id, impression_date)
    DO UPDATE SET
      impression_count = ad_daily_impressions.impression_count + 1,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$function$;