-- Verify and repair RLS for EncoreLando
-- This script performs a complete check and repair of RLS for all tables

-- Step 1: Check which tables have RLS enabled
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

-- Step 2: Completely recreate all public SELECT policies to ensure they work properly
-- This is a more aggressive approach to fix the RLS issues

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

-- Step 3: Verify that basic SELECT queries work without authentication
-- You can run these queries directly to test
-- SELECT * FROM artists LIMIT 5;
-- SELECT * FROM concerts LIMIT 5;
-- SELECT * FROM venues LIMIT 5;
-- SELECT * FROM festivals LIMIT 5;
-- SELECT * FROM parks LIMIT 5;

-- Step 4: Verification check - show all SELECT policies
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
  schemaname = 'public' AND cmd = 'SELECT'
ORDER BY
  tablename, policyname;

-- OPTIONAL: Temporarily disable RLS if needed for troubleshooting
-- WARNING: Only use this in a development environment for testing!
-- Uncomment these lines if you want to temporarily disable RLS for testing
/*
ALTER TABLE artists DISABLE ROW LEVEL SECURITY;
ALTER TABLE concerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE venues DISABLE ROW LEVEL SECURITY;
ALTER TABLE festivals DISABLE ROW LEVEL SECURITY;
ALTER TABLE parks DISABLE ROW LEVEL SECURITY;
*/

-- Remember to re-enable RLS after testing!
/*
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE parks ENABLE ROW LEVEL SECURITY;
*/
