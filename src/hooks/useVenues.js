import { useState, useEffect, useCallback } from 'react';
import venueService from '../services/venueService';

/**
 * Custom hook for accessing venue data with mobile-optimized patterns
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Venue data and utility functions
 */
const useVenues = (initialFilters = {}) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0
  });
  const [filters, setFilters] = useState(initialFilters);
  
  /**
   * Fetch venues with current filters
   */
  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, pagination: paginationData } = await venueService.getVenues({
        ...filters,
        limit: pagination.limit,
        offset: pagination.offset
      });
      
      setVenues(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err.message || 'Failed to fetch venues');
      console.error('Error in useVenues hook:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.offset]);
  
  // Fetch venues on mount and when filters change
  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);
  
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
    if (loading || venues.length >= pagination.total) return;
    
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  }, [loading, venues.length, pagination.total, pagination.limit]);
  
  /**
   * Refresh venue data
   */
  const refresh = useCallback(() => {
    fetchVenues();
  }, [fetchVenues]);
  
  /**
   * Get a single venue by ID
   * @param {string} id - Venue UUID
   * @returns {Promise<Object>} - Venue data
   */
  const getVenueById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await venueService.getVenueById(id);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch venue ${id}`);
      console.error(`Error fetching venue ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get venues by park
   * @param {string} parkId - Park UUID
   * @returns {Promise<Array>} - Venue data
   */
  const getVenuesByPark = useCallback(async (parkId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await venueService.getVenuesByPark(parkId);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch venues for park ${parkId}`);
      console.error(`Error fetching venues for park ${parkId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get venues with upcoming concerts
   * @param {Object} options - Options
   * @returns {Promise<Array>} - Venue data
   */
  const getVenuesWithUpcomingConcerts = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await venueService.getVenuesWithUpcomingConcerts(options);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch venues with upcoming concerts');
      console.error('Error fetching venues with upcoming concerts:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Search venues by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} - Venue data
   */
  const searchVenues = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await venueService.searchVenues(query);
      return data;
    } catch (err) {
      setError(err.message || `Failed to search venues with query "${query}"`);
      console.error(`Error searching venues with query "${query}":`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    venues,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refresh,
    getVenueById,
    getVenuesByPark,
    getVenuesWithUpcomingConcerts,
    searchVenues
  };
};

export default useVenues;