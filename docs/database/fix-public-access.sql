-- Fix RLS policies to ensure public data remains accessible
-- This SQL should be run in your Supabase project

-- Ensure all entity tables have public read access
-- These policies should already exist but let's make sure they're properly configured
CREATE POLICY IF NOT EXISTS "Anyone can view parks" ON parks FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can view venues" ON venues FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can view artists" ON artists FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can view festivals" ON festivals FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can view concerts" ON concerts FOR SELECT USING (true);

-- Create policies for new user related tables to allow public viewing if needed
-- Only add these if you need to expose certain user data publicly
-- CREATE POLICY IF NOT EXISTS "Anyone can view user profiles" ON user_profiles FOR SELECT USING (true);

-- Check if all tables have the correct RLS settings
SELECT
  tablename,
  relrowsecurity AS rls_enabled
FROM
  pg_tables
JOIN
  pg_class ON pg_tables.tablename = pg_class.relname
WHERE
  schemaname = 'public'
ORDER BY
  tablename;

-- List all policies to verify configuration
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM
  pg_policies
WHERE
  schemaname = 'public'
ORDER BY
  tablename, policyname;
