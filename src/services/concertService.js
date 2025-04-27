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
    offset = 0
  } = {}) {
    let query = supabase
      .from('concerts')
      .select(`
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `)
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
      query = query.eq('venues.park_id', parkId);
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
        offset
      }
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
      .select(`
        id,
        start_time,
        end_time,
        notes,
        created_at,
        updated_at,
        artists:artist_id (
          id, 
          name, 
          description, 
          image_url, 
          website_url, 
          genres
        ),
        venues:venue_id (
          id, 
          name, 
          description, 
          location_details, 
          image_url,
          parks:park_id (
            id,
            name
          )
        ),
        festivals:festival_id (
          id,
          name,
          start_date,
          end_date
        )
      `)
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
      .select(`
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `)
      .gte('start_time', new Date().toISOString())
      .order('start_time')
      .limit(limit);
    
    if (parkId) {
      query = query.eq('venues.park_id', parkId);
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
    // Create start and end of day timestamps
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    let query = supabase
      .from('concerts')
      .select(`
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time');
    
    if (parkId) {
      query = query.eq('venues.park_id', parkId);
    }
    
    if (festivalId) {
      query = query.eq('festival_id', festivalId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching concerts for date ${date}:`, error);
      throw error;
    }
    
    return data;
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
      .select(`
        id,
        start_time,
        end_time,
        notes,
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `)
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
      .select(`
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name)
      `)
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
  }
};

export default concertService;