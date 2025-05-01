/**
 * Download Static Maps Script
 *
 * This script pre-downloads static maps for known venue locations and saves them
 * as static files in the public directory. This helps reduce API calls and ensures
 * maps display reliably.
 *
 * Usage: node scripts/download-static-maps.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Directory where maps will be saved
const MAPS_DIR = path.join(__dirname, '../public/images/maps');

// Ensure the directory exists
if (!fs.existsSync(MAPS_DIR)) {
  fs.mkdirSync(MAPS_DIR, { recursive: true });
  console.log(`Created directory: ${MAPS_DIR}`);
}

// Venues from the venues_rows.csv file
const VENUES = [
  // We'll populate these from the CSV, but for now we'll hardcode the venues
  // based on the CSV information provided
  {
    id: '1',
    name: 'america_gardens_theatre',
    park_id: 'epcot',
    description: 'America Gardens Theatre at EPCOT',
    location_details: 'Within EPCOT theme park (American Adventure Pavilion area)',
    latitude: 28.373058,
    longitude: -81.549795,
  },
  {
    id: '2',
    name: 'cinderella_castle_forecourt',
    park_id: 'magic_kingdom',
    description: 'Cinderella Castle Forecourt Stage',
    location_details: 'Located at the center of Magic Kingdom in front of Cinderella Castle',
    latitude: 28.418723,
    longitude: -81.583067,
  },
  {
    id: '3',
    name: 'theater_of_stars',
    park_id: 'hollywood_studios',
    description: 'Theater of the Stars',
    location_details: "Located on Sunset Boulevard in Disney's Hollywood Studios",
    latitude: 28.358889,
    longitude: -81.558611,
  },
  {
    id: '4',
    name: 'harambe_theatre',
    park_id: 'animal_kingdom',
    description: 'Harambe Theatre',
    location_details: "Located in the Africa section of Disney's Animal Kingdom",
    latitude: 28.355278,
    longitude: -81.590278,
  },
  {
    id: '5',
    name: 'universal_music_plaza',
    park_id: 'universal_studios',
    description: 'Music Plaza Stage',
    location_details: 'Main performance venue at Universal Studios Florida',
    latitude: 28.475556,
    longitude: -81.468056,
  },
  {
    id: '6',
    name: 'mythos_amphitheater',
    park_id: 'islands_of_adventure',
    description: 'Mythos Amphitheater',
    location_details: 'Located in the Lost Continent area of Islands of Adventure',
    latitude: 28.471667,
    longitude: -81.4725,
  },
];

// Map sizes to download
const MAP_SIZES = [
  { width: 800, height: 400 },
  { width: 600, height: 300 },
  { width: 400, height: 250 },
];

/**
 * Generate Geoapify static map URL
 * @param {number} latitude - Venue latitude
 * @param {number} longitude - Venue longitude
 * @param {number} width - Map width
 * @param {number} height - Map height
 * @param {number} zoom - Map zoom level
 * @returns {string} - Complete URL
 */
function generateMapUrl(latitude, longitude, width, height, zoom = 17) {
  // Your Geoapify API key
  const apiKey = 'fa4eff3fbf8e4d28ab12ce887d9a4ef4';

  // Simply use a basic map without markers - most reliable approach
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${zoom}&apiKey=${apiKey}`;
}

/**
 * Download a map image and save it to file
 * @param {string} url - Map URL
 * @param {string} outputPath - Where to save the image
 * @returns {Promise} - Promise that resolves when download completes
 */
function downloadMap(url, outputPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to download: ${response.statusCode}`));
        }

        const file = fs.createWriteStream(outputPath);
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });

        file.on('error', err => {
          fs.unlink(outputPath, () => {});
          reject(err);
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

/**
 * Process all venues and download their maps
 */
async function downloadAllMaps() {
  console.log('Starting map downloads...');

  let downloaded = 0;
  const total = VENUES.length * MAP_SIZES.length;

  for (const venue of VENUES) {
    for (const size of MAP_SIZES) {
      const { width, height } = size;
      const filename = `${venue.name}_${width}x${height}.png`;
      const outputPath = path.join(MAPS_DIR, filename);

      // Check if file already exists to avoid unnecessary downloads
      if (fs.existsSync(outputPath)) {
        console.log(`Skipping existing map: ${filename}`);
        downloaded++;
        continue;
      }

      const url = generateMapUrl(venue.latitude, venue.longitude, width, height);

      try {
        await downloadMap(url, outputPath);
        console.log(`Downloaded: ${filename} (${++downloaded}/${total})`);

        // Add a delay to avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error downloading ${filename}:`, error.message);
      }
    }
  }

  // Create a JSON file with a mapping of coordinates to static image paths
  const mapIndex = {};

  VENUES.forEach(venue => {
    // Create coordinate keys like "28.373058,-81.549795"
    const coordKey = `${venue.latitude},${venue.longitude}`;
    mapIndex[coordKey] = {};

    MAP_SIZES.forEach(size => {
      const { width, height } = size;
      mapIndex[coordKey][
        `${width}x${height}`
      ] = `/images/maps/${venue.name}_${width}x${height}.png`;
    });
  });

  // Write the map index to a JSON file for the frontend to use
  fs.writeFileSync(
    path.join(__dirname, '../public/images/maps/mapIndex.json'),
    JSON.stringify(mapIndex, null, 2)
  );

  console.log('Map download complete! Generated mapIndex.json for frontend use.');
}

// Run the download
downloadAllMaps().catch(console.error);
