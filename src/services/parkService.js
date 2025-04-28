import supabase from './supabase';

/**
 * Service for park-related API operations
 * Following mobile-first principles with optimized payloads
 */
const parkService = {
  /**
   * Get all parks
   * @returns {Promise<Array>} Array of park objects
   */
  async getParks() {
    const { data, error } = await supabase
      .from('parks')
      .select(
        `
        id,
        name,
        description,
        image_url
      `
      )
      .order('name');

    if (error) {
      console.error('Error fetching parks:', error);
      throw error;
    }

    return { data };
  },

  /**
   * Get a single park by ID with detailed information including venues and festivals
   * @param {string} id - Park UUID
   * @returns {Promise<Object>} Park object with detailed information
   */
  async getParkById(id) {
    // First get the park details
    const { data: park, error: parkError } = await supabase
      .from('parks')
      .select(
        `
        id,
        name,
        description,
        website_url,
        image_url,
        created_at,
        updated_at
      `
      )
      .eq('id', id)
      .single();

    if (parkError) {
      console.error(`Error fetching park with ID ${id}:`, parkError);
      throw parkError;
    }

    // Get venues in this park
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select(
        `
        id,
        name,
        image_url
      `
      )
      .eq('park_id', id)
      .order('name');

    if (venuesError) {
      console.error(`Error fetching venues for park ${id}:`, venuesError);
      // Continue with empty venues
    }

    // Get current festivals in this park
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: currentFestivals, error: currentFestivalsError } = await supabase
      .from('festivals')
      .select(
        `
        id,
        name,
        start_date,
        end_date
      `
      )
      .eq('park_id', id)
      .lte('start_date', today)
      .gte('end_date', today)
      .order('start_date');

    if (currentFestivalsError) {
      console.error(`Error fetching current festivals for park ${id}:`, currentFestivalsError);
      // Continue with empty current festivals
    }

    // Get upcoming festivals in this park
    const { data: upcomingFestivals, error: upcomingFestivalsError } = await supabase
      .from('festivals')
      .select(
        `
        id,
        name,
        start_date,
        end_date
      `
      )
      .eq('park_id', id)
      .gt('start_date', today)
      .order('start_date');

    if (upcomingFestivalsError) {
      console.error(`Error fetching upcoming festivals for park ${id}:`, upcomingFestivalsError);
      // Continue with empty upcoming festivals
    }

    // Combine the results
    return {
      ...park,
      venues: venues || [],
      current_festivals: currentFestivals || [],
      upcoming_festivals: upcomingFestivals || [],
    };
  },

  /**
   * Get parks with upcoming concerts
   * @returns {Promise<Array>} Array of parks with upcoming concerts
   */
  async getParksWithUpcomingConcerts() {
    const { data, error } = await supabase
      .from('parks')
      .select(
        `
        id,
        name,
        image_url
      `
      )
      .in(
        'id',
        supabase
          .from('venues')
          .select('park_id')
          .in(
            'id',
            supabase.from('concerts').select('venue_id').gte('start_time', new Date().toISOString())
          )
      )
      .order('name');

    if (error) {
      console.error('Error fetching parks with upcoming concerts:', error);
      throw error;
    }

    return data;
  },

  /**
   * Search parks by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} Array of park objects matching the search
   */
  async searchParks(query) {
    if (!query || query.trim() === '') {
      return { data: [] };
    }

    const { data, error } = await supabase
      .from('parks')
      .select(
        `
        id,
        name,
        image_url
      `
      )
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) {
      console.error(`Error searching parks with query "${query}":`, error);
      throw error;
    }

    return { data };
  },

  /**
   * Get upcoming concerts by park
   * @param {string} parkId - Park UUID
   * @param {Object} options - Options
   * @param {number} options.limit - Number of results to return
   * @returns {Promise<Array>} Array of upcoming concerts at the park
   */
  async getUpcomingConcertsByPark(parkId, { limit = 20 } = {}) {
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
      .in('venue_id', supabase.from('venues').select('id').eq('park_id', parkId))
      .gte('start_time', new Date().toISOString())
      .order('start_time')
      .limit(limit);

    if (error) {
      console.error(`Error fetching upcoming concerts for park ${parkId}:`, error);
      throw error;
    }

    return data;
  },
};

export default parkService;
