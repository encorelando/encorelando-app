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
    parks: []
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
    if (!query || query.trim() === '') {
      setResults({
        artists: [],
        concerts: [],
        venues: [],
        festivals: [],
        parks: []
      });
      setSearchTerm('');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSearchTerm(query);
    
    try {
      const data = await searchService.globalSearch(query, options);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to perform search');
      console.error('Error in useSearch hook:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Search concerts with text search
   * @param {string} query - Search term
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Concert results
   */
  const searchConcerts = useCallback(async (query, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchService.searchConcerts(query, options);
      return data;
    } catch (err) {
      setError(err.message || `Failed to search concerts with query "${query}"`);
      console.error(`Error searching concerts with query "${query}":`, err);
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
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchService.searchByDateAndTerm(date, query, options);
      return data;
    } catch (err) {
      setError(err.message || `Failed to search events for date ${date}`);
      console.error(`Error searching events for date ${date}:`, err);
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
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchService.searchWithFilters(filters, options);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to search with filters');
      console.error('Error searching with filters:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Reset search results
   */
  const clearSearch = useCallback(() => {
    setResults({
      artists: [],
      concerts: [],
      venues: [],
      festivals: [],
      parks: []
    });
    setSearchTerm('');
    setError(null);
  }, []);
  
  /**
   * Check if there are any results across all entity types
   */
  const hasResults = useCallback(() => {
    return Object.values(results).some(entityResults => 
      entityResults && entityResults.length > 0
    );
  }, [results]);
  
  /**
   * Get total number of results across all entity types
   */
  const getTotalResultsCount = useCallback(() => {
    return Object.values(results).reduce(
      (total, entityResults) => total + (entityResults ? entityResults.length : 0), 
      0
    );
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
    getTotalResultsCount
  };
};

export default useSearch;