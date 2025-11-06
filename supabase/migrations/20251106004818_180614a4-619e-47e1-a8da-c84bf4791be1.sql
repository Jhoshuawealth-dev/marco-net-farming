-- Create function to register first admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.register_admin_with_code(
  _user_id uuid,
  _email text,
  _full_name text,
  _admin_code text,
  _country text DEFAULT 'Admin',
  _currency_code text DEFAULT 'USD'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify admin code
  IF _admin_code != 'MARCONET-ADMIN-2025' THEN
    RAISE EXCEPTION 'Invalid admin registration code';
  END IF;
  
  -- Insert into users table
  INSERT INTO users (id, email, full_name, country, currency_code, wallet_balance, zuka_balance)
  VALUES (_user_id, _email, _full_name, _country, _currency_code, 0, 0)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert into profiles table
  INSERT INTO profiles (user_id, display_name)
  VALUES (_user_id, _full_name)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Grant admin role
  INSERT INTO user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
END;
$$;