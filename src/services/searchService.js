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
    console.log('[searchService] globalSearch called with query:', query);
    console.log('[searchService] types:', types);
    console.log('[searchService] limit:', limit);

    // Ensure query is trimmed and valid
    const trimmedQuery = query ? query.trim() : '';

    if (!trimmedQuery) {
      console.log('[searchService] Empty query, returning empty results');
      return {
        artists: [],
        concerts: [],
        venues: [],
        festivals: [],
        parks: [],
      };
    }

    // Ensure types is always an array
    const searchTypes = Array.isArray(types)
      ? types
      : ['concerts', 'artists', 'venues', 'festivals', 'parks'];
    console.log('[searchService] Normalized search types:', searchTypes);

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

    // First, find any artists that match the search term
    // This will be used to properly find concerts by the correct artist
    let artistsResult = { data: [] };
    if (searchTypes.includes('artists') || searchTypes.includes('concerts')) {
      artistsResult = await supabase
        .from('artists')
        .select('id, name, image_url')
        .ilike('name', `%${trimmedQuery}%`)
        .order('name');
    }

    const matchingArtistIds = artistsResult.data?.map(artist => artist.id) || [];
    console.log('[searchService] Found matching artist IDs:', matchingArtistIds);

    // Search artists if requested
    if (searchTypes.includes('artists')) {
      console.log('[searchService] Searching artists');

      // We already have the artists data from above
      if (!artistsResult.error && artistsResult.data) {
        console.log('[searchService] Found artists:', artistsResult.data?.length || 0);
        results.artists = artistsResult.data.slice(0, limit);
      } else {
        console.error('[searchService] Error searching artists:', artistsResult.error);
      }
    }

    // Search concerts if requested
    if (searchTypes.includes('concerts')) {
      console.log('[searchService] Searching concerts');

      const concertPromises = [];

      // If we found any matching artists, search by artist_id first (exact match)
      if (matchingArtistIds.length > 0) {
        console.log(
          '[searchService] Searching concerts by matching artist IDs:',
          matchingArtistIds
        );

        // Try a direct approach by querying each artist ID separately
        // This avoids any issues with the 'in' operator
        let artistConcerts = [];
        let artistConcertsError = null;

        // Loop through each matching artist ID and get their concerts
        for (const artistId of matchingArtistIds) {
          console.log('[searchService] Querying concerts for artist ID:', artistId);

          const { data, error } = await supabase
            .from('concerts')
            .select(
              `
              id,
              start_time,
              end_time,
              artist_id,
              artists:artist_id (id, name, image_url),
              venues:venue_id (id, name),
              festivals:festival_id (id, name)
              `
            )
            .eq('artist_id', artistId) // Use exact match with a single ID
            .gte('start_time', new Date().toISOString())
            .order('start_time')
            .limit(limit);

          if (error) {
            artistConcertsError = error;
            console.error(
              '[searchService] Error fetching concerts for artist ID',
              artistId,
              ':',
              error
            );
          } else if (data && data.length > 0) {
            console.log('[searchService] Found', data.length, 'concerts for artist ID', artistId);
            // Add these concerts to our results
            artistConcerts = [...artistConcerts, ...data];
          }
        }

        // Process the artist concerts we found
        if (artistConcertsError) {
          console.error('[searchService] Error searching by artist ID:', artistConcertsError);
        } else {
          console.log(
            '[searchService] All artist ID searches found:',
            artistConcerts?.length || 0,
            'concerts'
          );

          // If we found concerts, add them to the results and skip other searches
          if (artistConcerts && artistConcerts.length > 0) {
            console.log(
              '[searchService] Sample artist concert:',
              JSON.stringify(artistConcerts[0], null, 2)
            );

            // Skip venue/festival searches and just use these results
            // This ensures we only get concerts by the actual artist
            concertPromises.push(Promise.resolve({ data: artistConcerts }));

            // Return early with just these results
            const concertSearchPromise = Promise.all(concertPromises).then(searchResults => {
              const allConcerts = [];

              searchResults.forEach(result => {
                const data = result.error ? [] : result.data || [];

                // Add all concerts without duplicates
                data.forEach(concert => {
                  if (!allConcerts.some(existing => existing.id === concert.id)) {
                    allConcerts.push(concert);
                  }
                });
              });

              console.log(
                '[searchService] Found',
                allConcerts.length,
                'valid concerts for artist(s)'
              );
              return allConcerts.slice(0, limit);
            });

            promises.push(
              concertSearchPromise.then(data => {
                results.concerts = data;
              })
            );

            // Skip the rest of the concert search
            return;
          } else {
            console.log(
              '[searchService] No concerts found for artist IDs, using fallback searches'
            );
          }
        }
      }

      // Add additional search methods
      concertPromises.push(
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
          .ilike('venues.name', `%${trimmedQuery}%`)
          .gte('start_time', new Date().toISOString())
          .order('start_time')
          .limit(limit)
      );

      concertPromises.push(
        // Search by festival name
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
          .ilike('festivals.name', `%${trimmedQuery}%`)
          .gte('start_time', new Date().toISOString())
          .order('start_time')
          .limit(limit)
      );

      const concertSearchPromise = Promise.all(concertPromises)
        .then(searchResults => {
          // Process results from all concert searches
          const allConcerts = [];

          // Log the results from each search method
          searchResults.forEach((result, index) => {
            const data = result.error ? [] : result.data || [];
            const searchType =
              index === 0 && matchingArtistIds.length > 0
                ? 'By artist ID'
                : index === (matchingArtistIds.length > 0 ? 1 : 0)
                ? 'By venue name'
                : 'By festival name';

            console.log(`[searchService] Concert search results ${searchType}:`, data.length);

            // Log a sample of each result type if available
            if (data.length > 0) {
              console.log(
                `[searchService] ${searchType} concert sample:`,
                JSON.stringify(data[0], null, 2)
              );
            }

            // Add all concerts to our collection, avoiding duplicates
            data.forEach(concert => {
              if (!allConcerts.some(existing => existing.id === concert.id)) {
                allConcerts.push(concert);
              }
            });
          });

          // Sort by start_time
          allConcerts.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

          // Limit to the specified number
          const limitedResults = allConcerts.slice(0, limit);
          console.log('[searchService] Combined concert results:', limitedResults.length);
          return limitedResults;
        })
        .catch(error => {
          console.error('[searchService] Error searching concerts:', error);
          return [];
        });

      promises.push(
        concertSearchPromise.then(data => {
          results.concerts = data;
        })
      );
    }

    // Search venues if requested
    if (searchTypes.includes('venues')) {
      console.log('[searchService] Searching venues');
      const venuePromise = supabase
        .from('venues')
        .select(
          `
          id,
          name,
          parks:park_id (id, name)
        `
        )
        .ilike('name', `%${trimmedQuery}%`)
        .order('name')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('[searchService] Error searching venues:', error);
            return [];
          }
          console.log('[searchService] Found venues:', data?.length || 0);
          if (data?.length > 0) {
            console.log('[searchService] Venue sample:', JSON.stringify(data[0], null, 2));
          }
          return data || [];
        });

      promises.push(
        venuePromise.then(data => {
          results.venues = data;
        })
      );
    }

    // Search festivals if requested
    if (searchTypes.includes('festivals')) {
      console.log('[searchService] Searching festivals');
      const festivalPromise = supabase
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
        .ilike('name', `%${trimmedQuery}%`)
        .order('start_date')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('[searchService] Error searching festivals:', error);
            return [];
          }
          console.log('[searchService] Found festivals:', data?.length || 0);
          if (data?.length > 0) {
            console.log('[searchService] Festival sample:', JSON.stringify(data[0], null, 2));
          }
          return data || [];
        });

      promises.push(
        festivalPromise.then(data => {
          results.festivals = data;
        })
      );
    }

    // Search parks if requested
    if (searchTypes.includes('parks')) {
      console.log('[searchService] Searching parks');
      const parkPromise = supabase
        .from('parks')
        .select(
          `
          id,
          name
        `
        )
        .ilike('name', `%${trimmedQuery}%`)
        .order('name')
        .limit(limit)
        .then(({ data, error }) => {
          if (error) {
            console.error('[searchService] Error searching parks:', error);
            return [];
          }
          console.log('[searchService] Found parks:', data?.length || 0);
          return data || [];
        });

      promises.push(
        parkPromise.then(data => {
          results.parks = data;
        })
      );
    }

    // Wait for all search queries to complete
    try {
      await Promise.all(promises);
      console.log('[searchService] All search promises completed');
      console.log(
        '[searchService] Final result counts:',
        Object.keys(results)
          .map(key => `${key}: ${results[key]?.length || 0}`)
          .join(', ')
      );
      return results;
    } catch (error) {
      console.error('[searchService] Error during global search:', error);
      // Return whatever results we have so far rather than nothing
      return results;
    }
  },

  /**
   * Search concerts with full text search
   * @param {string} query - Search term
   * @param {Object} options - Search options
   * @param {number} options.limit - Number of results to return
   * @returns {Promise<Array>} - Concerts matching search
   */
  async searchConcerts(query, { limit = 20 } = {}) {
    console.log('[searchService] searchConcerts called with query:', query);

    if (!query || query.trim() === '') {
      console.log('[searchService] Empty query, returning empty results');
      return [];
    }

    const trimmedQuery = query.trim();
    console.log('[searchService] Trimmed query:', trimmedQuery);

    try {
      // First, find any artists that match the search term
      const { data: matchingArtists } = await supabase
        .from('artists')
        .select('id')
        .ilike('name', `%${trimmedQuery}%`);

      const matchingArtistIds = matchingArtists?.map(artist => artist.id) || [];
      console.log('[searchService] Found matching artist IDs:', matchingArtistIds);

      // Use multiple separate queries
      const concertPromises = [];

      // If we found matching artists, search by artist_id
      if (matchingArtistIds.length > 0) {
        concertPromises.push(
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
            .in('artist_id', matchingArtistIds)
            .order('start_time')
            .limit(limit)
        );
      }

      // Also search by venue and festival names
      concertPromises.push(
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
          .ilike('venues.name', `%${trimmedQuery}%`)
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
          .ilike('festivals.name', `%${trimmedQuery}%`)
          .order('start_time')
          .limit(limit)
      );

      // Execute all search promises
      const searchResults = await Promise.all(concertPromises);

      // Process all results
      const allConcerts = [];

      // Handle results from each search method
      searchResults.flat().forEach(result => {
        if (result.error) {
          console.error('[searchService] Error in concert search:', result.error);
          return;
        }

        const data = result.data || [];

        // Add results without duplicates
        data.forEach(concert => {
          if (!allConcerts.some(existing => existing.id === concert.id)) {
            allConcerts.push(concert);
          }
        });
      });

      console.log('[searchService] Concert search found total results:', allConcerts.length);

      // Sort by start_time and limit to requested amount
      const result = allConcerts
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, limit);

      console.log('[searchService] Final concert search results:', result.length);

      // Log a sample if available
      if (result.length > 0) {
        console.log('[searchService] Sample concert result:', JSON.stringify(result[0], null, 2));
      }

      return result;
    } catch (error) {
      console.error(
        `[searchService] Error searching concerts with query "${trimmedQuery}":`,
        error
      );
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
    console.log('[searchService] searchByDateAndTerm called with date:', date, 'query:', query);

    // Create start and end of day timestamps
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(
      '[searchService] Date range:',
      startOfDay.toISOString(),
      'to',
      endOfDay.toISOString()
    );

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
      console.log('[searchService] Date-only search (no text query)');
      const { data, error } = await dbQuery;

      if (error) {
        console.error(`[searchService] Error searching events for date ${date}:`, error);
        throw error;
      }

      console.log('[searchService] Date-only search results:', data?.length || 0);
      return data || [];
    }

    const trimmedQuery = query.trim();
    console.log('[searchService] Date + text search for:', trimmedQuery);

    try {
      // First, find any artists that match the search term
      const { data: matchingArtists } = await supabase
        .from('artists')
        .select('id')
        .ilike('name', `%${trimmedQuery}%`);

      const matchingArtistIds = matchingArtists?.map(artist => artist.id) || [];
      console.log('[searchService] Found matching artist IDs:', matchingArtistIds);

      const datePromises = [];

      // Start with date-only query
      datePromises.push(dbQuery);

      // If we found matching artists, add artist ID search
      if (matchingArtistIds.length > 0) {
        datePromises.push(
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
            .in('artist_id', matchingArtistIds)
            .gte('start_time', startOfDay.toISOString())
            .lte('start_time', endOfDay.toISOString())
            .order('start_time')
            .limit(limit)
        );
      }

      // Add queries for venue and festival names
      datePromises.push(
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
          .ilike('venues.name', `%${trimmedQuery}%`)
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
          .ilike('festivals.name', `%${trimmedQuery}%`)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
          .order('start_time')
          .limit(limit)
      );

      // Execute all search promises
      const searchResults = await Promise.all(datePromises);

      // Extract data and process results
      const combinedResults = [];

      // Add date-only results that match the text search
      const dateOnlyResult = searchResults[0];
      const dateData = dateOnlyResult.error ? [] : dateOnlyResult.data || [];
      const filteredDateData = dateData.filter(concert => {
        const artistName = concert.artists?.name || '';
        const venueName = concert.venues?.name || '';
        const festivalName = concert.festivals?.name || '';

        return (
          artistName.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
          venueName.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
          festivalName.toLowerCase().includes(trimmedQuery.toLowerCase())
        );
      });

      console.log('[searchService] Filtered date-only results:', filteredDateData.length);

      // Add filtered date results to combined results
      filteredDateData.forEach(concert => {
        combinedResults.push(concert);
      });

      // Process remaining results (artist ID, venue, festival)
      for (let i = 1; i < searchResults.length; i++) {
        const result = searchResults[i];
        const data = result.error ? [] : result.data || [];

        data.forEach(concert => {
          if (!combinedResults.some(existing => existing.id === concert.id)) {
            combinedResults.push(concert);
          }
        });
      }

      // Sort by start_time and limit to requested amount
      const result = combinedResults
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, limit);

      console.log('[searchService] Final date + text search results:', result.length);

      // Log a sample if available
      if (result.length > 0) {
        console.log(
          '[searchService] Sample date search result:',
          JSON.stringify(result[0], null, 2)
        );
      }

      return result;
    } catch (error) {
      console.error(`[searchService] Error searching events for date ${date}:`, error);
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
    console.log(
      '[searchService] searchWithFilters called with filters:',
      JSON.stringify(filters, null, 2)
    );

    const { query, parkId, artistId, venueId, festivalId, startDate, endDate } = filters;

    let dbQuery = supabase
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

    // We'll handle text search separately if provided
    const hasTextQuery = query && query.trim() !== '';
    const trimmedQuery = hasTextQuery ? query.trim() : '';
    console.log('[searchService] Has text query:', hasTextQuery, trimmedQuery);

    // Apply date filters
    if (startDate) {
      console.log('[searchService] Applying start date filter:', startDate.toISOString());
      dbQuery = dbQuery.gte('start_time', startDate.toISOString());
    } else {
      // Default to upcoming only if no start date specified
      console.log(
        '[searchService] No start date specified, defaulting to now:',
        new Date().toISOString()
      );
      dbQuery = dbQuery.gte('start_time', new Date().toISOString());
    }

    if (endDate) {
      console.log('[searchService] Applying end date filter:', endDate.toISOString());
      dbQuery = dbQuery.lte('start_time', endDate.toISOString());
    }

    // Apply entity filters
    if (artistId) {
      console.log('[searchService] Filtering by artist ID:', artistId);
      dbQuery = dbQuery.eq('artist_id', artistId);
    }

    if (venueId) {
      console.log('[searchService] Filtering by venue ID:', venueId);
      dbQuery = dbQuery.eq('venue_id', venueId);
    }

    if (festivalId) {
      console.log('[searchService] Filtering by festival ID:', festivalId);
      dbQuery = dbQuery.eq('festival_id', festivalId);
    }

    if (parkId) {
      console.log('[searchService] Filtering by park ID:', parkId);
      dbQuery = dbQuery.eq('venues.park_id', parkId);
    }

    try {
      // If no text search is needed, just use the filters we've built
      if (!hasTextQuery) {
        console.log('[searchService] Executing filter-only query');
        const { data, error } = await dbQuery;

        if (error) {
          console.error('[searchService] Error searching with filters:', error);
          throw error;
        }

        console.log('[searchService] Filter-only search returned:', data?.length || 0, 'results');
        if (data?.length > 0) {
          console.log('[searchService] Filter search sample:', JSON.stringify(data[0], null, 2));
        }

        return data || [];
      }

      // If we have a text query, find matching artist IDs first
      let matchingArtistIds = [];
      if (hasTextQuery) {
        const { data: matchingArtists } = await supabase
          .from('artists')
          .select('id')
          .ilike('name', `%${trimmedQuery}%`);

        matchingArtistIds = matchingArtists?.map(artist => artist.id) || [];
        console.log('[searchService] Found matching artist IDs:', matchingArtistIds);
      }

      // Perform multiple searches with the text query
      const filterPromises = [];

      // If we found matching artists, search by artist ID
      if (matchingArtistIds.length > 0) {
        // Create a copy of the base filter query
        let artistQuery = supabase
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

        // Apply the same filters as the base query
        if (startDate) {
          artistQuery = artistQuery.gte('start_time', startDate.toISOString());
        } else {
          artistQuery = artistQuery.gte('start_time', new Date().toISOString());
        }

        if (endDate) {
          artistQuery = artistQuery.lte('start_time', endDate.toISOString());
        }

        if (venueId) {
          artistQuery = artistQuery.eq('venue_id', venueId);
        }

        if (festivalId) {
          artistQuery = artistQuery.eq('festival_id', festivalId);
        }

        if (parkId) {
          artistQuery = artistQuery.eq('venues.park_id', parkId);
        }

        // Add the artist filter
        filterPromises.push(artistQuery.in('artist_id', matchingArtistIds));
      }

      // Create a more efficient version of the query builder function
      const createFilteredQuery = filterType => {
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

        // Apply all the common filters
        if (startDate) {
          query = query.gte('start_time', startDate.toISOString());
        } else {
          query = query.gte('start_time', new Date().toISOString());
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
          query = query.eq('venues.park_id', parkId);
        }

        // Apply the specific text filter
        if (filterType === 'venue') {
          query = query.ilike('venues.name', `%${trimmedQuery}%`);
        } else if (filterType === 'festival') {
          query = query.ilike('festivals.name', `%${trimmedQuery}%`);
        }

        return query;
      };

      // Add other text search queries
      filterPromises.push(
        // Filter by venue name
        createFilteredQuery('venue'),

        // Filter by festival name
        createFilteredQuery('festival')
      );

      console.log('[searchService] Executing filter + text search queries');

      // Execute all search promises
      const searchResults = await Promise.all(filterPromises);

      // Process all results
      const allConcerts = [];

      // Handle results from each search method
      searchResults.forEach((result, index) => {
        if (result.error) {
          console.error('[searchService] Error in filtered search:', result.error);
          return;
        }

        const data = result.data || [];
        const searchType =
          index === 0 && matchingArtistIds.length > 0
            ? 'By artist ID'
            : index === (matchingArtistIds.length > 0 ? 1 : 0)
            ? 'By venue name'
            : 'By festival name';

        console.log(`[searchService] Filter search results ${searchType}:`, data.length);

        // Add results without duplicates
        data.forEach(concert => {
          if (!allConcerts.some(existing => existing.id === concert.id)) {
            allConcerts.push(concert);
          }
        });
      });

      // Sort by start_time and limit to requested amount
      const result = allConcerts
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, limit);

      console.log('[searchService] Final filter + text search results:', result.length);

      // Log a sample if available
      if (result.length > 0) {
        console.log(
          '[searchService] Sample filter + text search result:',
          JSON.stringify(result[0], null, 2)
        );
      }

      return result;
    } catch (error) {
      console.error('[searchService] Error searching with filters:', error);
      throw error;
    }
  },
};

export default searchService;
