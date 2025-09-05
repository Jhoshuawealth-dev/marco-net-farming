-- Update adverts table with budget and monetization features
ALTER TABLE public.adverts 
ADD COLUMN IF NOT EXISTS budget NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS spent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending','approved','rejected','active','paused','completed')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- Update existing adverts to have proper status
UPDATE public.adverts SET budget = 0 WHERE budget IS NULL;
UPDATE public.adverts SET spent = 0 WHERE spent IS NULL;
UPDATE public.adverts SET status = 'pending' WHERE status IS NULL;

-- Function to handle ad creation and budget deduction
CREATE OR REPLACE FUNCTION handle_ad_creation()
RETURNS trigger AS $$
BEGIN
  -- Deduct budget from user's wallet
  UPDATE users
  SET wallet_balance = wallet_balance - NEW.budget
  WHERE id = NEW.user_id AND wallet_balance >= NEW.budget;
  
  -- Check if the update affected any rows (sufficient balance)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient wallet balance to create ad with budget %', NEW.budget;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for ad budget deduction
DROP TRIGGER IF EXISTS trg_ad_creation ON adverts;
CREATE TRIGGER trg_ad_creation
BEFORE INSERT ON adverts
FOR EACH ROW EXECUTE FUNCTION handle_ad_creation();

-- Function to track ad impressions and spending
CREATE OR REPLACE FUNCTION track_ad_impression()
RETURNS trigger AS $$
DECLARE
  cost_per_impression NUMERIC := 0.10; -- 10 cents per impression
BEGIN
  -- Update spent amount for the ad
  UPDATE adverts
  SET spent = spent + cost_per_impression
  WHERE id = NEW.ad_id AND spent < budget;
  
  -- Mark ad as completed if budget is exhausted
  UPDATE adverts
  SET status = 'completed'
  WHERE id = NEW.ad_id AND spent >= budget;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create ad impressions tracking table
CREATE TABLE IF NOT EXISTS public.ad_impressions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID,
  user_id UUID,
  impression_type TEXT NOT NULL DEFAULT 'view',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for ad impressions
ALTER TABLE public.ad_impressions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ad impressions
CREATE POLICY "Users can create impressions" 
ON public.ad_impressions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Ad owners can view impressions on their ads" 
ON public.ad_impressions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM adverts 
  WHERE adverts.id = ad_impressions.ad_id 
  AND adverts.user_id = auth.uid()
));

CREATE POLICY "Users can view their own impressions" 
ON public.ad_impressions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for ad impression tracking
DROP TRIGGER IF EXISTS trg_ad_impression ON ad_impressions;
CREATE TRIGGER trg_ad_impression
AFTER INSERT ON ad_impressions
FOR EACH ROW EXECUTE FUNCTION track_ad_impression();