/**
 * Temporary debug file for tracking down search issues
 * This can be imported directly from the components where needed
 */

// Add these to any component that needs debugging
export const debugSearch = (component, query, options) => {
  console.log(`[DEBUG-${component}] Search with query "${query}" and options:`, options);
};

// Add this to the start of the globalSearch method in searchService.js
export const debugGlobalSearch = (query, options) => {
  console.log(`[DEBUG-Search] globalSearch called with query "${query}" and options:`, JSON.stringify(options, null, 2));
};

// Add this in the artist ID search section
export const debugArtistSearch = (artistIds) => {
  console.log(`[DEBUG-Search] Searching for concerts with artist IDs:`, artistIds);
  console.log(`[DEBUG-Search] Using direct equals instead of 'in' operator`);
};

// Add this to analyze results from an artist search
export const debugArtistResults = (artistId, results) => {
  console.log(`[DEBUG-Search] Artist ID "${artistId}" search returned ${results?.length || 0} results`);
  if (results?.length > 0) {
    console.log(`[DEBUG-Search] Sample result:`, JSON.stringify({
      id: results[0].id,
      artist_id: results[0].artist_id,
      artist_name: results[0].artists?.name,
      venue_name: results[0].venues?.name,
      start_time: results[0].start_time
    }, null, 2));
  }
};

// Add this to verify the PerformanceCard component's input data
export const debugPerformanceCard = (performance) => {
  console.log(`[DEBUG-Card] PerformanceCard received:`, {
    id: performance.id,
    has_artists: !!performance.artists,
    has_artist: !!performance.artist,
    artist_name: performance.artists?.name || performance.artist?.name || 'MISSING',
    has_venues: !!performance.venues,
    has_venue: !!performance.venue,
    venue_name: performance.venues?.name || performance.venue?.name || 'MISSING'
  });
};

// Helper to analyze search results for console
export const analyzeSearchResults = (results) => {
  if (!results) return 'No results object';
  
  // Return a summary of what was found
  return {
    artists: results.artists?.length || 0,
    concerts: results.concerts?.length || 0,
    venues: results.venues?.length || 0,
    festivals: results.festivals?.length || 0,
    parks: results.parks?.length || 0,
    
    // Check if concerts have proper artist data
    concertsWithArtists: results.concerts?.filter(c => c.artists?.name).length || 0,
    concertsWithVenues: results.concerts?.filter(c => c.venues?.name).length || 0,
    
    // Check the first artist to see if it has the right fields
    firstArtist: results.artists?.length > 0 ? {
      id: results.artists[0].id,
      name: results.artists[0].name || 'MISSING NAME'
    } : 'No artists',
    
    // Check the first concert to see if it has the right fields
    firstConcert: results.concerts?.length > 0 ? {
      id: results.concerts[0].id,
      artist_name: results.concerts[0].artists?.name || 'MISSING ARTIST',
      venue_name: results.concerts[0].venues?.name || 'MISSING VENUE'
    } : 'No concerts'
  };
};