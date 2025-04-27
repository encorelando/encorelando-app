-- EncoreLando Supabase Database Schema
-- Based on Technical Architecture document specifications

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create parks table
CREATE TABLE parks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create venues table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  park_id UUID REFERENCES parks(id),
  description TEXT,
  location_details TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create artists table
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  genres TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create festivals table
CREATE TABLE festivals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  park_id UUID REFERENCES parks(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  website_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_festival_dates CHECK (end_date >= start_date)
);

-- Create concerts table
CREATE TABLE concerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id),
  venue_id UUID REFERENCES venues(id),
  festival_id UUID REFERENCES festivals(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Future implementation tables (commented out for MVP but included for reference)
/*
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  concert_id UUID REFERENCES concerts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, concert_id)
);
*/

-- Create indexes for optimized queries
-- Fast lookups for concerts by date
CREATE INDEX idx_concerts_start_time ON concerts (start_time);

-- Fast lookups for concerts by festival
CREATE INDEX idx_concerts_festival_id ON concerts (festival_id);

-- Fast lookups for venues by park
CREATE INDEX idx_venues_park_id ON venues (park_id);

-- Fast lookups for festivals by park
CREATE INDEX idx_festivals_park_id ON festivals (park_id);

-- Row Level Security Policies

-- Enable Row Level Security
ALTER TABLE parks ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Anyone can view parks" ON parks FOR SELECT USING (true);
CREATE POLICY "Anyone can view venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Anyone can view artists" ON artists FOR SELECT USING (true);
CREATE POLICY "Anyone can view festivals" ON festivals FOR SELECT USING (true);
CREATE POLICY "Anyone can view concerts" ON concerts FOR SELECT USING (true);

-- Admin access policies (assuming 'admin' role will be set up in Supabase)
-- FIXED: Using CHECK for INSERT policies instead of USING

-- Parks policies
CREATE POLICY "Only admins can insert parks" ON parks 
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update parks" ON parks 
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete parks" ON parks 
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Venues policies
CREATE POLICY "Only admins can insert venues" ON venues 
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update venues" ON venues 
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete venues" ON venues 
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Artists policies
CREATE POLICY "Only admins can insert artists" ON artists 
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update artists" ON artists 
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete artists" ON artists 
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Festivals policies
CREATE POLICY "Only admins can insert festivals" ON festivals 
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update festivals" ON festivals 
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete festivals" ON festivals 
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Concerts policies
CREATE POLICY "Only admins can insert concerts" ON concerts 
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update concerts" ON concerts 
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete concerts" ON concerts 
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parks_modtime
BEFORE UPDATE ON parks
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_venues_modtime
BEFORE UPDATE ON venues
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_artists_modtime
BEFORE UPDATE ON artists
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_festivals_modtime
BEFORE UPDATE ON festivals
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_concerts_modtime
BEFORE UPDATE ON concerts
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
