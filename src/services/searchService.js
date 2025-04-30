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
      // Try a different approach without using .or()
      const concertPromise = Promise.all([
        // Search by artist name
        supabase
          .from('concerts')
          .select(
            `
            id,
            start_time,
            end_time,
            artists:artist_id (id, name, image_url),
            venues:venue_id (id, name),
            festivals:festival_id (id, name)
          `
          )
          .ilike('artists.name', `%${query}%`)
          .gte('start_time', new Date().toISOString())
          .order('start_time')
          .limit(limit),

        // Search by venue name
        supabase
          .from('concerts')
          .select(
            `
            id,
            start_time,
            end_time,
            artists:artist_id (id, name, image_url),
            venues:venue_id (id, name),
            festivals:festival_id (id, name)
          `
          )
          .ilike('venues.name', `%${query}%`)
          .gte('start_time', new Date().toISOString())
          .order('start_time')
          .limit(limit),
      ])
        .then(([artistResults, venueResults]) => {
          const artistData = artistResults.error ? [] : artistResults.data || [];
          const venueData = venueResults.error ? [] : venueResults.data || [];

          // Combine and deduplicate results
          const combinedResults = [...artistData];
          venueData.forEach(venueResult => {
            if (!combinedResults.some(item => item.id === venueResult.id)) {
              combinedResults.push(venueResult);
            }
          });

          // Sort by start_time
          combinedResults.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

          // Limit to the specified number
          return combinedResults.slice(0, limit);
        })
        .catch(error => {
          console.error('Error searching concerts:', error);
          return [];
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

    try {
      // Use multiple separate queries instead of .or() to avoid the syntax error
      const [artistResults, venueResults, festivalResults] = await Promise.all([
        // Search by artist name
        supabase
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
          .ilike('artists.name', `%${query}%`)
          .order('start_time')
          .limit(limit),

        // Search by venue name
        supabase
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
          .ilike('venues.name', `%${query}%`)
          .order('start_time')
          .limit(limit),

        // Search by festival name
        supabase
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
          .ilike('festivals.name', `%${query}%`)
          .order('start_time')
          .limit(limit),
      ]);

      const artistData = artistResults.error ? [] : artistResults.data || [];
      const venueData = venueResults.error ? [] : venueResults.data || [];
      const festivalData = festivalResults.error ? [] : festivalResults.data || [];

      // Combine and deduplicate results
      const combinedResults = [...artistData];

      venueData.forEach(venueResult => {
        if (!combinedResults.some(item => item.id === venueResult.id)) {
          combinedResults.push(venueResult);
        }
      });

      festivalData.forEach(festivalResult => {
        if (!combinedResults.some(item => item.id === festivalResult.id)) {
          combinedResults.push(festivalResult);
        }
      });

      // Sort by start_time and limit to requested amount
      return combinedResults
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, limit);
    } catch (error) {
      console.error(`Error searching concerts with query "${query}":`, error);
      throw error;
    }
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

    // If no text query, just execute the date filter query
    if (!query || query.trim() === '') {
      const { data, error } = await dbQuery;

      if (error) {
        console.error(`Error searching events for date ${date}:`, error);
        throw error;
      }

      return data;
    }

    // If there's a text query, we need to use separate queries and combine results
    try {
      const [dateOnlyResults, artistResults, venueResults, festivalResults] = await Promise.all([
        // Just date filter
        dbQuery,

        // Date + artist name filter
        supabase
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
          .ilike('artists.name', `%${query}%`)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
          .order('start_time')
          .limit(limit),

        // Date + venue name filter
        supabase
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
          .ilike('venues.name', `%${query}%`)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
          .order('start_time')
          .limit(limit),

        // Date + festival name filter
        supabase
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
          .ilike('festivals.name', `%${query}%`)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
          .order('start_time')
          .limit(limit),
      ]);

      // Extract data or empty arrays if there were errors
      const dateData = dateOnlyResults.error ? [] : dateOnlyResults.data || [];
      const artistData = artistResults.error ? [] : artistResults.data || [];
      const venueData = venueResults.error ? [] : venueResults.data || [];
      const festivalData = festivalResults.error ? [] : festivalResults.data || [];

      // Start with the date-only results if they match any text criteria
      const combinedResults = dateData.filter(concert => {
        const artistName = concert.artists?.name || '';
        const venueName = concert.venues?.name || '';
        const festivalName = concert.festivals?.name || '';

        return (
          artistName.toLowerCase().includes(query.toLowerCase()) ||
          venueName.toLowerCase().includes(query.toLowerCase()) ||
          festivalName.toLowerCase().includes(query.toLowerCase())
        );
      });

      // Add results from specific queries if not already included
      const addUniqueResults = resultsArray => {
        resultsArray.forEach(result => {
          if (!combinedResults.some(item => item.id === result.id)) {
            combinedResults.push(result);
          }
        });
      };

      addUniqueResults(artistData);
      addUniqueResults(venueData);
      addUniqueResults(festivalData);

      // Sort by start_time and limit to requested amount
      return combinedResults
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, limit);
    } catch (error) {
      console.error(`Error searching events for date ${date}:`, error);
      throw error;
    }
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

    // We'll handle text search separately if provided
    const hasTextQuery = query && query.trim() !== '';

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

    try {
      // If no text search is needed, just use the filters we've built
      if (!hasTextQuery) {
        const { data, error } = await dbQuery;

        if (error) {
          console.error('Error searching with filters:', error);
          throw error;
        }

        return data;
      }

      // If we need text search, use separate queries for each text condition
      // Create query builders with all the filters except for text search
      const createFilteredQuery = () => {
        let query = supabase
          .from('concerts')
          .select(
            `
            id,
            start_time,
            end_time,
            artists:artist_id (id, name, image_url),
            venues:venue_id (id, name, parks:park_id (id, name)),
            festivals:festival_id (id, name)
          `
          )
          .order('start_time')
          .limit(limit);

        // Apply date filters
        if (startDate) {
          query = query.gte('start_time', startDate.toISOString());
        } else {
          query = query.gte('start_time', new Date().toISOString());
        }

        if (endDate) {
          query = query.lte('start_time', endDate.toISOString());
        }

        // Apply entity filters
        if (artistId) {
          query = query.eq('artist_id', artistId);
        }

        if (venueId) {
          query = query.eq('venue_id', venueId);
        }

        if (festivalId) {
          query = query.eq('festival_id', festivalId);
        }

        if (parkId) {
          query = query.eq('venues.park_id', parkId);
        }

        return query;
      };

      // Execute separate queries for each text condition
      const [artistResults, venueResults, festivalResults] = await Promise.all([
        // Filter by artist name
        createFilteredQuery().ilike('artists.name', `%${query}%`),

        // Filter by venue name
        createFilteredQuery().ilike('venues.name', `%${query}%`),

        // Filter by festival name
        createFilteredQuery().ilike('festivals.name', `%${query}%`),
      ]);

      // Extract data and handle errors
      const artistData = artistResults.error ? [] : artistResults.data || [];
      const venueData = venueResults.error ? [] : venueResults.data || [];
      const festivalData = festivalResults.error ? [] : festivalResults.data || [];

      // Combine and deduplicate results
      const combinedResults = [...artistData];

      venueData.forEach(venueResult => {
        if (!combinedResults.some(item => item.id === venueResult.id)) {
          combinedResults.push(venueResult);
        }
      });

      festivalData.forEach(festivalResult => {
        if (!combinedResults.some(item => item.id === festivalResult.id)) {
          combinedResults.push(festivalResult);
        }
      });

      // Sort by start_time and limit to requested amount
      return combinedResults
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching with filters:', error);
      throw error;
    }
  },
};

export default searchService;
