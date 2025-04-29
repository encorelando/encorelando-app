/**
 * Map caching utility for EncoreLando
 *
 * This utility helps reduce the number of API calls to map services
 * by using pre-downloaded static map images and localStorage caching.
 */

// Cache key prefix for localStorage
const CACHE_PREFIX = 'encorelando_map_';

// Cache expiration time (7 days in milliseconds)
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

// Store the loaded map index
let mapIndex = null;

/**
 * Load the map index from the pre-generated file
 * @returns {Promise<Object>} The map index
 */
export const loadMapIndex = async () => {
  if (mapIndex) return mapIndex;

  try {
    const response = await fetch('/images/maps/mapIndex.json');
    if (!response.ok) throw new Error('Failed to load map index');
    mapIndex = await response.json();
    return mapIndex;
  } catch (error) {
    console.error('Error loading map index:', error);
    return {};
  }
};

/**
 * Check if we have a pre-downloaded map for these coordinates and size
 * @param {number} latitude - Venue latitude
 * @param {number} longitude - Venue longitude
 * @param {number} width - Map width
 * @param {number} height - Map height
 * @returns {Promise<string|null>} - Path to the static map or null if not found
 */
export const getStaticMapPath = async (latitude, longitude, width, height) => {
  // Find the best match for the requested size
  const sizes = [
    { width: 800, height: 400 },
    { width: 600, height: 300 },
    { width: 400, height: 250 },
  ];

  // Sort sizes by how close they are to the requested size
  const bestSizeMatch = sizes.sort((a, b) => {
    const aDiff = Math.abs(a.width - width) + Math.abs(a.height - height);
    const bDiff = Math.abs(b.width - width) + Math.abs(b.height - height);
    return aDiff - bDiff;
  })[0];

  const sizeKey = `${bestSizeMatch.width}x${bestSizeMatch.height}`;

  // Try to find the exact coordinate match
  const index = await loadMapIndex();
  const coordKey = `${latitude},${longitude}`;

  if (index[coordKey] && index[coordKey][sizeKey]) {
    return index[coordKey][sizeKey];
  }

  // If no exact match, find the closest coordinates
  const allCoords = Object.keys(index);
  if (allCoords.length === 0) return null;

  // Sort coordinates by distance to the requested coordinates
  const closestCoord = allCoords.sort((a, b) => {
    const [aLat, aLng] = a.split(',').map(Number);
    const [bLat, bLng] = b.split(',').map(Number);

    const aDist = Math.sqrt(Math.pow(aLat - latitude, 2) + Math.pow(aLng - longitude, 2));
    const bDist = Math.sqrt(Math.pow(bLat - latitude, 2) + Math.pow(bLng - longitude, 2));

    return aDist - bDist;
  })[0];

  // Return the closest match if it exists
  if (index[closestCoord] && index[closestCoord][sizeKey]) {
    return index[closestCoord][sizeKey];
  }

  return null;
};

/**
 * Get a cached map URL if available
 * @param {string} cacheKey - Unique identifier for this map (typically lat-lng-width-height)
 * @returns {string|null} - The cached URL or null if not found/expired
 */
export const getCachedMap = cacheKey => {
  try {
    const cacheData = localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);

    if (!cacheData) return null;

    const { url, timestamp } = JSON.parse(cacheData);
    const now = new Date().getTime();

    // Check if the cache has expired
    if (now - timestamp > CACHE_EXPIRATION) {
      // Cache expired, remove it
      localStorage.removeItem(`${CACHE_PREFIX}${cacheKey}`);
      return null;
    }

    return url;
  } catch (error) {
    console.error('Error retrieving cached map:', error);
    return null;
  }
};

/**
 * Store a map URL in the cache
 * @param {string} cacheKey - Unique identifier for this map
 * @param {string} url - The map URL to cache
 */
export const cacheMap = (cacheKey, url) => {
  try {
    const cacheData = {
      url,
      timestamp: new Date().getTime(),
    };

    localStorage.setItem(`${CACHE_PREFIX}${cacheKey}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching map:', error);
  }
};

/**
 * Generate a static map URL using the Geoapify API
 * @param {number} latitude - Venue latitude
 * @param {number} longitude - Venue longitude
 * @param {number} width - Map width in pixels
 * @param {number} height - Map height in pixels
 * @param {number} zoom - Map zoom level (default: 17)
 * @returns {string} - The complete map URL
 */
export const generateMapUrl = (latitude, longitude, width, height, zoom = 17) => {
  // Your Geoapify API key
  const apiKey = 'fa4eff3fbf8e4d28ab12ce887d9a4ef4';
  // Simply use the OpenStreetMap tile service directly - no API key needed
  // This is a simple and reliable approach
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${zoom}&apiKey=${apiKey}`;
};

/**
 * Get the best available map URL with caching strategy
 * @param {number} latitude - Venue latitude
 * @param {number} longitude - Venue longitude
 * @param {number} width - Map width
 * @param {number} height - Map height
 * @returns {Promise<string>} - The map URL or path to use
 */
export const getMapUrl = async (latitude, longitude, width, height) => {
  // Create a cache key based on coordinates
  const cacheKey = `${latitude}-${longitude}-${width}-${height}`;

  // Check for a cached version first
  const cachedUrl = getCachedMap(cacheKey);
  if (cachedUrl) return cachedUrl;

  // Next, check if we have a pre-downloaded static map
  const staticMapPath = await getStaticMapPath(latitude, longitude, width, height);
  if (staticMapPath) {
    // Cache this path for future use
    cacheMap(cacheKey, staticMapPath);
    return staticMapPath;
  }

  // As a last resort, generate and cache a new URL from the API
  // This should happen rarely if we've pre-downloaded maps for common venues
  const url = generateMapUrl(latitude, longitude, width, height);
  cacheMap(cacheKey, url);

  return url;
};
