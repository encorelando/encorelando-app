-- Add coordinates to existing venues for map functionality
-- These are approximate coordinates for actual venues in Orlando theme parks

-- Magic Kingdom venues
UPDATE venues 
SET latitude = 28.418473, longitude = -81.581198
WHERE name = 'Casey\'s Corner';

UPDATE venues 
SET latitude = 28.419780, longitude = -81.580928
WHERE name = 'Main Street Plaza Stage';

UPDATE venues 
SET latitude = 28.418723, longitude = -81.583067
WHERE name = 'Cinderella Castle Forecourt Stage';

-- EPCOT venues
UPDATE venues 
SET latitude = 28.373058, longitude = -81.549795
WHERE name = 'America Gardens Theatre';

UPDATE venues 
SET latitude = 28.371293, longitude = -81.552356
WHERE name = 'World Showcase Plaza';

UPDATE venues 
SET latitude = 28.373923, longitude = -81.547094
WHERE name = 'Canada Mill Stage';

-- Hollywood Studios venues
UPDATE venues 
SET latitude = 28.358889, longitude = -81.558611
WHERE name = 'Theater of the Stars';

UPDATE venues 
SET latitude = 28.359722, longitude = -81.560278
WHERE name = 'Hollywood Bowl';

-- Animal Kingdom venues
UPDATE venues 
SET latitude = 28.355278, longitude = -81.590278
WHERE name = 'Harambe Theatre';

UPDATE venues 
SET latitude = 28.359167, longitude = -81.590833
WHERE name = 'Finding Nemo Theatre';

-- Universal Studios venues
UPDATE venues 
SET latitude = 28.475556, longitude = -81.468056
WHERE name = 'Music Plaza Stage';

UPDATE venues 
SET latitude = 28.474444, longitude = -81.469444
WHERE name = 'Horror Make-Up Show Theater';

-- Islands of Adventure venues
UPDATE venues 
SET latitude = 28.471667, longitude = -81.472500
WHERE name = 'Mythos Amphitheater';

UPDATE venues 
SET latitude = 28.470556, longitude = -81.473056
WHERE name = 'Toon Lagoon Amphitheater';

-- Use a generic update for any remaining venues without specific coordinates
-- This ensures all venues have at least some coordinates for testing
UPDATE venues 
SET latitude = 28.385233, longitude = -81.563874
WHERE latitude IS NULL AND longitude IS NULL;

-- Add a comment explaining the purpose of these coordinates
COMMENT ON TABLE venues IS 'Theme park performance venues with location data for mobile map display';
