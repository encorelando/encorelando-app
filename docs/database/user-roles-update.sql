-- Add roles column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN roles TEXT[] DEFAULT '{}';

-- Update existing admin user (if any)
UPDATE user_profiles 
SET roles = ARRAY['admin']
WHERE email = 'encorelandoapp@gmail.com';

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_roles TEXT[];
BEGIN
  SELECT roles INTO user_roles FROM user_profiles WHERE id = user_id;
  RETURN role = ANY(user_roles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace the existing is_admin function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN has_role(user_id, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the JWT function to use the new is_admin function
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql STABLE
AS $$
  SELECT
    coalesce(
      nullif(current_setting('request.jwt.claim', true), ''),
      '{}'
    )::jsonb || 
    jsonb_build_object(
      'role',
      CASE
        WHEN is_admin(auth.uid()) THEN 'admin'
        ELSE 'user'
      END
    )
$$;
