import supabase from './supabase';

/**
 * Service for park-related API operations
 * Following mobile-first principles with optimized payloads
 */
const parkService = {
  /**
   * Get all parks with filtering options
   * @param {Object} options - Filter options
   * @param {string} options.name - Filter parks by name
   * @param {boolean} options.hasFestivals - Filter parks that have festivals
   * @param {number} options.limit - Number of results to return (default: 20)
   * @param {number} options.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Object with parks array and pagination info
   */
  async getParks({ name, hasFestivals, limit = 20, offset = 0 } = {}) {
    let query = supabase
      .from('parks')
      .select(
        `
        id,
        name,
        description,
        image_url
      `,
        { count: 'exact' }
      )
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    // Apply name filter if provided
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    // Apply festivals filter if provided
    if (hasFestivals === true) {
      try {
        // Get the park IDs that have festivals
        let festivalQuery = supabase.from('festivals').select('park_id');

        // Apply limit to avoid excessive data
        festivalQuery = festivalQuery.limit(1000);

        // Execute query
        const { data: festivalParks, error: festivalError } = await festivalQuery;

        if (!festivalError && festivalParks && festivalParks.length > 0) {
          const parkIds = [...new Set(festivalParks.map(f => f.park_id))];
          query = query.in('id', parkIds);
        }
      } catch (error) {
        console.error(`Error processing hasFestivals filter: ${error.message}`);
        throw error;
      }
    } else if (hasFestivals === false) {
      try {
        // Get the park IDs that have festivals
        let festivalQuery = supabase.from('festivals').select('park_id');

        // Apply limit to avoid excessive data
        festivalQuery = festivalQuery.limit(1000);

        // Execute query
        const { data: festivalParks, error: festivalError } = await festivalQuery;

        if (!festivalError && festivalParks && festivalParks.length > 0) {
          const parkIds = [...new Set(festivalParks.map(f => f.park_id))];
          // Use separate steps for 'not' operation
          query = query.not('id', 'in', parkIds);
        }
      } catch (error) {
        console.error(`Error processing hasFestivals filter: ${error.message}`);
        throw error;
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching parks:', error);
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

    // Get venues in this park with simplified query approach
    let venuesQuery = supabase
      .from('venues')
      .select(
        `
        id,
        name,
        image_url
      `
      )
      .eq('park_id', id);

    // Add ordering as a separate step
    venuesQuery = venuesQuery.order('name');

    // Execute the query
    const { data: venues, error: venuesError } = await venuesQuery;

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
   * Get venues for a park
   * @param {string} parkId - Park UUID
   * @returns {Promise<Array>} Array of venues in the park
   */
  async getParkVenues(parkId) {
    const { data, error } = await supabase
      .from('venues')
      .select(
        `
        id,
        name,
        description,
        location_details,
        image_url
      `
      )
      .eq('park_id', parkId)
      .order('name');

    if (error) {
      console.error(`Error fetching venues for park ${parkId}:`, error);
      throw new Error('API error for park venues');
    }

    return data || [];
  },

  /**
   * Get festivals for a park
   * @param {string} parkId - Park UUID
   * @param {boolean} current - Whether to get only current festivals
   * @returns {Promise<Array>} Array of festivals at the park
   */
  async getParkFestivals(parkId, current = false) {
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
   * Get concerts for a park
   * @param {string} parkId - Park UUID
   * @param {Date} startDate - Optional date to filter concerts from
   * @param {string} festivalId - Optional festival ID to filter by
   * @returns {Promise<Array>} Array of concerts at the park
   */
  async getParkConcerts(parkId, startDate = null, festivalId = null) {
    // First get the venue IDs in this park
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id')
      .eq('park_id', parkId);

    if (venuesError) {
      console.error(`Error fetching venue IDs for park ${parkId}:`, venuesError);
      throw new Error('API error for park concerts');
    }

    // Check if venues exists and has values before mapping
    if (!venues || venues.length === 0) {
      return [];
    }

    const venueIds = venues.map(venue => venue.id);

    // Now get concerts at these venues
    let query = supabase
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
      .in('venue_id', venueIds);

    if (startDate) {
      query = query.gte('start_time', startDate.toISOString());
    }

    if (festivalId) {
      query = query.eq('festival_id', festivalId);
    }

    const { data, error } = await query.order('start_time');

    if (error) {
      console.error(`Error fetching concerts for park ${parkId}:`, error);
      throw new Error('API error for park concerts');
    }

    return data || [];
  },

  /**
   * Get parks with upcoming concerts
   * @returns {Promise<Array>} Array of parks with upcoming concerts
   */
  async getParksWithUpcomingConcerts() {
    // First get venue IDs with upcoming concerts
    const { data: concertVenues, error: concertError } = await supabase
      .from('concerts')
      .select('venue_id')
      .gte('start_time', new Date().toISOString())
      .limit(1000);

    if (concertError) {
      console.error('Error fetching venues with upcoming concerts:', concertError);
      throw concertError;
    }

    if (!concertVenues || concertVenues.length === 0) {
      return [];
    }

    // Get unique venue IDs
    const venueIds = [...new Set(concertVenues.map(c => c.venue_id))];

    // Get parks for these venues
    const { data: venueParks, error: venueError } = await supabase
      .from('venues')
      .select('park_id')
      .in('id', venueIds);

    if (venueError) {
      console.error('Error fetching parks for venues:', venueError);
      throw venueError;
    }

    if (!venueParks || venueParks.length === 0) {
      return [];
    }

    // Get unique park IDs
    const parkIds = [...new Set(venueParks.map(v => v.park_id))];

    // Get park details
    const { data, error } = await supabase
      .from('parks')
      .select(
        `
        id,
        name,
        image_url
      `
      )
      .in('id', parkIds)
      .order('name');

    if (error) {
      console.error('Error fetching parks with upcoming concerts:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Search parks by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} Array of park objects matching the search
   */
  async searchParks(query) {
    if (!query || query.trim() === '') {
      return [];
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
      .order('name')
      .limit(20);

    if (error) {
      console.error(`Error searching parks with query "${query}":`, error);
      throw new Error('API error for park search');
    }

    return data || [];
  },

  /**
   * Get upcoming concerts by park
   * @param {string} parkId - Park UUID
   * @param {Object} options - Options
   * @param {number} options.limit - Number of results to return
   * @returns {Promise<Array>} Array of upcoming concerts at the park
   */
  async getUpcomingConcertsByPark(parkId, { limit = 20 } = {}) {
    // First get the venue IDs in this park
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id')
      .eq('park_id', parkId);

    if (venuesError) {
      console.error(`Error fetching venue IDs for park ${parkId}:`, venuesError);
      throw venuesError;
    }

    const venueIds = venues.map(venue => venue.id);

    if (venueIds.length === 0) {
      return [];
    }

    // Now get concerts at these venues
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
      .in('venue_id', venueIds)
      .gte('start_time', new Date().toISOString())
      .order('start_time')
      .limit(limit);

    if (error) {
      console.error(`Error fetching upcoming concerts for park ${parkId}:`, error);
      throw error;
    }

    return data || [];
  },
};

export default parkService;
