-- Migration to add latitude and longitude coordinates to venues table
-- This is critical for our mobile-first map implementation

-- Add latitude and longitude columns to venues table
ALTER TABLE venues 
ADD COLUMN latitude DECIMAL(10,7),
ADD COLUMN longitude DECIMAL(10,7);

-- Create a GIN index for faster spatial lookups (useful for future "nearby" features)
-- This will make location-based queries more efficient on mobile devices
CREATE INDEX idx_venues_coordinates ON venues USING gin (
  ARRAY[latitude, longitude]
);

-- Comment describing the purpose of these fields
COMMENT ON COLUMN venues.latitude IS 'Venue latitude coordinate for map display';
COMMENT ON COLUMN venues.longitude IS 'Venue longitude coordinate for map display';
