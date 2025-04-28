import supabase from './supabase';

/**
 * Service for cross-entity search operations
 * Following mobile-first principles with optimized payloads
 */
const searchService = {
  /**
   * Perform a global search across all entities
   * @param {string} query - Search query text
   * @param {Object} options - Search options
   * @param {Array} options.types - Entity types to search (default: all)
   * @param {number} options.limit - Number of results per type (default: 5)
   * @returns {Promise<Object>} - Search results grouped by entity type
   */
  async globalSearch(
    query,
    { types = ['concerts', 'artists', 'venues', 'festivals', 'parks'], limit = 5 } = {}
  ) {
    if (!query || query.trim() === '') {
      return {
        artists: [],
        concerts: [],
        venues: [],
        festivals: [],
        parks: [],
      };
    }

    // Create an object to store our results
    const results = {
      artists: [],
      concerts: [],
      venues: [],
      festivals: [],
      parks: [],
    };

    // Build queries in parallel for better mobile performance
    const promises = [];

    // Search artists if requested
    if (types.includes('artists')) {
      const artistPromise = supabase
        .from('artists')
        .select(
          `
          id,
          name,
          image_url
        `
        )
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error searching artists:', error);
            return [];
          }
          return data;
        });

      promises.push(
        artistPromise.then(data => {
          results.artists = data;
        })
      );
    }

    // Search concerts if requested
    if (types.includes('concerts')) {
      const concertPromise = supabase
        .from('concerts')
        .select(
          `
          id,
          start_time,
          artists:artist_id (name),
          venues:venue_id (name)
        `
        )
        .or(`artists.name.ilike.%${query}%,venues.name.ilike.%${query}%`)
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error searching concerts:', error);
            return [];
          }
          return data;
        });

      promises.push(
        concertPromise.then(data => {
          results.concerts = data;
        })
      );
    }

    // Search venues if requested
    if (types.includes('venues')) {
      const venuePromise = supabase
        .from('venues')
        .select(
          `
          id,
          name,
          parks:park_id (name)
        `
        )
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error searching venues:', error);
            return [];
          }
          return data;
        });

      promises.push(
        venuePromise.then(data => {
          results.venues = data;
        })
      );
    }

    // Search festivals if requested
    if (types.includes('festivals')) {
      const festivalPromise = supabase
        .from('festivals')
        .select(
          `
          id,
          name,
          start_date,
          end_date
        `
        )
        .ilike('name', `%${query}%`)
        .order('start_date')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error searching festivals:', error);
            return [];
          }
          return data;
        });

      promises.push(
        festivalPromise.then(data => {
          results.festivals = data;
        })
      );
    }

    // Search parks if requested
    if (types.includes('parks')) {
      const parkPromise = supabase
        .from('parks')
        .select(
          `
          id,
          name
        `
        )
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error searching parks:', error);
            return [];
          }
          return data;
        });

      promises.push(
        parkPromise.then(data => {
          results.parks = data;
        })
      );
    }

    // Wait for all search queries to complete
    await Promise.all(promises);

    return results;
  },

  /**
   * Search concerts with full text search
   * @param {string} query - Search term
   * @param {Object} options - Search options
   * @param {number} options.limit - Number of results to return
   * @returns {Promise<Array>} - Concerts matching search
   */
  async searchConcerts(query, { limit = 20 } = {}) {
    if (!query || query.trim() === '') {
      return [];
    }

    const { data, error } = await supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `
      )
      .or(
        `artists.name.ilike.%${query}%,venues.name.ilike.%${query}%,festivals.name.ilike.%${query}%`
      )
      .order('start_time')
      .limit(limit);

    if (error) {
      console.error(`Error searching concerts with query "${query}":`, error);
      throw error;
    }

    return data;
  },

  /**
   * Search for events on a specific date with optional text query
   * @param {string} date - ISO8601 date (YYYY-MM-DD)
   * @param {string} query - Optional search term
   * @param {Object} options - Search options
   * @param {number} options.limit - Number of results to return
   * @returns {Promise<Array>} - Concerts matching search
   */
  async searchByDateAndTerm(date, query = '', { limit = 20 } = {}) {
    // Create start and end of day timestamps
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let dbQuery = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `
      )
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time')
      .limit(limit);

    // Add text search if query is provided
    if (query && query.trim() !== '') {
      dbQuery = dbQuery.or(
        `artists.name.ilike.%${query}%,venues.name.ilike.%${query}%,festivals.name.ilike.%${query}%`
      );
    }

    const { data, error } = await dbQuery;

    if (error) {
      console.error(`Error searching events for date ${date}:`, error);
      throw error;
    }

    return data;
  },

  /**
   * Search for upcoming events with filters
   * @param {Object} filters - Filter parameters
   * @param {string} filters.query - Search term
   * @param {string} filters.parkId - Filter by park
   * @param {string} filters.artistId - Filter by artist
   * @param {string} filters.venueId - Filter by venue
   * @param {string} filters.festivalId - Filter by festival
   * @param {Date} filters.startDate - Start date range
   * @param {Date} filters.endDate - End date range
   * @param {number} options.limit - Number of results to return
   * @returns {Promise<Array>} - Concerts matching search
   */
  async searchWithFilters(filters = {}, { limit = 20 } = {}) {
    const { query, parkId, artistId, venueId, festivalId, startDate, endDate } = filters;

    let dbQuery = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        artists:artist_id (id, name),
        venues:venue_id (id, name, parks:park_id (id, name)),
        festivals:festival_id (id, name)
      `
      )
      .order('start_time')
      .limit(limit);

    // Apply text search if provided
    if (query && query.trim() !== '') {
      dbQuery = dbQuery.or(
        `artists.name.ilike.%${query}%,venues.name.ilike.%${query}%,festivals.name.ilike.%${query}%`
      );
    }

    // Apply date filters
    if (startDate) {
      dbQuery = dbQuery.gte('start_time', startDate.toISOString());
    } else {
      // Default to upcoming only if no start date specified
      dbQuery = dbQuery.gte('start_time', new Date().toISOString());
    }

    if (endDate) {
      dbQuery = dbQuery.lte('start_time', endDate.toISOString());
    }

    // Apply entity filters
    if (artistId) {
      dbQuery = dbQuery.eq('artist_id', artistId);
    }

    if (venueId) {
      dbQuery = dbQuery.eq('venue_id', venueId);
    }

    if (festivalId) {
      dbQuery = dbQuery.eq('festival_id', festivalId);
    }

    if (parkId) {
      dbQuery = dbQuery.eq('venues.park_id', parkId);
    }

    const { data, error } = await dbQuery;

    if (error) {
      console.error('Error searching with filters:', error);
      throw error;
    }

    return data;
  },
};

export default searchService;
