-- Fix RLS policies to ensure public data remains accessible
-- This SQL should be run in your Supabase project

-- First, check existing policies
SELECT
  schemaname,
  tablename,
  policyname
FROM
  pg_policies
WHERE
  schemaname = 'public'
ORDER BY
  tablename, policyname;

-- Drop and recreate the public access policies for each table

-- Parks
DROP POLICY IF EXISTS "Anyone can view parks" ON parks;
CREATE POLICY "Anyone can view parks" ON parks FOR SELECT USING (true);

-- Venues
DROP POLICY IF EXISTS "Anyone can view venues" ON venues;
CREATE POLICY "Anyone can view venues" ON venues FOR SELECT USING (true);

-- Artists
DROP POLICY IF EXISTS "Anyone can view artists" ON artists;
CREATE POLICY "Anyone can view artists" ON artists FOR SELECT USING (true);

-- Festivals
DROP POLICY IF EXISTS "Anyone can view festivals" ON festivals;
CREATE POLICY "Anyone can view festivals" ON festivals FOR SELECT USING (true);

-- Concerts
DROP POLICY IF EXISTS "Anyone can view concerts" ON concerts;
CREATE POLICY "Anyone can view concerts" ON concerts FOR SELECT USING (true);

-- Verify that all tables have Row Level Security enabled
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

-- Verify the policies were created
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
