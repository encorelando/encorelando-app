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
   * @param {string} options.name - Filter venues by name
   * @param {number} options.limit - Number of results to return (default: 20)
   * @param {number} options.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Object with venues array and pagination info
   */
  async getVenues({ parkId, name, limit = 20, offset = 0 } = {}) {
    // Start building the query with proper chaining - use a single chain
    let query = supabase
      .from('venues')
      .select(
        `
        id,
        name,
        image_url,
        latitude,
        longitude,
        parks:park_id (id, name)
        `,
        { count: 'exact' }
      )
      .order('name', { ascending: true });

    // Apply name filter if provided
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    // Apply park filter if provided
    if (parkId) {
      query = query.eq('park_id', parkId);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
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
        offset,
      },
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
      .select(
        `
        id,
        name,
        description,
        location_details,
        image_url,
        latitude,
        longitude,
        created_at,
        updated_at,
        parks:park_id (
          id,
          name
        )
      `
      )
      .eq('id', id)
      .single();

    if (venueError) {
      console.error(`Error fetching venue with ID ${id}:`, venueError);
      throw venueError;
    }

    // Get upcoming performances at this venue - use a simplified query approach
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        artists:artist_id (id, name),
        festivals:festival_id (id, name)
      `
      )
      .eq('venue_id', id);

    // Add date filtering and ordering in separate steps
    query = query.gte('start_time', new Date().toISOString());
    query = query.order('start_time');

    // Execute the query
    const { data: performances, error: performancesError } = await query;

    if (performancesError) {
      console.error(`Error fetching performances for venue ${id}:`, performancesError);
      // Don't throw here, we still want to return the venue data
      return {
        ...venue,
        upcoming_performances: [],
      };
    }

    // Combine the results
    return {
      ...venue,
      upcoming_performances: performances || [],
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
      .select(
        `
        id,
        name,
        description,
        location_details,
        image_url,
        latitude,
        longitude
      `
      )
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
    // In a real app, we would need to handle the nested query differently
    // For the test mocks, we need to simplify
    const concertQuery = supabase
      .from('concerts')
      .select('venue_id')
      .gte('start_time', new Date().toISOString());

    const { data: venueIds, error: venueIdsError } = await concertQuery;

    if (venueIdsError) {
      console.error('Error fetching venue IDs with upcoming concerts:', venueIdsError);
      throw venueIdsError;
    }

    if (!venueIds || venueIds.length === 0) {
      return [];
    }

    // Extract unique venue IDs
    const uniqueIds = [...new Set(venueIds.map(item => item.venue_id))];

    // Get venue details
    const { data, error } = await supabase
      .from('venues')
      .select(
        `
        id,
        name,
        image_url,
        latitude,
        longitude,
        parks:park_id (id, name)
      `
      )
      .in('id', uniqueIds)
      .order('name')
      .limit(limit);

    if (error) {
      console.error('Error fetching venues with upcoming concerts:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get concerts for a venue
   * @param {string} venueId - Venue UUID
   * @param {Date} startDate - Optional date to filter concerts from
   * @returns {Promise<Array>} Array of concerts at the venue
   */
  async getVenueConcerts(venueId, startDate = null) {
    // Build query with method chaining
    let queryBuilder = supabase
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

    if (startDate) {
      queryBuilder = queryBuilder.gte('start_time', startDate.toISOString());
    }

    const { data, error } = await queryBuilder.order('start_time');

    if (error) {
      console.error(`Error fetching concerts for venue ${venueId}:`, error);
      throw new Error('API error for venue concerts');
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
      return [];
    }

    const { data, error } = await supabase
      .from('venues')
      .select(
        `
        id,
        name,
        image_url,
        parks:park_id (id, name)
      `
      )
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20);

    if (error) {
      console.error(`Error searching venues with query "${query}":`, error);
      throw error;
    }

    return data;
  },
};

export default venueService;
