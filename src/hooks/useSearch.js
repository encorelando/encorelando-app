import { useState, useCallback } from 'react';
import searchService from '../services/searchService';

/**
 * Custom hook for cross-entity search functionality with mobile-optimized patterns
 * @returns {Object} - Search methods and state
 */
const useSearch = () => {
  const [results, setResults] = useState({
    artists: [],
    concerts: [],
    venues: [],
    festivals: [],
    parks: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Perform a global search across all entities
   * @param {string} query - Search term
   * @param {Object} options - Search options
   */
  const globalSearch = useCallback(async (query, options = {}) => {
    console.log('[useSearch] globalSearch called with query:', query);
    console.log('[useSearch] options received:', JSON.stringify(options, null, 2));

    if (!query || query.trim() === '') {
      console.log('[useSearch] Empty query, clearing results');
      setResults({
        artists: [],
        concerts: [],
        venues: [],
        festivals: [],
        parks: [],
      });
      setSearchTerm('');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchTerm(query);

    try {
      // Normalize the options to match the API contract
      const normalizedOptions = {
        types: options.types ||
          options.entityTypes || ['concerts', 'artists', 'festivals', 'venues', 'parks'],
        limit: options.limit || 5,
      };

      console.log('[useSearch] Normalized options:', JSON.stringify(normalizedOptions, null, 2));

      // If we have park or date filters, apply them for concert searches
      if (options.parkIds?.length > 0 || options.dates?.length > 0) {
        console.log('[useSearch] Special filtering needed for parkIds or dates');

        // First get the basic search results
        console.log('[useSearch] Calling basic globalSearch');
        const data = await searchService.globalSearch(query, normalizedOptions);
        console.log(
          '[useSearch] Basic search returned data types:',
          Object.keys(data).map(key => `${key}: ${data[key]?.length || 0}`)
        );

        // If we need to filter concerts further
        if (
          normalizedOptions.types.includes('concerts') &&
          (options.parkIds?.length > 0 || options.dates?.length > 0)
        ) {
          console.log('[useSearch] Additional concert filtering needed');

          // Apply concert-specific filters
          const filterParams = {
            query: query,
            parkId: options.parkIds?.length > 0 ? options.parkIds[0] : undefined,
            startDate: options.dates?.includes('today')
              ? new Date()
              : options.dates?.includes('this-week')
              ? (() => {
                  const date = new Date();
                  date.setDate(date.getDate() - date.getDay());
                  return date;
                })()
              : undefined,
            endDate: options.dates?.includes('today')
              ? (() => {
                  const date = new Date();
                  date.setHours(23, 59, 59, 999);
                  return date;
                })()
              : options.dates?.includes('this-week')
              ? (() => {
                  const date = new Date();
                  date.setDate(date.getDate() + (6 - date.getDay()));
                  date.setHours(23, 59, 59, 999);
                  return date;
                })()
              : undefined,
          };

          console.log(
            '[useSearch] Filtering concerts with params:',
            JSON.stringify(filterParams, null, 2)
          );
          const filteredConcerts = await searchService.searchWithFilters(filterParams);
          console.log('[useSearch] Filtered concerts count:', filteredConcerts?.length || 0);

          // Replace the concerts with filtered results
          data.concerts = filteredConcerts;
          console.log('[useSearch] Updated concerts count in data:', data.concerts?.length || 0);
        }

        setResults(data);
        console.log(
          '[useSearch] Final results after filtering - counts by type:',
          Object.keys(data).map(key => `${key}: ${data[key]?.length || 0}`)
        );
      } else {
        // No special filtering needed, just use regular search
        console.log('[useSearch] No special filtering needed, using regular search');
        const data = await searchService.globalSearch(query, normalizedOptions);
        console.log(
          '[useSearch] Regular search returned data counts:',
          Object.keys(data).map(key => `${key}: ${data[key]?.length || 0}`)
        );
        setResults(data);
      }
    } catch (err) {
      console.error('[useSearch] Error in globalSearch:', err);
      setError(err.message || 'Failed to perform search');
    } finally {
      setLoading(false);
      console.log('[useSearch] Search completed, loading set to false');
    }
  }, []);

  /**
   * Search concerts with text search
   * @param {string} query - Search term
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Concert results
   */
  const searchConcerts = useCallback(async (query, options = {}) => {
    console.log('[useSearch] searchConcerts called with query:', query);
    console.log('[useSearch] options:', JSON.stringify(options, null, 2));

    setLoading(true);
    setError(null);

    try {
      const data = await searchService.searchConcerts(query, options);
      console.log('[useSearch] searchConcerts result count:', data?.length || 0);
      return data;
    } catch (err) {
      console.error(`[useSearch] Error searching concerts with query "${query}":`, err);
      setError(err.message || `Failed to search concerts with query "${query}"`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search for events on a specific date with optional text query
   * @param {string} date - ISO8601 date (YYYY-MM-DD)
   * @param {string} query - Optional search term
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Concert results
   */
  const searchByDateAndTerm = useCallback(async (date, query = '', options = {}) => {
    console.log('[useSearch] searchByDateAndTerm called with date:', date, 'query:', query);

    setLoading(true);
    setError(null);

    try {
      const data = await searchService.searchByDateAndTerm(date, query, options);
      console.log('[useSearch] searchByDateAndTerm result count:', data?.length || 0);
      return data;
    } catch (err) {
      console.error(`[useSearch] Error searching events for date ${date}:`, err);
      setError(err.message || `Failed to search events for date ${date}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search for upcoming events with filters
   * @param {Object} filters - Filter parameters
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Concert results
   */
  const searchWithFilters = useCallback(async (filters = {}, options = {}) => {
    console.log(
      '[useSearch] searchWithFilters called with filters:',
      JSON.stringify(filters, null, 2)
    );

    setLoading(true);
    setError(null);

    try {
      const data = await searchService.searchWithFilters(filters, options);
      console.log('[useSearch] searchWithFilters result count:', data?.length || 0);
      return data;
    } catch (err) {
      console.error('[useSearch] Error searching with filters:', err);
      setError(err.message || 'Failed to search with filters');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset search results
   */
  const clearSearch = useCallback(() => {
    console.log('[useSearch] clearSearch called');

    setResults({
      artists: [],
      concerts: [],
      venues: [],
      festivals: [],
      parks: [],
    });
    setSearchTerm('');
    setError(null);
  }, []);

  /**
   * Check if there are any results across all entity types
   */
  const hasResults = useCallback(() => {
    const hasAny = Object.values(results).some(
      entityResults => entityResults && entityResults.length > 0
    );
    console.log('[useSearch] hasResults:', hasAny);
    return hasAny;
  }, [results]);

  /**
   * Get total number of results across all entity types
   */
  const getTotalResultsCount = useCallback(() => {
    const total = Object.values(results).reduce(
      (total, entityResults) => total + (entityResults ? entityResults.length : 0),
      0
    );
    console.log('[useSearch] getTotalResultsCount:', total);
    return total;
  }, [results]);

  return {
    // State
    results,
    loading,
    error,
    searchTerm,

    // Action methods
    globalSearch,
    searchConcerts,
    searchByDateAndTerm,
    searchWithFilters,
    clearSearch,

    // Helper methods
    hasResults,
    getTotalResultsCount,
  };
};

export default useSearch;
