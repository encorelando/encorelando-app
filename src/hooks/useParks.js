import { useState, useEffect, useCallback } from 'react';
import parkService from '../services/parkService';

/**
 * Custom hook for accessing park data with mobile-optimized patterns
 * @returns {Object} - Park data and utility functions
 */
const useParks = () => {
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all parks
   */
  const fetchParks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await parkService.getParks();
      setParks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch parks');
      console.error('Error in useParks hook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch parks on mount
  useEffect(() => {
    fetchParks();
  }, [fetchParks]);

  /**
   * Refresh park data
   */
  const refresh = useCallback(() => {
    fetchParks();
  }, [fetchParks]);

  /**
   * Get a single park by ID with venues and festivals
   * @param {string} id - Park UUID
   * @returns {Promise<Object>} - Park data
   */
  const getParkById = useCallback(async id => {
    setLoading(true);
    setError(null);

    try {
      const data = await parkService.getParkById(id);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch park ${id}`);
      console.error(`Error fetching park ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get parks with upcoming concerts
   * @returns {Promise<Array>} - Park data
   */
  const getParksWithUpcomingConcerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await parkService.getParksWithUpcomingConcerts();
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch parks with upcoming concerts');
      console.error('Error fetching parks with upcoming concerts:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search parks by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} - Park data
   */
  const searchParks = useCallback(async query => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await parkService.searchParks(query);
      return data;
    } catch (err) {
      setError(err.message || `Failed to search parks with query "${query}"`);
      console.error(`Error searching parks with query "${query}":`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get upcoming concerts by park
   * @param {string} parkId - Park UUID
   * @param {Object} options - Options
   * @returns {Promise<Array>} - Concert data
   */
  const getUpcomingConcertsByPark = useCallback(async (parkId, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await parkService.getUpcomingConcertsByPark(parkId, options);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch upcoming concerts for park ${parkId}`);
      console.error(`Error fetching upcoming concerts for park ${parkId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    parks,
    loading,
    error,
    refresh,
    getParkById,
    getParksWithUpcomingConcerts,
    searchParks,
    getUpcomingConcertsByPark,
  };
};

export default useParks;
