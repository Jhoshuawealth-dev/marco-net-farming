-- Add payment method and approval status to adverts
ALTER TABLE adverts ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'wallet' CHECK (payment_method IN ('wallet', 'zukacoin'));
ALTER TABLE adverts ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Create daily limits tracking table
CREATE TABLE IF NOT EXISTS daily_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  limit_date date NOT NULL DEFAULT CURRENT_DATE,
  posts_created integer DEFAULT 0,
  likes_given integer DEFAULT 0,
  comments_given integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, limit_date)
);

-- Enable RLS on daily_limits
ALTER TABLE daily_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily_limits
CREATE POLICY "Users can view their own limits"
  ON daily_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own limits"
  ON daily_limits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own limits"
  ON daily_limits FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to check daily post limit (max 2 posts per day)
CREATE OR REPLACE FUNCTION check_daily_post_limit()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  posts_today integer;
BEGIN
  SELECT COALESCE(posts_created, 0) INTO posts_today
  FROM daily_limits
  WHERE user_id = auth.uid() AND limit_date = CURRENT_DATE;
  
  RETURN COALESCE(posts_today, 0) < 2;
END;
$$;

-- Function to check daily engagement limit (max 10 likes/comments per day)
CREATE OR REPLACE FUNCTION check_daily_engagement_limit(engagement_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  count_today integer;
BEGIN
  IF engagement_type = 'like' THEN
    SELECT COALESCE(likes_given, 0) INTO count_today
    FROM daily_limits
    WHERE user_id = auth.uid() AND limit_date = CURRENT_DATE;
  ELSIF engagement_type = 'comment' THEN
    SELECT COALESCE(comments_given, 0) INTO count_today
    FROM daily_limits
    WHERE user_id = auth.uid() AND limit_date = CURRENT_DATE;
  ELSE
    RETURN true;
  END IF;
  
  RETURN COALESCE(count_today, 0) < 10;
END;
$$;

-- Function to increment daily limits
CREATE OR REPLACE FUNCTION increment_daily_limit(limit_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO daily_limits (user_id, limit_date, posts_created, likes_given, comments_given)
  VALUES (
    auth.uid(),
    CURRENT_DATE,
    CASE WHEN limit_type = 'post' THEN 1 ELSE 0 END,
    CASE WHEN limit_type = 'like' THEN 1 ELSE 0 END,
    CASE WHEN limit_type = 'comment' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, limit_date)
  DO UPDATE SET
    posts_created = daily_limits.posts_created + CASE WHEN limit_type = 'post' THEN 1 ELSE 0 END,
    likes_given = daily_limits.likes_given + CASE WHEN limit_type = 'like' THEN 1 ELSE 0 END,
    comments_given = daily_limits.comments_given + CASE WHEN limit_type = 'comment' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$;

-- Update reward function for new values
CREATE OR REPLACE FUNCTION public.reward_for_action(action text)
RETURNS numeric
LANGUAGE plpgsql
AS $$
BEGIN
  CASE action
    WHEN 'post' THEN RETURN 50;
    WHEN 'like' THEN RETURN 20;
    WHEN 'comment' THEN RETURN 20;
    WHEN 'share' THEN RETURN 100;
    ELSE RETURN 0;
  END CASE;
END;
$$;

-- Trigger to reward users for creating posts
CREATE OR REPLACE FUNCTION handle_post_creation_reward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reward 50 zukacoin for post creation
  UPDATE users
  SET zuka_balance = zuka_balance + 50
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reward_post_creation ON posts;
CREATE TRIGGER reward_post_creation
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_post_creation_reward();

-- Update engagement reward trigger to handle new reward values
DROP TRIGGER IF EXISTS reward_engagement ON social_engagement;
CREATE TRIGGER reward_engagement
  AFTER INSERT ON social_engagement
  FOR EACH ROW
  EXECUTE FUNCTION handle_engagement_reward();

-- Update adverts status to show approval_status in active ads query
-- Active ads should now be 'approved' status
UPDATE adverts SET approval_status = 'approved' WHERE status = 'active';