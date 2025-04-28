import { renderHook, act } from '@testing-library/react';
import useConcerts from '../useConcerts';
import concertService from '../../services/concertService';

// Mock the concert service
jest.mock('../../services/concertService');

describe('useConcerts', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', async () => {
    // Mock the service response
    const mockConcerts = [];
    const mockPagination = {
      total: 0,
      limit: 20,
      offset: 0
    };
    
    concertService.getConcerts.mockResolvedValue({
      data: mockConcerts,
      pagination: mockPagination
    });

    // Render the hook
    const { result } = renderHook(() => useConcerts());

    // Initial state should have empty concerts and loading=true
    expect(result.current.concerts).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    
    // Wait for the async function to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // After loading, concerts should still be empty (as per our mock)
    expect(result.current.concerts).toEqual([]);
    expect(result.current.loading).toBe(false);
    
    // Verify the service was called with default parameters
    expect(concertService.getConcerts).toHaveBeenCalledWith({
      limit: 20,
      offset: 0
    });
  });

  it('should load concerts with initial filters', async () => {
    // Mock the service response
    const mockConcerts = [
      { id: '1', start_time: '2025-05-01T20:00:00Z' },
      { id: '2', start_time: '2025-05-02T19:00:00Z' }
    ];
    const mockPagination = {
      total: 2,
      limit: 20,
      offset: 0
    };
    
    concertService.getConcerts.mockResolvedValue({
      data: mockConcerts,
      pagination: mockPagination
    });

    // Initial filters
    const initialFilters = {
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-31'),
      artistId: 'artist-123'
    };

    // Render the hook with initial filters
    const { result } = renderHook(() => useConcerts(initialFilters));

    // Wait for the async function to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Concerts should be loaded
    expect(result.current.concerts).toEqual(mockConcerts);
    expect(result.current.loading).toBe(false);
    expect(result.current.filters).toEqual(initialFilters);
    
    // Verify the service was called with the initial filters
    expect(concertService.getConcerts).toHaveBeenCalledWith({
      ...initialFilters,
      limit: 20,
      offset: 0
    });
  });

  it('should update filters and reload data', async () => {
    // First request mock
    const initialConcerts = [{ id: '1', start_time: '2025-05-01T20:00:00Z' }];
    const initialPagination = {
      total: 1,
      limit: 20,
      offset: 0
    };
    
    // Second request mock (after filter update)
    const filteredConcerts = [{ id: '2', start_time: '2025-05-15T20:00:00Z' }];
    const filteredPagination = {
      total: 1,
      limit: 20,
      offset: 0
    };
    
    // Set up the mock to return different values on successive calls
    concertService.getConcerts
      .mockResolvedValueOnce({
        data: initialConcerts,
        pagination: initialPagination
      })
      .mockResolvedValueOnce({
        data: filteredConcerts,
        pagination: filteredPagination
      });

    // Render the hook
    const { result } = renderHook(() => useConcerts());

    // Wait for the initial async function to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Initial concerts should be loaded
    expect(result.current.concerts).toEqual(initialConcerts);
    
    // Now update filters
    await act(async () => {
      result.current.updateFilters({ artistId: 'artist-456' });
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Concerts should be updated with new filter results
    expect(result.current.concerts).toEqual(filteredConcerts);
    expect(result.current.filters).toEqual({ artistId: 'artist-456' });
    
    // Verify service was called with updated filters and reset pagination
    expect(concertService.getConcerts).toHaveBeenCalledWith({
      artistId: 'artist-456',
      limit: 20,
      offset: 0 // Should reset to first page when filters change
    });
  });

  it('should load more concerts when loadMore is called', async () => {
    // First request mock (first page)
    const firstPageConcerts = [
      { id: '1', start_time: '2025-05-01T20:00:00Z' },
      { id: '2', start_time: '2025-05-02T19:00:00Z' }
    ];
    const firstPagePagination = {
      total: 4, // Total 4 concerts available
      limit: 2, // But we're only loading 2 at a time
      offset: 0
    };
    
    // Second request mock (second page)
    const secondPageConcerts = [
      { id: '3', start_time: '2025-05-03T20:00:00Z' },
      { id: '4', start_time: '2025-05-04T19:00:00Z' }
    ];
    const secondPagePagination = {
      total: 4,
      limit: 2,
      offset: 2 // Second page
    };
    
    // Set up the mock to return different values on successive calls
    concertService.getConcerts
      .mockResolvedValueOnce({
        data: firstPageConcerts,
        pagination: firstPagePagination
      })
      .mockResolvedValueOnce({
        data: secondPageConcerts,
        pagination: secondPagePagination
      });

    // Render the hook with a small page size
    const { result } = renderHook(() => useConcerts({ limit: 2 }));

    // Wait for the initial async function to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Initial concerts should be loaded (first page only)
    expect(result.current.concerts).toEqual(firstPageConcerts);
    expect(result.current.pagination.offset).toBe(0);
    expect(result.current.pagination.limit).toBe(2);
    expect(result.current.pagination.total).toBe(4);
    
    // Now load more (second page)
    await act(async () => {
      result.current.loadMore();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Concerts should include both pages (this might depend on the implementation)
    // If the implementation replaces the data, then it would be secondPageConcerts
    // If it appends, then it would be [...firstPageConcerts, ...secondPageConcerts]
    expect(result.current.concerts).toEqual([...firstPageConcerts, ...secondPageConcerts]);
    
    // Pagination should have advanced
    expect(result.current.pagination.offset).toBe(2);
    
    // Verify service was called with correct pagination
    expect(concertService.getConcerts).toHaveBeenLastCalledWith({
      limit: 2,
      offset: 2
    });
  });

  it('should handle errors during data fetching', async () => {
    // Mock an error response
    const errorMessage = 'Failed to fetch concerts';
    concertService.getConcerts.mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => useConcerts());

    // Wait for the async function to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Error should be captured in state
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
    expect(result.current.concerts).toEqual([]);
  });

  it('should refresh concert data', async () => {
    // Initial data
    const initialConcerts = [{ id: '1', start_time: '2025-05-01T20:00:00Z' }];
    
    // Refreshed data
    const refreshedConcerts = [
      { id: '1', start_time: '2025-05-01T20:00:00Z' },
      { id: '2', start_time: '2025-05-02T19:00:00Z' }
    ];
    
    // Set up the mock to return different values on successive calls
    concertService.getConcerts
      .mockResolvedValueOnce({
        data: initialConcerts,
        pagination: { total: 1, limit: 20, offset: 0 }
      })
      .mockResolvedValueOnce({
        data: refreshedConcerts,
        pagination: { total: 2, limit: 20, offset: 0 }
      });

    // Render the hook
    const { result } = renderHook(() => useConcerts());

    // Wait for the initial async function to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Initial concerts should be loaded
    expect(result.current.concerts).toEqual(initialConcerts);
    
    // Now refresh
    await act(async () => {
      result.current.refresh();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Concerts should be updated with refreshed data
    expect(result.current.concerts).toEqual(refreshedConcerts);
    
    // Service should have been called twice
    expect(concertService.getConcerts).toHaveBeenCalledTimes(2);
  });

  it('should get a concert by ID', async () => {
    // Mock the getConcertById response
    const mockConcert = { 
      id: '1', 
      start_time: '2025-05-01T20:00:00Z',
      artists: { id: 'a1', name: 'Test Artist' }
    };
    
    concertService.getConcertById.mockResolvedValue(mockConcert);

    // Render the hook
    const { result } = renderHook(() => useConcerts());

    // Call getConcertById
    let concertResult;
    await act(async () => {
      concertResult = await result.current.getConcertById('1');
    });
    
    // Verify the result
    expect(concertResult).toEqual(mockConcert);
    
    // Verify service was called correctly
    expect(concertService.getConcertById).toHaveBeenCalledWith('1');
  });

  it('should handle errors when getting a concert by ID', async () => {
    // Mock an error response
    const errorMessage = 'Concert not found';
    concertService.getConcertById.mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => useConcerts());

    // Call getConcertById and expect it to throw
    await act(async () => {
      try {
        await result.current.getConcertById('non-existent');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
    
    // Error state should be set
    expect(result.current.error).toBe(errorMessage);
  });
});
