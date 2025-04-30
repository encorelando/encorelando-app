/**
 * Utility functions for formatting data for EncoreLando components
 * Following mobile-first principles by ensuring data is optimized for display
 */

/**
 * Safely formats concert data for display in components
 * Ensures all required fields are present and properly structured
 * @param {Object} concert - Raw concert data from API
 * @returns {Object} - Formatted concert data
 */
export const formatConcertData = concert => {
  if (!concert) return null;

  // Create a deep copy with all needed data
  return {
    id: concert.id,
    start_time: concert.start_time,
    end_time: concert.end_time,

    // Include raw IDs if available
    artist_id: concert.artist_id,
    venue_id: concert.venue_id,
    festival_id: concert.festival_id,

    // Handle artist data - copy the object to avoid reference issues
    artist: concert.artist ? { ...concert.artist } : concert.artists ? { ...concert.artists } : {},

    // Handle venue data
    venue: concert.venue ? { ...concert.venue } : concert.venues ? { ...concert.venues } : {},

    // Handle festival data
    festival: concert.festival
      ? { ...concert.festival }
      : concert.festivals
      ? { ...concert.festivals }
      : {},
  };
};

/**
 * Safely formats artist data for display in components
 * @param {Object} artist - Raw artist data from API
 * @returns {Object} - Formatted artist data
 */
export const formatArtistData = artist => {
  if (!artist) return null;

  return {
    id: artist.id,
    name: artist.name || 'Unknown Artist',
    image_url: artist.image_url || '',
    genres: artist.genres || [],
    description: artist.description || '',
    website_url: artist.website_url || '',
  };
};

/**
 * Safely formats festival data for display in components
 * @param {Object} festival - Raw festival data from API
 * @returns {Object} - Formatted festival data
 */
export const formatFestivalData = festival => {
  if (!festival) return null;

  return {
    id: festival.id,
    name: festival.name || 'Unknown Festival',
    start_date: festival.start_date,
    end_date: festival.end_date,
    image_url: festival.image_url || '',
    description: festival.description || '',
    website_url: festival.website_url || '',
    park: festival.park || festival.parks || {},
  };
};

/**
 * Safely formats venue data for display in components
 * @param {Object} venue - Raw venue data from API
 * @returns {Object} - Formatted venue data
 */
export const formatVenueData = venue => {
  if (!venue) return null;

  return {
    id: venue.id,
    name: venue.name || 'Unknown Venue',
    image_url: venue.image_url || '',
    description: venue.description || '',
    location_details: venue.location_details || '',
    park: venue.park || venue.parks || {},
  };
};

/**
 * Helper to log formatted data structure for debugging
 * @param {string} component - Component name
 * @param {string} type - Type of data being logged
 * @param {Object} data - Data to log
 */
export const logFormattedData = (component, type, data) => {
  console.log(
    `[${component}] Formatted ${type}:`,
    JSON.stringify({
      id: data.id,
      name: data.name || data.artist?.name || data.venue?.name,
      has_data: !!data,
    })
  );
};
