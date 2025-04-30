-- Correct fix for INSERT policies
-- This script drops and recreates all INSERT policies with proper WITH CHECK clauses

-- Fix admin entity tables INSERT policies
DROP POLICY "Only admins can insert artists" ON artists;
CREATE POLICY "Only admins can insert artists" ON artists 
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

DROP POLICY "Only admins can insert concerts" ON concerts;
CREATE POLICY "Only admins can insert concerts" ON concerts 
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

DROP POLICY "Only admins can insert festivals" ON festivals;
CREATE POLICY "Only admins can insert festivals" ON festivals 
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

DROP POLICY "Only admins can insert parks" ON parks;
CREATE POLICY "Only admins can insert parks" ON parks 
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

DROP POLICY "Only admins can insert venues" ON venues;
CREATE POLICY "Only admins can insert venues" ON venues 
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Fix favorites tables INSERT policies
DROP POLICY "Users can insert their own favorites_artists" ON favorites_artists;
CREATE POLICY "Users can insert their own favorites_artists" ON favorites_artists 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY "Users can insert their own favorites_concerts" ON favorites_concerts;
CREATE POLICY "Users can insert their own favorites_concerts" ON favorites_concerts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY "Users can insert their own favorites_festivals" ON favorites_festivals;
CREATE POLICY "Users can insert their own favorites_festivals" ON favorites_festivals 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY "Users can insert their own favorites_venues" ON favorites_venues;
CREATE POLICY "Users can insert their own favorites_venues" ON favorites_venues 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix user profiles INSERT policy
DROP POLICY "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Verify the changes
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
  schemaname = 'public' AND cmd = 'INSERT'
ORDER BY
  tablename, policyname;
