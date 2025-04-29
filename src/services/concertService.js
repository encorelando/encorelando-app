import supabase from './supabase';

/**
 * Service for concert-related API operations
 * Following mobile-first principles with optimized payloads
 */
const concertService = {
  /**
   * Get all concerts with filtering options
   * @param {Object} options - Filter options
   * @param {Date} options.startDate - Filter concerts after this date
   * @param {Date} options.endDate - Filter concerts before this date
   * @param {string} options.artistId - Filter by artist ID
   * @param {string} options.venueId - Filter by venue ID
   * @param {string} options.festivalId - Filter by festival ID
   * @param {string} options.parkId - Filter by park ID
   * @param {number} options.limit - Number of results to return (default: 20)
   * @param {number} options.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Object with concerts array and pagination info
   */
  async getConcerts({
    startDate,
    endDate,
    artistId,
    venueId,
    festivalId,
    parkId,
    limit = 20,
    offset = 0,
  } = {}) {
    // Start building the query with simplified approach to avoid chaining issues
    let query = supabase.from('concerts').select(
      `
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `,
      { count: 'exact' }
    );

    // Add ordering
    query = query.order('start_time');

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Apply filters if provided
    if (startDate) {
      query = query.gte('start_time', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('start_time', endDate.toISOString());
    }

    if (artistId) {
      query = query.eq('artist_id', artistId);
    }

    if (venueId) {
      query = query.eq('venue_id', venueId);
    }

    if (festivalId) {
      query = query.eq('festival_id', festivalId);
    }

    // For park filtering, we need to use a different approach
    if (parkId) {
      // First get venues in this park
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select('id')
        .eq('park_id', parkId);

      if (venuesError) {
        console.error(`Error fetching venues for park ${parkId}:`, venuesError);
        throw venuesError;
      }

      if (venues && venues.length > 0) {
        const venueIds = venues.map(v => v.id);
        query = query.in('venue_id', venueIds);
      } else {
        // No venues in this park, return empty result
        return {
          data: [],
          pagination: {
            total: 0,
            limit,
            offset,
          },
        };
      }
    }

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching concerts:', error);
      throw error;
    }

    return {
      data,
      pagination: {
        total: count,
        limit,
        offset,
      },
    };
  },

  /**
   * Get a single concert by ID with detailed information
   * @param {string} id - Concert UUID
   * @returns {Promise<Object>} Concert object with detailed information
   */
  async getConcertById(id) {
    // This query uses the singular versions of relationship names (artist, venue, festival)
    // which matches what the UI components expect
    const { data, error } = await supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        created_at,
        updated_at,
        artist:artist_id (
          id, 
          name, 
          description, 
          image_url, 
          website_url, 
          genres
        ),
        venue:venue_id (
          id, 
          name, 
          description, 
          location_details, 
          image_url,
          park:park_id (
            id,
            name
          )
        ),
        festival:festival_id (
          id,
          name,
          start_date,
          end_date
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching concert with ID ${id}:`, error);
      throw error;
    }

    // For debugging
    console.log('Concert data retrieved:', data);

    return data;
  },

  /**
   * Get upcoming concerts
   * @param {Object} options - Filter options
   * @param {number} options.limit - Number of results (default: 20)
   * @param {string|Array} options.parkId - Filter by park ID or array of park IDs
   * @param {string} options.festivalId - Filter by festival ID
   * @returns {Promise<Array>} Array of upcoming concert objects
   */
  async getUpcomingConcerts({ limit = 20, parkId, festivalId } = {}) {
    // Start building the base query
    const baseQuery = supabase.from('concerts').select(
      `
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `
    );

    // Add date filter
    const dateFilteredQuery = baseQuery.gte('start_time', new Date().toISOString());

    // Apply other filters
    let filteredQuery = dateFilteredQuery;

    if (parkId) {
      // Handle park filtering
      if (Array.isArray(parkId) && parkId.length > 0) {
        // Get all venues in these parks
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('id')
          .in('park_id', parkId);

        if (venuesError) {
          console.error(`Error fetching venues for parks ${parkId}:`, venuesError);
          throw venuesError;
        }

        if (venues && venues.length > 0) {
          const venueIds = venues.map(v => v.id);
          filteredQuery = filteredQuery.in('venue_id', venueIds);
        } else {
          // No venues in these parks, return empty
          return [];
        }
      } else if (typeof parkId === 'string' && parkId) {
        // Single park ID
        console.log(`Filtering by parks: "${parkId}"`);
        // Get venues in this park
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('id')
          .eq('park_id', parkId);

        if (venuesError) {
          console.error(`Error fetching venues for park ${parkId}:`, venuesError);
          throw venuesError;
        }

        if (venues && venues.length > 0) {
          const venueIds = venues.map(v => v.id);
          filteredQuery = filteredQuery.in('venue_id', venueIds);
        } else {
          // No venues in this park, return empty
          return [];
        }
      }
    }

    if (festivalId) {
      // Add festival filter
      filteredQuery = filteredQuery.eq('festival_id', festivalId);
    }

    // Add order and limit
    const orderedQuery = filteredQuery.order('start_time');
    const { data, error } = await orderedQuery.limit(limit);

    if (error) {
      console.error('Error fetching upcoming concerts:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get concerts on a specific date
   * @param {string} date - ISO8601 date (YYYY-MM-DD)
   * @param {Object} options - Filter options
   * @param {string} options.parkId - Filter by park ID
   * @param {string} options.festivalId - Filter by festival ID
   * @returns {Promise<Array>} Array of concert objects for the date
   */
  async getConcertsByDate(date, { parkId, festivalId } = {}) {
    if (!date) {
      console.error('No date provided to getConcertsByDate');
      return [];
    }

    // Create start and end of day timestamps
    // Create exact ISO string to avoid timezone issues
    const dateStr = date.includes('T') ? date.split('T')[0] : date;

    // Force UTC time to avoid timezone shifts
    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    console.log(
      `Fetching concerts between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`
    );

    // Base query with date range
    const baseQuery = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `
      )
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString());

    // Apply additional filters
    let filteredQuery = baseQuery;

    if (parkId) {
      // Handle park filtering by getting venues in the park
      if (Array.isArray(parkId) && parkId.length > 0) {
        // Get all venues in these parks
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('id')
          .in('park_id', parkId);

        if (venuesError) {
          console.error(`Error fetching venues for parks ${parkId}:`, venuesError);
          throw venuesError;
        }

        if (venues && venues.length > 0) {
          const venueIds = venues.map(v => v.id);
          filteredQuery = filteredQuery.in('venue_id', venueIds);
        } else {
          // No venues in these parks, return empty
          return [];
        }
      } else if (typeof parkId === 'string' && parkId) {
        // Single park ID
        // Get venues in this park
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('id')
          .eq('park_id', parkId);

        if (venuesError) {
          console.error(`Error fetching venues for park ${parkId}:`, venuesError);
          throw venuesError;
        }

        if (venues && venues.length > 0) {
          const venueIds = venues.map(v => v.id);
          filteredQuery = filteredQuery.in('venue_id', venueIds);
        } else {
          // No venues in this park, return empty
          return [];
        }
      }
    }

    if (festivalId) {
      filteredQuery = filteredQuery.eq('festival_id', festivalId);
    }

    // Add order
    const { data, error } = await filteredQuery.order('start_time');

    if (error) {
      console.error(`Error fetching concerts for date ${date}:`, error);
      throw new Error('API error for date concerts');
    }

    // Log what we got
    console.log(`Found ${data?.length || 0} concerts for date ${dateStr}`);
    return data || [];
  },

  /**
   * Get concerts by artist
   * @param {string} artistId - Artist UUID
   * @param {boolean} includePast - Include past concerts (default: false)
   * @returns {Promise<Array>} Array of concert objects for the artist
   */
  async getConcertsByArtist(artistId, includePast = false) {
    // Build query with simplified approach to avoid chaining issues
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        artist_id,
        start_time,
        end_time,
        notes,
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `
      )
      .eq('artist_id', artistId);

    // Apply past filter if needed
    if (!includePast) {
      query = query.gte('start_time', new Date().toISOString());
    }

    // Add ordering as final step
    query = query.order('start_time');

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching concerts for artist ${artistId}:`, error);
      throw new Error('API error for artist concerts');
    }

    // For debugging
    console.log(
      `Found ${data?.length || 0} concerts for artist ${artistId} (includePast=${includePast})`
    );

    return data || [];
  },

  /**
   * Get concerts by festival
   * @param {string} festivalId - Festival UUID
   * @param {Object} options - Filter options
   * @param {string} options.date - Filter by specific date (YYYY-MM-DD)
   * @param {string} options.sort - Sort order (chronological or alphabetical)
   * @returns {Promise<Array>} Array of concert objects for the festival
   */
  async getConcertsByFestival(festivalId, { date, sort = 'chronological' } = {}) {
    // Base query
    const baseQuery = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name)
      `
      )
      .eq('festival_id', festivalId);

    // Apply date filter if needed
    let filteredQuery = baseQuery;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filteredQuery = filteredQuery
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());
    }

    // Apply sorting
    let orderedQuery;
    if (sort === 'alphabetical') {
      // For alphabetical sorting, we need to order by artist name
      // This requires a different approach since we can't directly order by a joined field
      // Get all matching concerts first
      const { data: concerts, error: concertsError } = await filteredQuery;

      if (concertsError) {
        console.error(`Error fetching concerts for festival ${festivalId}:`, concertsError);
        throw new Error('API error for festival concerts');
      }

      // Sort manually by artist name
      const sortedData = concerts
        ? [...concerts].sort((a, b) => a.artists?.name?.localeCompare(b.artists?.name || ''))
        : [];

      return sortedData;
    } else {
      // Chronological sorting
      orderedQuery = filteredQuery.order('start_time');
    }

    const { data, error } = await orderedQuery;

    if (error) {
      console.error(`Error fetching concerts for festival ${festivalId}:`, error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get concerts by venue
   * @param {string} venueId - Venue UUID
   * @param {Object} options - Filter options
   * @param {string} options.date - Filter by specific date (YYYY-MM-DD)
   * @param {string} options.sort - Sort order (chronological or alphabetical)
   * @returns {Promise<Array>} Array of concert objects for the venue
   */
  async getConcertsByVenue(venueId, { date, sort = 'chronological' } = {}) {
    // Base query
    const baseQuery = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        festivals:festival_id (id, name)
      `
      )
      .eq('venue_id', venueId);

    // Apply date filter if needed
    let filteredQuery = baseQuery;
    if (date) {
      // For date filtering, use date string in format YYYY-MM-DD
      // and construct start/end boundaries using explicit date strings
      // to avoid timezone issues
      const dateStr = date.includes('T') ? date.split('T')[0] : date;

      // Create date boundaries with explicit time components to avoid timezone shifts
      const startDateStr = `${dateStr}T00:00:00.000Z`;
      const endDateStr = `${dateStr}T23:59:59.999Z`;

      filteredQuery = filteredQuery.gte('start_time', startDateStr).lte('start_time', endDateStr);
    }

    // Apply sorting
    let orderedQuery;
    if (sort === 'alphabetical') {
      // For alphabetical sorting, we need to order by artist name
      // This requires a different approach since we can't directly order by a joined field
      // Get all matching concerts first
      const { data: concerts, error: concertsError } = await filteredQuery;

      if (concertsError) {
        console.error(`Error fetching concerts for venue ${venueId}:`, concertsError);
        throw new Error('API error for venue concerts');
      }

      // Sort manually by artist name
      const sortedData = concerts
        ? [...concerts].sort((a, b) => a.artists?.name?.localeCompare(b.artists?.name || ''))
        : [];

      return sortedData;
    } else {
      // Chronological sorting
      orderedQuery = filteredQuery.order('start_time');
    }

    const { data, error } = await orderedQuery;

    if (error) {
      console.error(`Error fetching concerts for venue ${venueId}:`, error);
      throw error;
    }

    return data || [];
  },
};

export default concertService;
