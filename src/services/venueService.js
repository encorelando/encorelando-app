import supabase from './supabase';

/**
 * Service for venue-related API operations
 * Following mobile-first principles with optimized payloads
 */
const venueService = {
  /**
   * Get all venues with filtering options
   * @param {Object} options - Filter options
   * @param {string} options.parkId - Filter by park ID
   * @param {number} options.limit - Number of results to return (default: 20)
   * @param {number} options.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Object with venues array and pagination info
   */
  async getVenues({
    parkId,
    limit = 20,
    offset = 0
  } = {}) {
    let query = supabase
      .from('venues')
      .select(`
        id,
        name,
        image_url,
        parks:park_id (id, name)
      `, { count: 'exact' })
      .order('name')
      .range(offset, offset + limit - 1);
    
    // Apply park filter if provided
    if (parkId) {
      query = query.eq('park_id', parkId);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching venues:', error);
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
   * Get a single venue by ID with detailed information and upcoming performances
   * @param {string} id - Venue UUID
   * @returns {Promise<Object>} Venue object with detailed information
   */
  async getVenueById(id) {
    // First get the venue details
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select(`
        id,
        name,
        description,
        location_details,
        image_url,
        created_at,
        updated_at,
        parks:park_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();
    
    if (venueError) {
      console.error(`Error fetching venue with ID ${id}:`, venueError);
      throw venueError;
    }
    
    // Then get upcoming performances at this venue
    const { data: performances, error: performancesError } = await supabase
      .from('concerts')
      .select(`
        id,
        start_time,
        end_time,
        artists:artist_id (id, name),
        festivals:festival_id (id, name)
      `)
      .eq('venue_id', id)
      .gte('start_time', new Date().toISOString())
      .order('start_time');
    
    if (performancesError) {
      console.error(`Error fetching performances for venue ${id}:`, performancesError);
      // Don't throw here, we still want to return the venue data
      return {
        ...venue,
        upcoming_performances: []
      };
    }
    
    // Combine the results
    return {
      ...venue,
      upcoming_performances: performances || []
    };
  },

  /**
   * Get venues by park
   * @param {string} parkId - Park UUID
   * @returns {Promise<Array>} Array of venues in the park
   */
  async getVenuesByPark(parkId) {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        id,
        name,
        description,
        location_details,
        image_url
      `)
      .eq('park_id', parkId)
      .order('name');
    
    if (error) {
      console.error(`Error fetching venues for park ${parkId}:`, error);
      throw error;
    }
    
    return data;
  },

  /**
   * Get venues with upcoming concerts
   * @param {Object} options - Options
   * @param {number} options.limit - Maximum number of venues to return
   * @returns {Promise<Array>} Array of venues with upcoming concerts
   */
  async getVenuesWithUpcomingConcerts({ limit = 20 } = {}) {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        id,
        name,
        image_url,
        parks:park_id (id, name)
      `)
      .in('id', 
        supabase
          .from('concerts')
          .select('venue_id')
          .gte('start_time', new Date().toISOString())
      )
      .order('name')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching venues with upcoming concerts:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Search venues by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} Array of venue objects matching the search
   */
  async searchVenues(query) {
    if (!query || query.trim() === '') {
      return { data: [] };
    }
    
    const { data, error } = await supabase
      .from('venues')
      .select(`
        id,
        name,
        image_url,
        parks:park_id (id, name)
      `)
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20);
    
    if (error) {
      console.error(`Error searching venues with query "${query}":`, error);
      throw error;
    }
    
    return { data };
  }
};

export default venueService;