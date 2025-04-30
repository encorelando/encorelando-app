import { useState, useEffect, useCallback } from 'react';
import artistService from '../services/artistService';

/**
 * Custom hook for accessing artist data with mobile-optimized patterns
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Artist data and utility functions
 */
const useArtists = (initialFilters = {}) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
  });
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Fetch artists with current filters
   */
  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, pagination: paginationData } = await artistService.getArtists({
        ...filters,
        limit: pagination.limit,
        offset: pagination.offset,
      });

      // If we're on the first page (offset = 0), replace all artists
      // Otherwise append to existing list for infinite scrolling
      if (pagination.offset === 0) {
        setArtists(data);
      } else {
        setArtists(prevArtists => [...prevArtists, ...data]);
      }

      setPagination(paginationData);
    } catch (err) {
      setError(err.message || 'Failed to fetch artists');
      console.error('Error in useArtists hook:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.offset]);

  // Fetch artists on mount and when filters change
  useEffect(() => {
    // Reset artists array when filter changes
    if (pagination.offset === 0) {
      setArtists([]);
    }
    fetchArtists();
  }, [fetchArtists, pagination.offset]);

  /**
   * Update filters and reset pagination
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback(newFilters => {
    // Log to help with debugging
    console.log('Filters being applied:', newFilters);

    // Update filters state
    setFilters(newFilters);

    // Reset to first page when filters change and clear artists array
    // to prevent showing old results briefly during loading
    setPagination(prev => ({
      ...prev,
      offset: 0,
    }));

    // Clear artists when filters change to prevent UI flicker
    setArtists([]);
  }, []);

  /**
   * Load next page of results
   */
  const loadMore = useCallback(async () => {
    if (loading || artists.length >= pagination.total) return;

    const newOffset = pagination.offset + pagination.limit;

    setPagination(prev => ({
      ...prev,
      offset: newOffset,
    }));

    setLoading(true);
    setError(null);

    try {
      const { data, pagination: paginationData } = await artistService.getArtists({
        ...filters,
        limit: pagination.limit,
        offset: newOffset,
      });

      // Append new results to existing ones
      setArtists(prevArtists => [...prevArtists, ...data]);
      // Update pagination data but keep our offset
      // eslint-disable-next-line no-unused-vars
      setPagination(prev => ({
        ...paginationData,
        offset: newOffset,
      }));
    } catch (err) {
      setError(err.message || 'Failed to load more artists');
      console.error('Error loading more artists:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, artists.length, pagination.total, pagination.limit, pagination.offset, filters]);

  /**
   * Refresh artist data
   */
  const refresh = useCallback(() => {
    fetchArtists();
  }, [fetchArtists]);

  /**
   * Get a single artist by ID
   * @param {string} id - Artist UUID
   * @returns {Promise<Object>} - Artist data
   */
  const getArtistById = useCallback(async id => {
    setLoading(true);
    setError(null);

    try {
      const data = await artistService.getArtistById(id);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch artist ${id}`);
      console.error(`Error fetching artist ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search artists by name
   * @param {string} query - Search term
   * @returns {Promise<Array>} - Artist data
   */
  const searchArtists = useCallback(async query => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await artistService.searchArtists(query);
      return data;
    } catch (err) {
      setError(err.message || `Failed to search artists with query "${query}"`);
      console.error(`Error searching artists with query "${query}":`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get artists by festival
   * @param {string} festivalId - Festival UUID
   * @returns {Promise<Array>} - Artist data
   */
  const getArtistsByFestival = useCallback(async festivalId => {
    setLoading(true);
    setError(null);

    try {
      const data = await artistService.getArtistsByFestival(festivalId);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch artists for festival ${festivalId}`);
      console.error(`Error fetching artists for festival ${festivalId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get artists with upcoming concerts
   * @param {Object} options - Options
   * @returns {Promise<Array>} - Artist data
   */
  const getArtistsWithUpcomingConcerts = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await artistService.getArtistsWithUpcomingConcerts(options);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch artists with upcoming concerts');
      console.error('Error fetching artists with upcoming concerts:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    artists,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refresh,
    getArtistById,
    searchArtists,
    getArtistsByFestival,
    getArtistsWithUpcomingConcerts,
  };
};

export default useArtists;
