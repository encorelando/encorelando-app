-- Comprehensive RLS Fix for EncoreLando
-- This script fixes public data access while maintaining security for user data

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

-- Step 2: Verify existing policies (run this first to see what policies exist)
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

-- Step 3: Ensure RLS is enabled on all tables that need it
-- This is important because disabling RLS would allow public access to everything
-- Core public data tables
ALTER TABLE parks ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;

-- User-related tables (these should have RLS enabled)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_festivals ENABLE ROW LEVEL SECURITY;

-- Step 4: Ensure public SELECT access policies exist for core entity tables
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

-- Step 5: Verify user-specific policies to ensure they're properly restricted
-- User profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles 
    FOR SELECT USING (auth.uid() = id);
    
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles 
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Favorites policies for concerts
DROP POLICY IF EXISTS "Users can view their own favorites_concerts" ON favorites_concerts;
CREATE POLICY "Users can view their own favorites_concerts" ON favorites_concerts 
    FOR SELECT USING (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can insert their own favorites_concerts" ON favorites_concerts;
CREATE POLICY "Users can insert their own favorites_concerts" ON favorites_concerts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can delete their own favorites_concerts" ON favorites_concerts;
CREATE POLICY "Users can delete their own favorites_concerts" ON favorites_concerts 
    FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies for artists
DROP POLICY IF EXISTS "Users can view their own favorites_artists" ON favorites_artists;
CREATE POLICY "Users can view their own favorites_artists" ON favorites_artists 
    FOR SELECT USING (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can insert their own favorites_artists" ON favorites_artists;
CREATE POLICY "Users can insert their own favorites_artists" ON favorites_artists 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can delete their own favorites_artists" ON favorites_artists;
CREATE POLICY "Users can delete their own favorites_artists" ON favorites_artists 
    FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies for venues
DROP POLICY IF EXISTS "Users can view their own favorites_venues" ON favorites_venues;
CREATE POLICY "Users can view their own favorites_venues" ON favorites_venues 
    FOR SELECT USING (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can insert their own favorites_venues" ON favorites_venues;
CREATE POLICY "Users can insert their own favorites_venues" ON favorites_venues 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can delete their own favorites_venues" ON favorites_venues;
CREATE POLICY "Users can delete their own favorites_venues" ON favorites_venues 
    FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies for festivals
DROP POLICY IF EXISTS "Users can view their own favorites_festivals" ON favorites_festivals;
CREATE POLICY "Users can view their own favorites_festivals" ON favorites_festivals 
    FOR SELECT USING (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can insert their own favorites_festivals" ON favorites_festivals;
CREATE POLICY "Users can insert their own favorites_festivals" ON favorites_festivals 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can delete their own favorites_festivals" ON favorites_festivals;
CREATE POLICY "Users can delete their own favorites_festivals" ON favorites_festivals 
    FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Verify that admin policies still work
-- These should already be in place from your original schema

-- Step 7: Verify the final policies setup
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
