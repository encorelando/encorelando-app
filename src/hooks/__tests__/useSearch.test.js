import { renderHook, act } from '@testing-library/react';
import useSearch from '../useSearch';
import searchService from '../../services/searchService';

// Mock the search service
jest.mock('../../services/searchService');

describe('useSearch', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Initial state should have empty results, no query, and loading=false
    expect(result.current.results).toEqual({
      concerts: [],
      artists: [],
      venues: [],
      parks: [],
      festivals: []
    });
    expect(result.current.query).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should perform global search', async () => {
    // Mock the search response
    const mockResults = {
      concerts: [{ id: 'c1', name: 'Test Concert' }],
      artists: [{ id: 'a1', name: 'Test Artist' }],
      venues: [{ id: 'v1', name: 'Test Venue' }],
      parks: [{ id: 'p1', name: 'Test Park' }],
      festivals: [{ id: 'f1', name: 'Test Festival' }]
    };
    
    searchService.globalSearch.mockResolvedValue(mockResults);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform global search
    await act(async () => {
      await result.current.globalSearch('test');
    });
    
    // Results should be updated
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.query).toBe('test');
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly
    expect(searchService.globalSearch).toHaveBeenCalledWith('test', 20);
  });

  it('should handle loading state during search', async () => {
    // Mock a delayed response
    searchService.globalSearch.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({
          concerts: [],
          artists: [],
          venues: [],
          parks: [],
          festivals: []
        }), 100);
      });
    });

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Start the search
    let promise;
    act(() => {
      promise = result.current.globalSearch('test');
    });
    
    // Loading state should be true immediately after starting search
    expect(result.current.loading).toBe(true);
    
    // Wait for search to complete
    await act(async () => {
      await promise;
    });
    
    // Loading state should be false after search completes
    expect(result.current.loading).toBe(false);
  });

  it('should handle errors during global search', async () => {
    // Mock an error response
    const errorMessage = 'Search failed';
    searchService.globalSearch.mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform search that will fail
    await act(async () => {
      await result.current.globalSearch('test').catch(() => {});
    });
    
    // Error should be captured in state
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it('should search concerts', async () => {
    // Mock the search response
    const mockConcerts = [
      { id: 'c1', name: 'Test Concert' },
      { id: 'c2', name: 'Another Concert' }
    ];
    
    searchService.searchConcerts.mockResolvedValue(mockConcerts);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform concert search
    await act(async () => {
      await result.current.searchConcerts('test');
    });
    
    // Results should be updated
    expect(result.current.results.concerts).toEqual(mockConcerts);
    expect(result.current.query).toBe('test');
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly
    expect(searchService.searchConcerts).toHaveBeenCalledWith('test', 20);
  });

  it('should search artists', async () => {
    // Mock the search response
    const mockArtists = [
      { id: 'a1', name: 'Test Artist' },
      { id: 'a2', name: 'Another Artist' }
    ];
    
    searchService.searchArtists.mockResolvedValue(mockArtists);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform artist search
    await act(async () => {
      await result.current.searchArtists('test');
    });
    
    // Results should be updated
    expect(result.current.results.artists).toEqual(mockArtists);
    expect(result.current.query).toBe('test');
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly
    expect(searchService.searchArtists).toHaveBeenCalledWith('test', 20);
  });

  it('should search venues', async () => {
    // Mock the search response
    const mockVenues = [
      { id: 'v1', name: 'Test Venue' },
      { id: 'v2', name: 'Another Venue' }
    ];
    
    searchService.searchVenues.mockResolvedValue(mockVenues);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform venue search
    await act(async () => {
      await result.current.searchVenues('test');
    });
    
    // Results should be updated
    expect(result.current.results.venues).toEqual(mockVenues);
    expect(result.current.query).toBe('test');
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly
    expect(searchService.searchVenues).toHaveBeenCalledWith('test', 20);
  });

  it('should search parks', async () => {
    // Mock the search response
    const mockParks = [
      { id: 'p1', name: 'Test Park' },
      { id: 'p2', name: 'Another Park' }
    ];
    
    searchService.searchParks.mockResolvedValue(mockParks);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform park search
    await act(async () => {
      await result.current.searchParks('test');
    });
    
    // Results should be updated
    expect(result.current.results.parks).toEqual(mockParks);
    expect(result.current.query).toBe('test');
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly
    expect(searchService.searchParks).toHaveBeenCalledWith('test', 20);
  });

  it('should search festivals', async () => {
    // Mock the search response
    const mockFestivals = [
      { id: 'f1', name: 'Test Festival' },
      { id: 'f2', name: 'Another Festival' }
    ];
    
    searchService.searchFestivals.mockResolvedValue(mockFestivals);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform festival search
    await act(async () => {
      await result.current.searchFestivals('test');
    });
    
    // Results should be updated
    expect(result.current.results.festivals).toEqual(mockFestivals);
    expect(result.current.query).toBe('test');
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly
    expect(searchService.searchFestivals).toHaveBeenCalledWith('test', 20);
  });

  it('should search by date', async () => {
    // Mock the search response
    const mockConcerts = [
      { id: 'c1', start_time: '2025-05-01T15:00:00Z' },
      { id: 'c2', start_time: '2025-05-01T20:00:00Z' }
    ];
    
    searchService.searchByDate.mockResolvedValue(mockConcerts);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform date search
    const date = '2025-05-01';
    await act(async () => {
      await result.current.searchByDate(date);
    });
    
    // Results should be updated
    expect(result.current.results.concerts).toEqual(mockConcerts);
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly
    expect(searchService.searchByDate).toHaveBeenCalledWith(date, {});
  });

  it('should apply filters when searching by date', async () => {
    // Mock the search response
    const mockConcerts = [{ id: 'c1', start_time: '2025-05-01T15:00:00Z' }];
    
    searchService.searchByDate.mockResolvedValue(mockConcerts);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform date search with filters
    const date = '2025-05-01';
    const filters = { parkId: 'p1', festivalId: 'f1' };
    await act(async () => {
      await result.current.searchByDate(date, filters);
    });
    
    // Verify service was called with filters
    expect(searchService.searchByDate).toHaveBeenCalledWith(date, filters);
  });

  it('should search upcoming concerts', async () => {
    // Mock the search response
    const mockConcerts = [
      { id: 'c1', start_time: '2025-05-01T20:00:00Z' },
      { id: 'c2', start_time: '2025-05-02T19:00:00Z' }
    ];
    
    searchService.searchUpcoming.mockResolvedValue(mockConcerts);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform upcoming search
    await act(async () => {
      await result.current.searchUpcoming();
    });
    
    // Results should be updated
    expect(result.current.results.concerts).toEqual(mockConcerts);
    expect(result.current.loading).toBe(false);
    
    // Verify service was called correctly with default limit
    expect(searchService.searchUpcoming).toHaveBeenCalledWith(20, {});
  });

  it('should customize limit for upcoming search', async () => {
    // Mock the search response
    searchService.searchUpcoming.mockResolvedValue([]);

    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Perform upcoming search with custom limit
    const limit = 5;
    await act(async () => {
      await result.current.searchUpcoming(limit);
    });
    
    // Verify service was called with custom limit
    expect(searchService.searchUpcoming).toHaveBeenCalledWith(limit, {});
  });

  it('should clear search results', () => {
    // Render the hook
    const { result } = renderHook(() => useSearch());

    // Set some initial state
    act(() => {
      result.current.setResults({
        concerts: [{ id: 'c1' }],
        artists: [{ id: 'a1' }],
        venues: [{ id: 'v1' }],
        parks: [{ id: 'p1' }],
        festivals: [{ id: 'f1' }]
      });
      result.current.setQuery('test');
    });

    // Clear results
    act(() => {
      result.current.clearResults();
    });
    
    // State should be reset
    expect(result.current.results).toEqual({
      concerts: [],
      artists: [],
      venues: [],
      parks: [],
      festivals: []
    });
    expect(result.current.query).toBe('');
  });
});
