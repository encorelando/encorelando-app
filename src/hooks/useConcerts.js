import { useState, useEffect, useCallback } from 'react';
import concertService from '../services/concertService';

/**
 * Custom hook for accessing concert data with mobile-optimized patterns
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Concert data and utility functions
 */
const useConcerts = (initialFilters = {}) => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
  });
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Fetch concerts with current filters
   */
  const fetchConcerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, pagination: paginationData } = await concertService.getConcerts({
        ...filters,
        limit: pagination.limit,
        offset: pagination.offset,
      });

      setConcerts(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err.message || 'Failed to fetch concerts');
      console.error('Error in useConcerts hook:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.offset]);

  // Fetch concerts on mount and when filters change
  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  /**
   * Update filters and reset pagination
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback(newFilters => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));

    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      offset: 0,
    }));
  }, []);

  /**
   * Load next page of results
   */
  const loadMore = useCallback(() => {
    if (loading || concerts.length >= pagination.total) return;

    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  }, [loading, concerts.length, pagination.total]);

  /**
   * Refresh concert data
   */
  const refresh = useCallback(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  /**
   * Get a single concert by ID
   * @param {string} id - Concert UUID
   * @returns {Promise<Object>} - Concert data
   */
  const getConcertById = useCallback(async id => {
    setLoading(true);
    setError(null);

    try {
      const data = await concertService.getConcertById(id);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch concert ${id}`);
      console.error(`Error fetching concert ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get upcoming concerts
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Concert data
   */
  const getUpcomingConcerts = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await concertService.getUpcomingConcerts(options);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch upcoming concerts');
      console.error('Error fetching upcoming concerts:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get concerts for a specific date
   * @param {string} date - ISO8601 date (YYYY-MM-DD)
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Concert data
   */
  const getConcertsByDate = useCallback(async (date, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await concertService.getConcertsByDate(date, options);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch concerts for date ${date}`);
      console.error(`Error fetching concerts for date ${date}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get concerts for a specific venue
   * @param {string} venueId - Venue UUID
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Concert data
   */
  const getConcertsByVenue = useCallback(async (venueId, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await concertService.getConcertsByVenue(venueId, options);
      setConcerts(data); // Update the concerts state
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch concerts for venue ${venueId}`);
      console.error(`Error fetching concerts for venue ${venueId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get concerts for a specific artist
   * @param {string} artistId - Artist UUID
   * @param {boolean} includePast - Include past concerts (default: false)
   * @returns {Promise<Array>} - Concert data
   */
  const getConcertsByArtist = useCallback(async (artistId, includePast = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await concertService.getConcertsByArtist(artistId, includePast);
      setConcerts(data); // Update the concerts state
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch concerts for artist ${artistId}`);
      console.error(`Error fetching concerts for artist ${artistId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get concerts for a specific festival
   * @param {string} festivalId - Festival UUID
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Concert data
   */
  const getConcertsByFestival = useCallback(async (festivalId, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await concertService.getConcertsByFestival(festivalId, options);
      setConcerts(data); // Update the concerts state
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch concerts for festival ${festivalId}`);
      console.error(`Error fetching concerts for festival ${festivalId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    concerts,
    setConcerts,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refresh,
    getConcertById,
    getUpcomingConcerts,
    getConcertsByDate,
    getConcertsByVenue,
    getConcertsByArtist,
    getConcertsByFestival,
  };
};

export default useConcerts;
