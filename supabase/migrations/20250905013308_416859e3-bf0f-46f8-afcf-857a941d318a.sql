-- Update adverts table with budget and monetization features
ALTER TABLE public.adverts 
ADD COLUMN IF NOT EXISTS budget NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS spent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending','approved','rejected','active','paused','completed')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- Function to handle ad creation and budget deduction
CREATE OR REPLACE FUNCTION handle_ad_creation()
RETURNS trigger AS $$
BEGIN
  -- Only deduct budget if it's greater than 0
  IF NEW.budget > 0 THEN
    UPDATE users
    SET wallet_balance = wallet_balance - NEW.budget
    WHERE id = NEW.user_id AND wallet_balance >= NEW.budget;
    
    -- Check if the update affected any rows (sufficient balance)
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient wallet balance to create ad with budget %', NEW.budget;
    END IF;
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