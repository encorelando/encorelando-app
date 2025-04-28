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
   * @returns {Promise<Array>} Array of concert objects
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
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artist:artist_id (id, name),
        venue:venue_id (id, name),
        festival:festival_id (id, name)
      `
      )
      .order('start_time')
      .range(offset, offset + limit - 1);

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

    if (parkId) {
      // For park filtering, we need to join with venues
      query = query.eq('venue.park_id', parkId);
    }

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

    return data;
  },

  /**
   * Get upcoming concerts
   * @param {Object} options - Filter options
   * @param {number} options.limit - Number of results (default: 20)
   * @param {string} options.parkId - Filter by park ID
   * @param {string} options.festivalId - Filter by festival ID
   * @returns {Promise<Array>} Array of upcoming concert objects
   */
  async getUpcomingConcerts({ limit = 20, parkId, festivalId } = {}) {
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artist:artist_id (id, name),
        venue:venue_id (id, name),
        festival:festival_id (id, name)
      `
      )
      .gte('start_time', new Date().toISOString())
      .order('start_time')
      .limit(limit);

    if (parkId) {
      // If parkId is an array, handle it properly by applying multiple "in" conditions
      if (Array.isArray(parkId)) {
        if (parkId.length === 1) {
          // For a single park ID, use eq operator
          query = query.eq('venue.park_id', parkId[0]);
        } else if (parkId.length > 1) {
          // For multiple park IDs, use in operator
          query = query.in('venue.park_id', parkId);
        }
      } else {
        // Handle single parkId as string
        query = query.eq('venue.park_id', parkId);
      }
      console.log(`Filtering by parks: ${JSON.stringify(parkId)}`);
    }

    if (festivalId) {
      query = query.eq('festival_id', festivalId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching upcoming concerts:', error);
      throw error;
    }

    return data;
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

    // Forcing equality on the date part of the start_time rather than using time range
    // This will ensure we match exactly on the selected date regardless of timezone
    // Get the date part in YYYY-MM-DD format
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artist:artist_id (id, name),
        venue:venue_id (id, name),
        festival:festival_id (id, name)
      `
      )
      .order('start_time');

    // Use a direct match on the date portion of the timestamp in SQL
    // This is more reliable than using time ranges that can be affected by timezone
    query = query.filter('start_time::date', 'eq', dateStr);

    // First, check if we have data for this date:
    console.log(`Querying for concerts on date: ${dateStr}`);

    if (parkId) {
      // If parkId is an array, handle it properly by applying multiple "in" conditions
      if (Array.isArray(parkId)) {
        if (parkId.length === 1) {
          // For a single park ID, use eq operator
          query = query.eq('venue.park_id', parkId[0]);
        } else if (parkId.length > 1) {
          // For multiple park IDs, use in operator
          query = query.in('venue.park_id', parkId);
        }
      } else {
        // Handle single parkId as string
        query = query.eq('venue.park_id', parkId);
      }
      console.log(`Filtering by parks: ${JSON.stringify(parkId)}`);
    }

    if (festivalId) {
      query = query.eq('festival_id', festivalId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching concerts for date ${date}:`, error);
      throw error;
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
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        venue:venue_id (id, name),
        festival:festival_id (id, name)
      `
      )
      .eq('artist_id', artistId)
      .order('start_time');

    if (!includePast) {
      query = query.gte('start_time', new Date().toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching concerts for artist ${artistId}:`, error);
      throw error;
    }

    return data;
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
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artist:artist_id (id, name),
        venue:venue_id (id, name)
      `
      )
      .eq('festival_id', festivalId);

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());
    }

    // Apply sorting
    if (sort === 'alphabetical') {
      query = query.order('artists.name');
    } else {
      query = query.order('start_time');
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching concerts for festival ${festivalId}:`, error);
      throw error;
    }

    return data;
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
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        notes,
        artist:artist_id (id, name),
        festival:festival_id (id, name)
      `
      )
      .eq('venue_id', venueId);

    if (date) {
      // For date filtering, use date string in format YYYY-MM-DD
      // and construct start/end boundaries using explicit date strings
      // to avoid timezone issues
      const dateStr = date.includes('T') ? date.split('T')[0] : date;

      // Create date boundaries with explicit time components to avoid timezone shifts
      const startDateStr = `${dateStr}T00:00:00.000Z`;
      const endDateStr = `${dateStr}T23:59:59.999Z`;

      query = query.gte('start_time', startDateStr).lte('start_time', endDateStr);
    }

    // Apply sorting
    if (sort === 'alphabetical') {
      query = query.order('artist.name');
    } else {
      query = query.order('start_time');
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching concerts for venue ${venueId}:`, error);
      throw error;
    }

    return data;
  },
};

export default concertService;
