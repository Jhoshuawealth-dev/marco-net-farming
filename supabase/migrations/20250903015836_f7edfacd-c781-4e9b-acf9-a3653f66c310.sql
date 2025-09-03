-- Fix search path security issue for the update function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;

-- Enable RLS on currency_rates table (was missing)
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for currency_rates (public read access since it's reference data)
CREATE POLICY "Currency rates are publicly readable"
ON currency_rates FOR SELECT
USING (true);

-- Add missing INSERT policies for users table
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Add missing INSERT policies for app_settings
CREATE POLICY "Users can insert their own settings"
ON app_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);