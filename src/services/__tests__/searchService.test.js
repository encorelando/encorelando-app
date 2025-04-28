import searchService from '../searchService';
import concertService from '../concertService';
import artistService from '../artistService';
import venueService from '../venueService';
import parkService from '../parkService';
import festivalService from '../festivalService';

// Mock all service dependencies
jest.mock('../concertService');
jest.mock('../artistService');
jest.mock('../venueService');
jest.mock('../parkService');
jest.mock('../festivalService');

describe('searchService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('globalSearch', () => {
    it('should search across all entities', async () => {
      // Mock service responses
      const mockConcerts = [{ id: 'c1', name: 'Test Concert' }];
      const mockArtists = [{ id: 'a1', name: 'Test Artist' }];
      const mockVenues = [{ id: 'v1', name: 'Test Venue' }];
      const mockParks = [{ id: 'p1', name: 'Test Park' }];
      const mockFestivals = [{ id: 'f1', name: 'Test Festival' }];

      // Setup service mocks
      concertService.searchConcerts = jest.fn().mockResolvedValue(mockConcerts);
      artistService.searchArtists = jest.fn().mockResolvedValue(mockArtists);
      venueService.searchVenues = jest.fn().mockResolvedValue(mockVenues);
      parkService.searchParks = jest.fn().mockResolvedValue(mockParks);
      festivalService.searchFestivals = jest.fn().mockResolvedValue(mockFestivals);

      // Call the service function
      const query = 'test';
      const limit = 5;
      const result = await searchService.globalSearch(query, limit);

      // Verify services were called correctly
      expect(concertService.searchConcerts).toHaveBeenCalledWith(query, limit);
      expect(artistService.searchArtists).toHaveBeenCalledWith(query, limit);
      expect(venueService.searchVenues).toHaveBeenCalledWith(query, limit);
      expect(parkService.searchParks).toHaveBeenCalledWith(query, limit);
      expect(festivalService.searchFestivals).toHaveBeenCalledWith(query, limit);

      // Verify the result is what we expect
      expect(result).toEqual({
        concerts: mockConcerts,
        artists: mockArtists,
        venues: mockVenues,
        parks: mockParks,
        festivals: mockFestivals,
      });
    });

    it('should combine entity results from multiple services', async () => {
      // Mock service responses with different counts to show combined results
      const mockConcerts = [
        { id: 'c1', name: 'Test Concert 1' },
        { id: 'c2', name: 'Test Concert 2' },
      ];
      const mockArtists = [{ id: 'a1', name: 'Test Artist' }];
      const mockVenues = []; // Empty results for venues
      const mockParks = [{ id: 'p1', name: 'Test Park' }];
      const mockFestivals = []; // Empty results for festivals

      // Setup service mocks
      concertService.searchConcerts = jest.fn().mockResolvedValue(mockConcerts);
      artistService.searchArtists = jest.fn().mockResolvedValue(mockArtists);
      venueService.searchVenues = jest.fn().mockResolvedValue(mockVenues);
      parkService.searchParks = jest.fn().mockResolvedValue(mockParks);
      festivalService.searchFestivals = jest.fn().mockResolvedValue(mockFestivals);

      // Call the service function
      const query = 'test';
      const result = await searchService.globalSearch(query);

      // Verify the result contains correct counts
      expect(result.concerts).toHaveLength(2);
      expect(result.artists).toHaveLength(1);
      expect(result.venues).toHaveLength(0);
      expect(result.parks).toHaveLength(1);
      expect(result.festivals).toHaveLength(0);
    });

    it('should handle errors from individual services gracefully', async () => {
      // Mock successful responses for some services
      const mockConcerts = [{ id: 'c1', name: 'Test Concert' }];
      const mockArtists = [{ id: 'a1', name: 'Test Artist' }];
      concertService.searchConcerts = jest.fn().mockResolvedValue(mockConcerts);
      artistService.searchArtists = jest.fn().mockResolvedValue(mockArtists);

      // Mock errors for other services
      venueService.searchVenues = jest.fn().mockRejectedValue(new Error('Venue search failed'));
      parkService.searchParks = jest.fn().mockRejectedValue(new Error('Park search failed'));
      festivalService.searchFestivals = jest
        .fn()
        .mockRejectedValue(new Error('Festival search failed'));

      // Call the service function
      const query = 'test';
      const result = await searchService.globalSearch(query);

      // Verify successful results are returned
      expect(result.concerts).toEqual(mockConcerts);
      expect(result.artists).toEqual(mockArtists);

      // Verify failed services return empty arrays
      expect(result.venues).toEqual([]);
      expect(result.parks).toEqual([]);
      expect(result.festivals).toEqual([]);
    });
  });

  describe('searchConcerts', () => {
    it('should search concerts and include related entities', async () => {
      // Mock service response
      const mockConcerts = [
        {
          id: 'c1',
          start_time: '2025-05-01T20:00:00Z',
          artists: { name: 'Test Artist' },
          venues: { name: 'Test Venue' },
        },
      ];

      // Setup service mock
      concertService.searchConcerts = jest.fn().mockResolvedValue(mockConcerts);

      // Call the service function
      const query = 'test';
      const limit = 10;
      const result = await searchService.searchConcerts(query, limit);

      // Verify service was called correctly
      expect(concertService.searchConcerts).toHaveBeenCalledWith(query, limit);

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response
      concertService.searchConcerts = jest.fn().mockRejectedValue(new Error('Search failed'));

      // Call the service function
      const query = 'test';

      // Verify error is thrown with appropriate message
      await expect(searchService.searchConcerts(query)).rejects.toThrow(
        'Error in searchConcerts: Search failed'
      );
    });
  });

  describe('searchArtists', () => {
    it('should search artists with the specified limit', async () => {
      // Mock service response
      const mockArtists = [{ id: 'a1', name: 'Test Artist' }];

      // Setup service mock
      artistService.searchArtists = jest.fn().mockResolvedValue(mockArtists);

      // Call the service function
      const query = 'test';
      const limit = 5;
      const result = await searchService.searchArtists(query, limit);

      // Verify service was called correctly
      expect(artistService.searchArtists).toHaveBeenCalledWith(query, limit);

      // Verify the result is what we expect
      expect(result).toEqual(mockArtists);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response
      artistService.searchArtists = jest.fn().mockRejectedValue(new Error('Artist search failed'));

      // Call the service function
      const query = 'test';

      // Verify error is thrown with appropriate message
      await expect(searchService.searchArtists(query)).rejects.toThrow(
        'Error in searchArtists: Artist search failed'
      );
    });
  });

  describe('searchVenues', () => {
    it('should search venues with the specified limit', async () => {
      // Mock service response
      const mockVenues = [{ id: 'v1', name: 'Test Venue' }];

      // Setup service mock
      venueService.searchVenues = jest.fn().mockResolvedValue(mockVenues);

      // Call the service function
      const query = 'test';
      const limit = 5;
      const result = await searchService.searchVenues(query, limit);

      // Verify service was called correctly
      expect(venueService.searchVenues).toHaveBeenCalledWith(query, limit);

      // Verify the result is what we expect
      expect(result).toEqual(mockVenues);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response
      venueService.searchVenues = jest.fn().mockRejectedValue(new Error('Venue search failed'));

      // Call the service function
      const query = 'test';

      // Verify error is thrown with appropriate message
      await expect(searchService.searchVenues(query)).rejects.toThrow(
        'Error in searchVenues: Venue search failed'
      );
    });
  });

  describe('searchParks', () => {
    it('should search parks with the specified limit', async () => {
      // Mock service response
      const mockParks = [{ id: 'p1', name: 'Test Park' }];

      // Setup service mock
      parkService.searchParks = jest.fn().mockResolvedValue(mockParks);

      // Call the service function
      const query = 'test';
      const limit = 5;
      const result = await searchService.searchParks(query, limit);

      // Verify service was called correctly
      expect(parkService.searchParks).toHaveBeenCalledWith(query, limit);

      // Verify the result is what we expect
      expect(result).toEqual(mockParks);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response
      parkService.searchParks = jest.fn().mockRejectedValue(new Error('Park search failed'));

      // Call the service function
      const query = 'test';

      // Verify error is thrown with appropriate message
      await expect(searchService.searchParks(query)).rejects.toThrow(
        'Error in searchParks: Park search failed'
      );
    });
  });

  describe('searchFestivals', () => {
    it('should search festivals with the specified limit', async () => {
      // Mock service response
      const mockFestivals = [{ id: 'f1', name: 'Test Festival' }];

      // Setup service mock
      festivalService.searchFestivals = jest.fn().mockResolvedValue(mockFestivals);

      // Call the service function
      const query = 'test';
      const limit = 5;
      const result = await searchService.searchFestivals(query, limit);

      // Verify service was called correctly
      expect(festivalService.searchFestivals).toHaveBeenCalledWith(query, limit);

      // Verify the result is what we expect
      expect(result).toEqual(mockFestivals);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response
      festivalService.searchFestivals = jest
        .fn()
        .mockRejectedValue(new Error('Festival search failed'));

      // Call the service function
      const query = 'test';

      // Verify error is thrown with appropriate message
      await expect(searchService.searchFestivals(query)).rejects.toThrow(
        'Error in searchFestivals: Festival search failed'
      );
    });
  });

  describe('searchByDate', () => {
    it('should search concerts by date', async () => {
      // Mock service response
      const mockConcerts = [
        { id: 'c1', start_time: '2025-05-01T20:00:00Z' },
        { id: 'c2', start_time: '2025-05-01T18:00:00Z' },
      ];

      // Setup service mock
      concertService.getConcertsByDate = jest.fn().mockResolvedValue(mockConcerts);

      // Call the service function
      const date = '2025-05-01';
      const result = await searchService.searchByDate(date);

      // Verify service was called correctly
      expect(concertService.getConcertsByDate).toHaveBeenCalledWith(date, {});

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should apply park and festival filters when provided', async () => {
      // Mock service response
      const mockConcerts = [{ id: 'c1', start_time: '2025-05-01T20:00:00Z' }];

      // Setup service mock
      concertService.getConcertsByDate = jest.fn().mockResolvedValue(mockConcerts);

      // Call the service function with filters
      const date = '2025-05-01';
      const filters = { parkId: 'p1', festivalId: 'f1' };
      await searchService.searchByDate(date, filters);

      // Verify service was called with the filters
      expect(concertService.getConcertsByDate).toHaveBeenCalledWith(date, filters);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response
      concertService.getConcertsByDate = jest
        .fn()
        .mockRejectedValue(new Error('Date search failed'));

      // Call the service function
      const date = '2025-05-01';

      // Verify error is thrown with appropriate message
      await expect(searchService.searchByDate(date)).rejects.toThrow(
        'Error in searchByDate: Date search failed'
      );
    });
  });

  describe('searchUpcoming', () => {
    it('should search upcoming concerts', async () => {
      // Mock service response
      const mockConcerts = [
        { id: 'c1', start_time: '2025-05-01T20:00:00Z' },
        { id: 'c2', start_time: '2025-05-02T19:00:00Z' },
      ];

      // Setup service mock
      concertService.getUpcomingConcerts = jest.fn().mockResolvedValue(mockConcerts);

      // Call the service function
      const limit = 5;
      const result = await searchService.searchUpcoming(limit);

      // Verify service was called correctly
      expect(concertService.getUpcomingConcerts).toHaveBeenCalledWith({ limit });

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should apply park and festival filters when provided', async () => {
      // Mock service response
      const mockConcerts = [{ id: 'c1', start_time: '2025-05-01T20:00:00Z' }];

      // Setup service mock
      concertService.getUpcomingConcerts = jest.fn().mockResolvedValue(mockConcerts);

      // Call the service function with filters
      const filters = { parkId: 'p1', festivalId: 'f1' };
      await searchService.searchUpcoming(10, filters);

      // Verify service was called with the filters
      expect(concertService.getUpcomingConcerts).toHaveBeenCalledWith({ limit: 10, ...filters });
    });

    it('should handle errors gracefully', async () => {
      // Mock error response
      concertService.getUpcomingConcerts = jest
        .fn()
        .mockRejectedValue(new Error('Upcoming search failed'));

      // Call the service function

      // Verify error is thrown with appropriate message
      await expect(searchService.searchUpcoming()).rejects.toThrow(
        'Error in searchUpcoming: Upcoming search failed'
      );
    });
  });
});
