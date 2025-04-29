# Supabase Authentication Setup for EncoreLando Admin

This document outlines the steps to set up Supabase authentication for the EncoreLando Admin Interface. Following these instructions will ensure the admin authentication system works properly.

## Overview

The EncoreLando Admin Interface uses Supabase Authentication with role-based access control. We've implemented a system where specific email addresses are designated as admin users, and the application checks for this role before allowing access to protected routes.

## Prerequisites

1. A Supabase project set up as described in `/docs/database/supabase-setup-guide.md`
2. Access to the Supabase dashboard for your project
3. The database schema already implemented as per `/docs/database/schema.sql`

## Step 1: Create Admin User

1. In your Supabase dashboard, navigate to "Authentication" → "Users"
2. Click "Add User" or "Invite User"
3. Enter the following information:
   - Email: `encorelandoapp@gmail.com` (or your preferred admin email)
   - Password: (Create a secure password)
4. Complete the user creation process

## Step 2: Update the is_admin Function

The `is_admin` function in the database determines which users have admin privileges. Make sure it's properly configured to recognize your admin email:

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL query to update the `is_admin` function:

```sql
-- Check if your is_admin function exists and update it
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the user's email
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  
  -- Check if it matches the admin email
  RETURN user_email = 'encorelandoapp@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Make sure to replace `'encorelandoapp@gmail.com'` with your actual admin email if different.

## Step 3: Update the JWT Function

The JWT function adds the admin role to the JWT token, which is used for role-based access control:

```sql
-- Make sure the JWT function is defined to include the admin role
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
```

## Step 4: Verify the Environment Variables

Ensure your `.env` file has the correct Supabase credentials:

```
REACT_APP_SUPABASE_URL=https://your-supabase-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase dashboard under "Settings" → "API".

## Step 5: Test the Authentication

1. Start the EncoreLando application
2. Navigate to `/admin/login`
3. Enter the admin credentials (email and password)
4. You should be redirected to the admin dashboard if authentication is successful

## Troubleshooting

### Authentication Issues

If you're having trouble with authentication:

1. **Check User Email**: Verify that the email in the `is_admin` function matches the created user
2. **JWT Claims**: You can check the JWT claims by running this code in your browser console after login:

```javascript
const { data } = await supabase.auth.getSession();
console.log(data.session.access_token);
```

Then paste the token into a JWT decoder (like [jwt.io](https://jwt.io/)) to verify the 'role' claim.

3. **Database Policies**: Ensure the Row Level Security (RLS) policies are correctly set up as in the schema.sql

### "Not an Admin" Error

If you're getting redirected to the home page with a "Not an admin" error:

1. Verify that the `isAdmin` function in the `AuthContext.jsx` correctly checks for admin status:

```javascript
const isAdmin = () => {
  if (!user) return false;
  return user.email === 'encorelandoapp@gmail.com';
};
```

2. Make sure the email matches exactly (case-sensitive)

## Adding Additional Admin Users

To add more admin users, you can modify the `is_admin` function to check for multiple emails:

```sql
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the user's email
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  
  -- Check if it matches any admin email
  RETURN user_email IN ('encorelandoapp@gmail.com', 'another-admin@example.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Security Considerations

- The admin email and password should be strong and secure
- Consider implementing two-factor authentication for admin accounts in production
- Regularly review the list of admin users
- Monitor authentication logs for suspicious activity
