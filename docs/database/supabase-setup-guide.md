# Supabase Database Setup Guide for EncoreLando

This guide provides step-by-step instructions for setting up the EncoreLando database in Supabase.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project

## Setup Instructions

### 1. Database Schema Implementation

1. Navigate to your Supabase project dashboard
2. Go to the "SQL Editor" section
3. Create a new query
4. Copy the contents of `schema.sql` from this directory and paste it into the SQL editor
5. Run the query to create all tables, constraints, indexes, and security policies

### 2. Authentication Setup

1. In the Supabase dashboard, go to "Authentication" → "Settings"
2. Configure email confirmation (enable/disable as preferred for development)
3. Set up any additional authentication providers if needed

### 3. Create Admin Role

To allow admin access to manage content:

1. Go to "SQL Editor" and create a new query
2. Run the following SQL to create a custom claim for admin users:

```sql
-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- This is a placeholder. In a real implementation, you would check against a list of admin users
  -- For example, you might have an admin_users table to check against
  -- For now, we'll use a hardcoded check for the first admin user
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = user_id AND email = 'admin@encorelando.com'
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to add the admin role to JWT
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

3. Create your admin user through the Supabase Authentication UI or API
4. Use the email address that matches what you defined in the `is_admin` function

### 4. API Keys and Environment Variables

1. In the Supabase dashboard, go to "Settings" → "API"
2. Copy the following values for use in your application:
   - Project URL
   - API Key (anon public)
   - API Key (service role) - for admin operations only

### 5. Database Connection Pooling (Optional)

For production environments, consider enabling connection pooling:

1. Go to "Database" → "Connection Pooling"
2. Enable the connection pool
3. Note the new connection string for use with high-traffic applications

## Free Tier Limitations

As noted in our Technical Architecture document, be aware of Supabase free tier limitations:

- 500MB database storage
- 1GB file storage
- 50MB of file uploads per month
- 2GB egress per month
- 100 concurrent connections
- Daily backups retained for 7 days

Monitor usage through the Supabase dashboard and plan for upgrades as user adoption increases.

## Next Steps

After completing the database setup:

1. Update your application's environment variables with the Supabase credentials
2. Implement the API layer to interact with this database
3. Create initial seed data for testing
4. Set up continuous integration for database migrations (for future changes)
