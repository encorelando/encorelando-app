import supabase from './supabase';

/**
 * Service for artist-related API operations
 * Following mobile-first principles with optimized payloads
 */
const artistService = {
  /**
   * Get all artists with filtering options
   * @param {Object} options - Filter options
   * @param {string} options.name - Filter by name (partial match)
   * @param {string} options.genre - Filter by genre
   * @param {string} options.festivalId - Filter by festival participation
   * @param {number} options.limit - Number of results to return (default: 20)
   * @param {number} options.offset - Offset for pagination (default: 0)
   * @param {string} options.sort - Sort field (default: name)
   * @param {string} options.order - Sort order (asc/desc, default: asc)
   * @returns {Promise<Object>} Object with artists array and pagination info
   */
  async getArtists({
    name,
    genre,
    festivalId,
    limit = 20,
    offset = 0,
    sort = 'name',
    order = 'asc',
  } = {}) {
    // Start building the query
    let query = supabase
      .from('artists')
      .select(
        `
        id,
        name,
        image_url,
        genres`,
        { count: 'exact' }
      )
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    // Apply filters if provided
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    if (genre) {
      // Filter by array containing the genre
      query = query.contains('genres', [genre]);
    }

    if (festivalId) {
      // For festival filtering, we need a more complex query
      // using concerts as a junction to find artists performing at the festival
      query = query.in(
        'id',
        supabase.from('concerts').select('artist_id').eq('festival_id', festivalId)
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching artists:', error);
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
   * Get a single artist by ID with detailed information and upcoming performances
   * @param {string} id - Artist UUID
   * @returns {Promise<Object>} Artist object with detailed information
   */
  async getArtistById(id) {
    // First get the artist details
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();

    if (artistError) {
      console.error(`Error fetching artist with ID ${id}:`, artistError);
      throw artistError;
    }

    // Then get upcoming performances by this artist
    const { data: performances, error: performancesError } = await supabase
      .from('concerts')
      .select(
        `
        id,
        start_time,
        end_time,
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `
      )
      .eq('artist_id', id)
      .gte('start_time', new Date().toISOString())
      .order('start_time');

    if (performancesError) {
      console.error(`Error fetching performances for artist ${id}:`, performancesError);
      // Don't throw here, we still want to return the artist data
      return {
        ...artist,
        upcoming_performances: [],
      };
    }

    // Combine the results
    return {
      ...artist,
      upcoming_performances: performances || [],
    };
  },

  /**
   * Search artists by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} Array of artist objects matching the search
   */
  async searchArtists(query) {
    if (!query || query.trim() === '') {
      return { data: [] };
    }

    const { data, error } = await supabase
      .from('artists')
      .select(
        `
        id,
        name,
        image_url,
        genres
      `
      )
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20);

    if (error) {
      console.error(`Error searching artists with query "${query}":`, error);
      throw error;
    }

    return { data };
  },

  /**
   * Get artists by festival
   * @param {string} festivalId - Festival UUID
   * @returns {Promise<Array>} Array of artists performing at the festival
   */
  async getArtistsByFestival(festivalId) {
    // Get artists performing at this festival
    const { data, error } = await supabase
      .from('artists')
      .select(
        `
        id,
        name,
        image_url,
        genres
      `
      )
      .in('id', supabase.from('concerts').select('artist_id').eq('festival_id', festivalId))
      .order('name');

    if (error) {
      console.error(`Error fetching artists for festival ${festivalId}:`, error);
      throw error;
    }

    return data;
  },

  /**
   * Get artists with upcoming concerts
   * @param {Object} options - Options
   * @param {number} options.limit - Maximum number of artists to return
   * @returns {Promise<Array>} Array of artists with upcoming concerts
   */
  async getArtistsWithUpcomingConcerts({ limit = 20 } = {}) {
    // This is a more complex query to get artists with upcoming performances
    const { data, error } = await supabase
      .from('artists')
      .select(
        `
        id,
        name,
        image_url,
        genres
      `
      )
      .in(
        'id',
        supabase.from('concerts').select('artist_id').gte('start_time', new Date().toISOString())
      )
      .order('name')
      .limit(limit);

    if (error) {
      console.error('Error fetching artists with upcoming concerts:', error);
      throw error;
    }

    return data;
  },
};

export default artistService;
