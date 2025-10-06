-- Add approval status to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Create ad impressions tracking for daily limit
CREATE TABLE IF NOT EXISTS ad_daily_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES adverts(id) ON DELETE CASCADE,
  impression_date date NOT NULL DEFAULT CURRENT_DATE,
  impression_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(ad_id, impression_date)
);

-- Enable RLS on ad_daily_impressions
ALTER TABLE ad_daily_impressions ENABLE ROW LEVEL SECURITY;

-- RLS policies for ad_daily_impressions
CREATE POLICY "Anyone can view ad impressions"
  ON ad_daily_impressions FOR SELECT
  USING (true);

CREATE POLICY "System can insert ad impressions"
  ON ad_daily_impressions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update ad impressions"
  ON ad_daily_impressions FOR UPDATE
  USING (true);

-- Function to check if ad can be shown today (max 5 times per day)
CREATE OR REPLACE FUNCTION can_show_ad_today(ad_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  count_today integer;
BEGIN
  SELECT COALESCE(impression_count, 0) INTO count_today
  FROM ad_daily_impressions
  WHERE ad_id = ad_uuid AND impression_date = CURRENT_DATE;
  
  RETURN COALESCE(count_today, 0) < 5;
END;
$$;

-- Function to increment ad impression count
CREATE OR REPLACE FUNCTION increment_ad_impression(ad_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO ad_daily_impressions (ad_id, impression_date, impression_count)
  VALUES (ad_uuid, CURRENT_DATE, 1)
  ON CONFLICT (ad_id, impression_date)
  DO UPDATE SET
    impression_count = ad_daily_impressions.impression_count + 1,
    updated_at = now();
END;
$$;