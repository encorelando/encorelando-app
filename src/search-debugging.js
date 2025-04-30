/**
 * This is a utility file to add debugging during search operations
 * It can be imported and used in any components that need extra logging
 */

/**
 * Add detailed logging for search-related operations
 * @param {string} component - The component name
 * @param {string} action - What action is being logged
 * @param {any} data - The data to log
 */
export const debugLog = (component, action, data) => {
  console.log(`[${component}] ${action}:`, data);
};

/**
 * Improved console logging for nested objects
 * @param {string} component - The component name
 * @param {string} action - What action is being logged
 * @param {Object} data - The data to log
 */
export const debugLogObject = (component, action, data) => {
  console.log(`[${component}] ${action}:`, JSON.stringify(data, null, 2));
};

/**
 * Helper to trace data flow in search operations
 * @param {string} component - The component name
 * @param {string} action - What action is being logged
 * @param {Object} data - The data to trace
 */
export const traceSearchData = (component, action, data) => {
  if (!data) {
    console.log(`[${component}] ${action}: null or undefined data received`);
    return;
  }
  
  // Extract the most important details for search contexts
  const summary = {
    id: data.id,
    query: data.query || data.searchTerm,
    found: Array.isArray(data) ? data.length : 
           typeof data === 'object' ? Object.keys(data).length : 
           'N/A'
  };
  
  if (data.artist_id) summary.artist_id = data.artist_id;
  if (data.artists?.name) summary.artistName = data.artists.name;
  if (data.artist?.name) summary.artistName = data.artist.name;
  
  console.log(`[${component}] ${action}:`, summary);
};

/**
 * Specialized helper for tracing concert search issues
 * @param {string} component - The component name
 * @param {string} action - What action is being logged
 * @param {Object} concert - Concert data to analyze
 */
export const traceConcertData = (component, action, concert) => {
  if (!concert) {
    console.log(`[${component}] ${action}: null or undefined concert data`);
    return;
  }
  
  const artistInfo = concert.artist || concert.artists;
  const venueInfo = concert.venue || concert.venues;
  const festivalInfo = concert.festival || concert.festivals;
  
  const summary = {
    id: concert.id,
    start_time: concert.start_time,
    artist_id: concert.artist_id,
    
    // Extract artist information
    artist: artistInfo ? {
      id: artistInfo.id,
      name: artistInfo.name || 'No Name',
      has_image: !!artistInfo.image_url
    } : 'Missing artist',
    
    // Extract venue information
    venue: venueInfo ? {
      id: venueInfo.id,
      name: venueInfo.name || 'No Name',
      park_name: venueInfo.parks?.name || venueInfo.park?.name || 'No Park'
    } : 'Missing venue',
    
    // Extract festival information
    festival: festivalInfo ? {
      id: festivalInfo.id,
      name: festivalInfo.name || 'No Name',
    } : 'Missing festival',
  };
  
  console.log(`[${component}] ${action}:`, summary);
};