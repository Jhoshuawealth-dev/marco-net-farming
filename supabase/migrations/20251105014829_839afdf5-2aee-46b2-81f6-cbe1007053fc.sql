-- Phase 1: Enhanced Admin Permissions and Security Functions

-- Add admin DELETE permissions for users table
CREATE POLICY "Admins can delete users"
ON public.users
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add admin DELETE permissions for posts
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add admin DELETE permissions for adverts
CREATE POLICY "Admins can delete adverts"
ON public.adverts
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add admin permissions for courses management
CREATE POLICY "Admins can insert courses"
ON public.courses
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
ON public.courses
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
ON public.courses
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add admin permissions for events management
CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add admin permissions for currency rates
CREATE POLICY "Admins can insert currency rates"
ON public.currency_rates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update currency rates"
ON public.currency_rates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete currency rates"
ON public.currency_rates
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Security definer function to update user wallet balance with audit logging
CREATE OR REPLACE FUNCTION public.admin_update_user_balance(
  _user_id uuid,
  _wallet_change numeric,
  _zuka_change numeric,
  _reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can update user balances';
  END IF;
  
  -- Update user balances
  UPDATE users
  SET 
    wallet_balance = wallet_balance + _wallet_change,
    zuka_balance = zuka_balance + _zuka_change,
    updated_at = now()
  WHERE id = _user_id;
  
  -- Log the action
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (
    auth.uid(),
    'update_balance',
    'user',
    _user_id,
    jsonb_build_object(
      'wallet_change', _wallet_change,
      'zuka_change', _zuka_change,
      'reason', _reason
    )
  );
END;
$$;

-- Security definer function to update user verification status with audit logging
CREATE OR REPLACE FUNCTION public.admin_update_verification_status(
  _user_id uuid,
  _status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can update verification status';
  END IF;
  
  -- Update verification status
  UPDATE users
  SET 
    verification_status = _status,
    updated_at = now()
  WHERE id = _user_id;
  
  -- Log the action
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (
    auth.uid(),
    'update_verification',
    'user',
    _user_id,
    jsonb_build_object('new_status', _status)
  );
END;
$$;

-- Security definer function to delete user with audit logging
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  _user_id uuid,
  _reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;
  
  -- Log the action before deletion
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (
    auth.uid(),
    'delete_user',
    'user',
    _user_id,
    jsonb_build_object('reason', _reason)
  );
  
  -- Delete from users table (cascading deletes will handle related records)
  DELETE FROM users WHERE id = _user_id;
  
  -- Delete from auth.users (requires service role, but this will be handled by cascade)
END;
$$;