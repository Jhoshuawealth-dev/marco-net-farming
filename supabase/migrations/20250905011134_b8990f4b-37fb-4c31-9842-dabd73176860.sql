-- Create missing tables for the social feature

-- POSTS table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Users can view all posts" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update social_engagement table to support individual engagement actions
-- Add post_id and type columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'social_engagement' AND column_name = 'post_id') THEN
    ALTER TABLE public.social_engagement ADD COLUMN post_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'social_engagement' AND column_name = 'type') THEN
    ALTER TABLE public.social_engagement ADD COLUMN type TEXT CHECK (type IN ('like', 'comment', 'share'));
  END IF;
END $$;

-- Update RLS policies for social_engagement to handle individual actions
DROP POLICY IF EXISTS "Users can insert their own engagement" ON public.social_engagement;
DROP POLICY IF EXISTS "Users can view their own social stats" ON public.social_engagement;

CREATE POLICY "Users can create engagement actions" 
ON public.social_engagement 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all engagement actions" 
ON public.social_engagement 
FOR SELECT 
USING (true);

-- EVENTS table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- EVENT REGISTRATIONS table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for event registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event registrations
CREATE POLICY "Users can view their own registrations" 
ON public.event_registrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- COURSES table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  reward NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view courses" 
ON public.courses 
FOR SELECT 
USING (true);

-- COURSE PROGRESS table
CREATE TABLE IF NOT EXISTS public.course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID,
  user_id UUID NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for course progress
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course progress
CREATE POLICY "Users can view their own progress" 
ON public.course_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.course_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.course_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- ADVERTS table
CREATE TABLE IF NOT EXISTS public.adverts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  media_url TEXT,
  caption TEXT,
  is_boosted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for adverts
ALTER TABLE public.adverts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for adverts
CREATE POLICY "Anyone can view adverts" 
ON public.adverts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own adverts" 
ON public.adverts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own adverts" 
ON public.adverts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Reward functions and triggers
CREATE OR REPLACE FUNCTION reward_for_action(action text)
RETURNS numeric AS $$
BEGIN
  CASE action
    WHEN 'like' THEN RETURN 50;
    WHEN 'comment' THEN RETURN 20;
    WHEN 'share' THEN RETURN 100;
    ELSE RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Engagement rewards trigger
CREATE OR REPLACE FUNCTION handle_engagement_reward()
RETURNS trigger AS $$
BEGIN
  UPDATE users
  SET wallet_balance = wallet_balance + reward_for_action(NEW.type)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_engagement_reward ON social_engagement;
CREATE TRIGGER trg_engagement_reward
AFTER INSERT ON social_engagement
FOR EACH ROW EXECUTE FUNCTION handle_engagement_reward();

-- Mining rewards trigger
CREATE OR REPLACE FUNCTION handle_mining_reward()
RETURNS trigger AS $$
BEGIN
  UPDATE users
  SET zuka_balance = zuka_balance + NEW.mined_amount
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mining_reward ON mining_records;
CREATE TRIGGER trg_mining_reward
AFTER INSERT ON mining_records
FOR EACH ROW EXECUTE FUNCTION handle_mining_reward();

-- Course completion rewards trigger
CREATE OR REPLACE FUNCTION handle_course_completion()
RETURNS trigger AS $$
DECLARE reward_value numeric;
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    SELECT reward INTO reward_value FROM courses WHERE id = NEW.course_id;
    UPDATE users
    SET wallet_balance = wallet_balance + COALESCE(reward_value, 0)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_course_completion ON course_progress;
CREATE TRIGGER trg_course_completion
AFTER INSERT OR UPDATE ON course_progress
FOR EACH ROW EXECUTE FUNCTION handle_course_completion();