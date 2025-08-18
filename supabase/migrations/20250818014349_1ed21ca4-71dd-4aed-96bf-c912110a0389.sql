-- Fix security vulnerability in profiles table RLS policies
-- The current policy defaults to allowing public access when privacy_settings is null or unexpected
-- This is a major security risk

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a more secure policy that defaults to private
CREATE POLICY "Secure profile visibility based on privacy settings" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always view their own profile
  (auth.uid() = user_id) OR
  -- For other users, check privacy settings with secure defaults
  CASE
    WHEN (privacy_settings ->> 'profile_visibility') = 'public' THEN true
    WHEN (privacy_settings ->> 'profile_visibility') = 'friends' THEN 
      EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = auth.uid() 
        AND following_id = profiles.user_id
      )
    -- Default to private for any other case (including null values)
    ELSE false
  END
);

-- Remove the redundant "Users can view their own profile" policy since it's now covered above
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;