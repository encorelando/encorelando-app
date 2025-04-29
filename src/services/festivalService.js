import supabase from './supabase';

/**
 * Service for festival-related API operations
 * Following mobile-first principles with optimized payloads
 */
const festivalService = {
  /**
   * Get all festivals with filtering options
   * @param {Object} options - Filter options
   * @param {string} options.name - Filter by name
   * @param {string} options.parkId - Filter by park ID
   * @param {boolean} options.includePast - Include past festivals (default: false)
   * @param {Date|string} options.startDate - Filter festivals starting from this date
   * @param {Date|string} options.endDate - Filter festivals ending before this date
   * @param {number} options.limit - Number of results to return (default: 20)
   * @param {number} options.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Object with festivals array and pagination info
   */
  async getFestivals({
    name,
    parkId,
    includePast = false,
    startDate,
    endDate,
    limit = 20,
    offset = 0,
  } = {}) {
    // Start building the query with a simplified approach to avoid chaining issues
    let query = supabase.from('festivals').select(
      `
        id,
        name,
        start_date,
        end_date,
        image_url,
        parks:park_id (id, name)
      `,
      { count: 'exact' }
    );

    // Add ordering
    query = query.order('start_date');

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Apply park filter if provided
    if (parkId) {
      query = query.eq('park_id', parkId);
    }

    // Apply name filter if provided
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    // Apply date filters if provided
    if (startDate) {
      const startDateStr =
        typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
      query = query.gte('start_date', startDateStr);
    }

    if (endDate) {
      const endDateStr =
        typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
      query = query.lte('end_date', endDateStr);
    }

    // Filter out past festivals if not includePast (and no endDate specified)
    if (!includePast && !endDate) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      query = query.gte('end_date', today);
    }

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching festivals:', error);
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
   * Get a single festival by ID with detailed information and concert lineup
   * @param {string} id - Festival UUID
   * @param {Object} options - Options
   * @param {boolean} options.includeLineup - Include full concert lineup (default: true)
   * @param {string} options.date - Filter lineup by specific date
   * @returns {Promise<Object>} Festival object with detailed information
   */
  async getFestivalById(id, { includeLineup = true, date } = {}) {
    // First get the festival details
    const { data: festival, error: festivalError } = await supabase
      .from('festivals')
      .select(
        `
        id,
        name,
        description,
        website_url,
        image_url,
        start_date,
        end_date,
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

    if (festivalError) {
      console.error(`Error fetching festival with ID ${id}:`, festivalError);
      throw festivalError;
    }

    // If lineup is not needed, return festival details only
    if (!includeLineup) {
      return festival;
    }

    // Build the lineup query with simplified approach to avoid chaining issues
    let query = supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        artists:artist_id (id, name),
        venues:venue_id (id, name)
      `
      )
      .eq('festival_id', id);

    // Filter by date if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query.gte('start_time', startOfDay.toISOString());
      query = query.lte('start_time', endOfDay.toISOString());
    }

    // Add ordering as the final step
    query = query.order('start_time');

    // Execute query
    const { data: lineup, error: lineupError } = await query;

    if (lineupError) {
      console.error(`Error fetching lineup for festival ${id}:`, lineupError);
      // Don't throw here, we still want to return the festival data
      return {
        ...festival,
        lineup: [],
      };
    }

    // Combine the results
    return {
      ...festival,
      lineup: lineup || [],
    };
  },

  /**
   * Get currently running festivals
   * @param {Object} options - Options
   * @param {string} options.parkId - Filter by park ID
   * @returns {Promise<Array>} Array of currently running festivals
   */
  async getCurrentFestivals({ parkId } = {}) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let query = supabase
      .from('festivals')
      .select(
        `
        id,
        name,
        start_date,
        end_date,
        image_url,
        parks:park_id (id, name)
      `
      )
      .lte('start_date', today)
      .gte('end_date', today)
      .order('start_date');

    if (parkId) {
      query = query.eq('park_id', parkId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching current festivals:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get upcoming festivals
   * @param {Object} options - Options
   * @param {string} options.parkId - Filter by park ID
   * @param {number} options.limit - Maximum number of results to return
   * @returns {Promise<Array>} Array of upcoming festivals
   */
  async getUpcomingFestivals({ parkId, limit = 10 } = {}) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let query = supabase
      .from('festivals')
      .select(
        `
        id,
        name,
        start_date,
        end_date,
        image_url,
        parks:park_id (id, name)
      `
      )
      .gt('start_date', today)
      .order('start_date')
      .limit(limit);

    if (parkId) {
      query = query.eq('park_id', parkId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching upcoming festivals:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get festivals by park
   * @param {string} parkId - Park UUID
   * @param {boolean} current - Whether to get only current festivals
   * @returns {Promise<Array>} Array of festivals at the park
   */
  async getFestivalsByPark(parkId, current = false) {
    let query = supabase
      .from('festivals')
      .select(
        `
        id,
        name,
        start_date,
        end_date,
        description,
        image_url
      `
      )
      .eq('park_id', parkId);

    if (current) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      query = query
        .lte('start_date', today) // Started before or today
        .gte('end_date', today); // Ends after or today
    }

    const { data, error } = await query.order('start_date');

    if (error) {
      console.error(`Error fetching festivals for park ${parkId}:`, error);
      throw new Error('API error for park festivals');
    }

    return data || [];
  },

  /**
   * Get concerts for a festival
   * @param {string} festivalId - Festival UUID
   * @param {Object} options - Options
   * @param {string} options.date - Filter by specific date
   * @param {string} options.sort - Sort option ('time' or 'alphabetical')
   * @returns {Promise<Array>} Array of concerts at the festival
   */
  async getFestivalConcerts(festivalId, { date, sort = 'time' } = {}) {
    let query = supabase
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

    // Filter by date if provided
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
      throw new Error('API error for festival concerts');
    }

    return data || [];
  },

  /**
   * Search festivals by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} Array of festival objects matching the search
   */
  async searchFestivals(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    const { data, error } = await supabase
      .from('festivals')
      .select(
        `
        id,
        name,
        start_date,
        end_date,
        image_url,
        parks:park_id (id, name)
      `
      )
      .ilike('name', `%${query}%`)
      .order('start_date')
      .limit(20);

    if (error) {
      console.error(`Error searching festivals with query "${query}":`, error);
      throw new Error('API error for festival search');
    }

    return data || [];
  },
};

export default festivalService;
