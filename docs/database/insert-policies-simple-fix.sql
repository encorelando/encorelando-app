-- Simple fix for INSERT policies
-- This script fixes all the INSERT policies with NULL qualifications

-- Fix admin entity tables INSERT policies
ALTER POLICY "Only admins can insert artists" ON artists 
    USING ((auth.jwt() ->> 'role') = 'admin');

ALTER POLICY "Only admins can insert concerts" ON concerts 
    USING ((auth.jwt() ->> 'role') = 'admin');

ALTER POLICY "Only admins can insert festivals" ON festivals 
    USING ((auth.jwt() ->> 'role') = 'admin');

ALTER POLICY "Only admins can insert parks" ON parks 
    USING ((auth.jwt() ->> 'role') = 'admin');

ALTER POLICY "Only admins can insert venues" ON venues 
    USING ((auth.jwt() ->> 'role') = 'admin');

-- Fix favorites tables INSERT policies
ALTER POLICY "Users can insert their own favorites_artists" ON favorites_artists 
    USING (auth.uid() = user_id);

ALTER POLICY "Users can insert their own favorites_concerts" ON favorites_concerts 
    USING (auth.uid() = user_id);

ALTER POLICY "Users can insert their own favorites_festivals" ON favorites_festivals 
    USING (auth.uid() = user_id);

ALTER POLICY "Users can insert their own favorites_venues" ON favorites_venues 
    USING (auth.uid() = user_id);

-- Fix user profiles INSERT policy
ALTER POLICY "Users can insert their own profile" ON user_profiles 
    USING (auth.uid() = id);
