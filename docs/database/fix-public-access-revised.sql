-- Fix RLS policies to ensure public data remains accessible
-- This SQL should be run in your Supabase project

-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(schema_name text, table_name text, policy_name text) 
RETURNS boolean AS $$
DECLARE
  policy_count integer;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = schema_name
    AND tablename = table_name
    AND policyname = policy_name;
  
  RETURN policy_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Create public access policies if they don't exist
DO $$ 
BEGIN
  -- Parks
  IF NOT policy_exists('public', 'parks', 'Anyone can view parks') THEN
    CREATE POLICY "Anyone can view parks" ON parks FOR SELECT USING (true);
  END IF;
  
  -- Venues
  IF NOT policy_exists('public', 'venues', 'Anyone can view venues') THEN
    CREATE POLICY "Anyone can view venues" ON venues FOR SELECT USING (true);
  END IF;
  
  -- Artists
  IF NOT policy_exists('public', 'artists', 'Anyone can view artists') THEN
    CREATE POLICY "Anyone can view artists" ON artists FOR SELECT USING (true);
  END IF;
  
  -- Festivals
  IF NOT policy_exists('public', 'festivals', 'Anyone can view festivals') THEN
    CREATE POLICY "Anyone can view festivals" ON festivals FOR SELECT USING (true);
  END IF;
  
  -- Concerts
  IF NOT policy_exists('public', 'concerts', 'Anyone can view concerts') THEN
    CREATE POLICY "Anyone can view concerts" ON concerts FOR SELECT USING (true);
  END IF;
END $$;

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
