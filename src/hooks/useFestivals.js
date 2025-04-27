import { useState, useEffect, useCallback } from 'react';
import festivalService from '../services/festivalService';

/**
 * Custom hook for accessing festival data with mobile-optimized patterns
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Festival data and utility functions
 */
const useFestivals = (initialFilters = {}) => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0
  });
  const [filters, setFilters] = useState(initialFilters);
  
  /**
   * Fetch festivals with current filters
   */
  const fetchFestivals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, pagination: paginationData } = await festivalService.getFestivals({
        ...filters,
        limit: pagination.limit,
        offset: pagination.offset
      });
      
      setFestivals(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err.message || 'Failed to fetch festivals');
      console.error('Error in useFestivals hook:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.offset]);
  
  // Fetch festivals on mount and when filters change
  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);
  
  /**
   * Update filters and reset pagination
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      offset: 0
    }));
  }, []);
  
  /**
   * Load next page of results
   */
  const loadMore = useCallback(() => {
    if (loading || festivals.length >= pagination.total) return;
    
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  }, [loading, festivals.length, pagination.total, pagination.limit]);
  
  /**
   * Refresh festival data
   */
  const refresh = useCallback(() => {
    fetchFestivals();
  }, [fetchFestivals]);
  
  /**
   * Get a single festival by ID
   * @param {string} id - Festival UUID
   * @param {Object} options - Options
   * @returns {Promise<Object>} - Festival data
   */
  const getFestivalById = useCallback(async (id, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await festivalService.getFestivalById(id, options);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch festival ${id}`);
      console.error(`Error fetching festival ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get currently running festivals
   * @param {Object} options - Options
   * @returns {Promise<Array>} - Festival data
   */
  const getCurrentFestivals = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await festivalService.getCurrentFestivals(options);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch current festivals');
      console.error('Error fetching current festivals:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get upcoming festivals
   * @param {Object} options - Options
   * @returns {Promise<Array>} - Festival data
   */
  const getUpcomingFestivals = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await festivalService.getUpcomingFestivals(options);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch upcoming festivals');
      console.error('Error fetching upcoming festivals:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Search festivals by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} - Festival data
   */
  const searchFestivals = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await festivalService.searchFestivals(query);
      return data;
    } catch (err) {
      setError(err.message || `Failed to search festivals with query "${query}"`);
      console.error(`Error searching festivals with query "${query}":`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    festivals,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refresh,
    getFestivalById,
    getCurrentFestivals,
    getUpcomingFestivals,
    searchFestivals
  };
};

export default useFestivals;