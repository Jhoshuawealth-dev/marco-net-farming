-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create security definer function to check privacy settings
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_privacy TEXT;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Users can always view their own profile
  IF current_user_id = profile_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Get the privacy setting for the profile
  SELECT privacy_settings->>'profile_visibility' 
  INTO profile_privacy
  FROM public.profiles 
  WHERE user_id = profile_user_id;
  
  -- If no privacy setting found or profile is private, deny access
  IF profile_privacy IS NULL OR profile_privacy = 'private' THEN
    RETURN FALSE;
  END IF;
  
  -- If profile is public, allow access
  IF profile_privacy = 'public' THEN
    RETURN TRUE;
  END IF;
  
  -- For 'friends' setting, you could add friendship check logic here
  -- For now, we'll default to false for safety
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create new secure policy for viewing profiles
CREATE POLICY "Users can view profiles based on privacy settings" 
ON public.profiles 
FOR SELECT 
USING (public.can_view_profile(user_id));

-- Create policy to hide sensitive fields based on contact privacy
CREATE OR REPLACE FUNCTION public.filter_profile_data(profile_row public.profiles)
RETURNS public.profiles AS $$
DECLARE
  current_user_id UUID;
  contact_privacy TEXT;
  filtered_profile public.profiles;
BEGIN
  current_user_id := auth.uid();
  filtered_profile := profile_row;
  
  -- Users can see their own full profile
  IF current_user_id = profile_row.user_id THEN
    RETURN filtered_profile;
  END IF;
  
  -- Get contact privacy setting
  contact_privacy := profile_row.privacy_settings->>'contact_visibility';
  
  -- Hide sensitive contact info based on privacy settings
  IF contact_privacy != 'public' THEN
    filtered_profile.phone := NULL;
    filtered_profile.location := NULL;
    filtered_profile.date_of_birth := NULL;
  END IF;
  
  -- Hide activity data if activity is private
  IF (profile_row.privacy_settings->>'activity_visibility') != 'public' THEN
    filtered_profile.followers_count := NULL;
    filtered_profile.following_count := NULL;
    filtered_profile.posts_count := NULL;
  END IF;
  
  RETURN filtered_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;