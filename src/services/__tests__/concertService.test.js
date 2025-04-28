import concertService from '../concertService';
import supabase from '../supabase';

// Mock the Supabase client
jest.mock('../supabase', () => ({
  from: jest.fn(),
}));

describe('concertService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConcerts', () => {
    it('should fetch concerts with default parameters', async () => {
      // Mock the Supabase response
      const mockData = [{ id: '1', name: 'Test Concert' }];
      const mockResponse = {
        data: mockData,
        error: null,
        count: mockData.length,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const rangeMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
      });

      // Call the service function
      const result = await concertService.getConcerts();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalledWith(`
        id,
        start_time,
        end_time,
        notes,
        artists:artist_id (id, name),
        venues:venue_id (id, name),
        festivals:festival_id (id, name)
      `);
      expect(orderMock).toHaveBeenCalledWith('start_time');
      expect(rangeMock).toHaveBeenCalledWith(0, 19);

      // Verify the result is what we expect
      expect(result).toEqual({
        data: mockData,
        pagination: {
          total: mockData.length,
          limit: 20,
          offset: 0,
        },
      });
    });

    it('should apply date filters correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
        count: 0,
      };

      // Set up the mock chain with additional filter methods
      const selectMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const rangeMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        gte: gteMock,
        lte: lteMock,
      });

      // Create test dates
      const startDate = new Date('2025-05-01');
      const endDate = new Date('2025-05-31');

      // Call the service function with date filters
      await concertService.getConcerts({
        startDate,
        endDate,
      });

      // Verify date filters were applied correctly
      expect(gteMock).toHaveBeenCalledWith('start_time', startDate.toISOString());
      expect(lteMock).toHaveBeenCalledWith('start_time', endDate.toISOString());
    });

    it('should apply ID filters correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
        count: 0,
      };

      // Set up the mock chain with additional filter methods
      const selectMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const rangeMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        eq: eqMock,
      });

      // Test IDs
      const artistId = 'artist-123';
      const venueId = 'venue-456';
      const festivalId = 'festival-789';

      // Call the service function with ID filters
      await concertService.getConcerts({
        artistId,
        venueId,
        festivalId,
      });

      // Verify ID filters were applied correctly
      expect(eqMock).toHaveBeenCalledWith('artist_id', artistId);
      expect(eqMock).toHaveBeenCalledWith('venue_id', venueId);
      expect(eqMock).toHaveBeenCalledWith('festival_id', festivalId);
    });

    it('should handle park filtering correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
        count: 0,
      };

      // Set up the mock chain with the eq method
      const selectMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const rangeMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        eq: eqMock,
      });

      // Test park ID
      const parkId = 'park-123';

      // Call the service function with park filter
      await concertService.getConcerts({
        parkId,
      });

      // Verify park filter was applied correctly
      expect(eqMock).toHaveBeenCalledWith('venues.park_id', parkId);
    });

    it('should handle pagination correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
        count: 100,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const rangeMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
      });

      // Call the service function with custom pagination
      const limit = 10;
      const offset = 20;
      const result = await concertService.getConcerts({
        limit,
        offset,
      });

      // Verify pagination was applied correctly
      expect(rangeMock).toHaveBeenCalledWith(offset, offset + limit - 1);
      expect(result.pagination).toEqual({
        total: 100,
        limit,
        offset,
      });
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockError = new Error('API error');
      const mockResponse = {
        data: null,
        error: mockError,
      };

      // Set up the mock chain to return an error
      const selectMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const rangeMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
      });

      // Assert that service throws the error
      await expect(concertService.getConcerts()).rejects.toThrow('API error');
    });
  });

  describe('getConcertById', () => {
    it('should fetch a single concert by ID', async () => {
      // Mock the Supabase response for a single concert
      const mockConcert = {
        id: '1',
        start_time: '2025-05-01T20:00:00Z',
        artists: { id: 'a1', name: 'Test Artist' },
      };
      const mockResponse = {
        data: mockConcert,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const singleMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        single: singleMock,
      });

      // Call the service function
      const concertId = '1';
      const result = await concertService.getConcertById(concertId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('id', concertId);
      expect(singleMock).toHaveBeenCalled();

      // Verify the result is what we expect
      expect(result).toEqual(mockConcert);
    });

    it('should throw an error when concert is not found', async () => {
      // Mock an error response for non-existent concert
      const mockResponse = {
        data: null,
        error: new Error('Concert not found'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const singleMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        single: singleMock,
      });

      // Assert that service throws the error
      const concertId = 'non-existent-id';
      await expect(concertService.getConcertById(concertId)).rejects.toThrow('Concert not found');
    });
  });

  describe('getUpcomingConcerts', () => {
    it('should fetch upcoming concerts', async () => {
      // Mock the Supabase response
      const mockConcerts = [
        { id: '1', start_time: '2025-05-01T20:00:00Z' },
        { id: '2', start_time: '2025-05-02T19:00:00Z' },
      ];
      const mockResponse = {
        data: mockConcerts,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gte: gteMock,
        order: orderMock,
        limit: limitMock,
      });

      // Call the service function
      const result = await concertService.getUpcomingConcerts();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalled();
      expect(gteMock).toHaveBeenCalledWith('start_time', expect.any(String));
      expect(orderMock).toHaveBeenCalledWith('start_time');
      expect(limitMock).toHaveBeenCalledWith(20);

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should apply park and festival filters correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gte: gteMock,
        order: orderMock,
        limit: limitMock,
        eq: eqMock,
      });

      // Test IDs
      const parkId = 'park-123';
      const festivalId = 'festival-456';

      // Call the service function with filters
      await concertService.getUpcomingConcerts({
        parkId,
        festivalId,
      });

      // Verify filters were applied correctly
      expect(eqMock).toHaveBeenCalledWith('venues.park_id', parkId);
      expect(eqMock).toHaveBeenCalledWith('festival_id', festivalId);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for upcoming concerts'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gte: gteMock,
        order: orderMock,
        limit: limitMock,
      });

      // Assert that service throws the error
      await expect(concertService.getUpcomingConcerts()).rejects.toThrow(
        'API error for upcoming concerts'
      );
    });
  });

  describe('getConcertsByDate', () => {
    it('should fetch concerts for a specific date', async () => {
      // Mock the Supabase response
      const mockConcerts = [
        { id: '1', start_time: '2025-05-01T15:00:00Z' },
        { id: '2', start_time: '2025-05-01T20:00:00Z' },
      ];
      const mockResponse = {
        data: mockConcerts,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gte: gteMock,
        lte: lteMock,
        order: orderMock,
      });

      // Call the service function
      const date = '2025-05-01';
      const result = await concertService.getConcertsByDate(date);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalled();
      expect(gteMock).toHaveBeenCalled();
      expect(lteMock).toHaveBeenCalled();
      expect(orderMock).toHaveBeenCalledWith('start_time');

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should apply park and festival filters correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gte: gteMock,
        lte: lteMock,
        order: orderMock,
        eq: eqMock,
      });

      // Test IDs
      const parkId = 'park-123';
      const festivalId = 'festival-456';

      // Call the service function with filters
      const date = '2025-05-01';
      await concertService.getConcertsByDate(date, {
        parkId,
        festivalId,
      });

      // Verify filters were applied correctly
      expect(eqMock).toHaveBeenCalledWith('venues.park_id', parkId);
      expect(eqMock).toHaveBeenCalledWith('festival_id', festivalId);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for date concerts'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gte: gteMock,
        lte: lteMock,
        order: orderMock,
      });

      // Assert that service throws the error
      const date = '2025-05-01';
      await expect(concertService.getConcertsByDate(date)).rejects.toThrow(
        'API error for date concerts'
      );
    });
  });

  describe('getConcertsByArtist', () => {
    it('should fetch concerts for a specific artist', async () => {
      // Mock the Supabase response
      const mockConcerts = [
        { id: '1', start_time: '2025-05-01T20:00:00Z' },
        { id: '2', start_time: '2025-05-10T19:00:00Z' },
      ];
      const mockResponse = {
        data: mockConcerts,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Call the service function
      const artistId = 'artist-123';
      const result = await concertService.getConcertsByArtist(artistId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('artist_id', artistId);
      expect(orderMock).toHaveBeenCalledWith('start_time');

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should include past concerts when specified', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Call the service function with includePast = true
      const artistId = 'artist-123';
      await concertService.getConcertsByArtist(artistId, true);

      // Verify that gte filter for current date is NOT applied
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(eqMock).toHaveBeenCalledWith('artist_id', artistId);
      expect(orderMock).toHaveBeenCalledWith('start_time');
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for artist concerts'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Assert that service throws the error
      const artistId = 'artist-123';
      await expect(concertService.getConcertsByArtist(artistId)).rejects.toThrow(
        'API error for artist concerts'
      );
    });
  });

  describe('getConcertsByFestival', () => {
    it('should fetch concerts for a specific festival', async () => {
      // Mock the Supabase response
      const mockConcerts = [
        { id: '1', start_time: '2025-05-01T20:00:00Z' },
        { id: '2', start_time: '2025-05-02T19:00:00Z' },
      ];
      const mockResponse = {
        data: mockConcerts,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Call the service function
      const festivalId = 'festival-123';
      const result = await concertService.getConcertsByFestival(festivalId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('festival_id', festivalId);
      expect(orderMock).toHaveBeenCalledWith('start_time');

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should filter by date when specified', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        gte: gteMock,
        lte: lteMock,
        order: orderMock,
      });

      // Call the service function with date filter
      const festivalId = 'festival-123';
      const date = '2025-05-01';
      await concertService.getConcertsByFestival(festivalId, { date });

      // Verify that date filters are applied
      expect(gteMock).toHaveBeenCalled();
      expect(lteMock).toHaveBeenCalled();
    });

    it('should sort alphabetically by artist name when specified', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Call the service function with alphabetical sort
      const festivalId = 'festival-123';
      await concertService.getConcertsByFestival(festivalId, { sort: 'alphabetical' });

      // Verify that sorting is by artist name
      expect(orderMock).toHaveBeenCalledWith('artists.name');
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for festival concerts'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Assert that service throws the error
      const festivalId = 'festival-123';
      await expect(concertService.getConcertsByFestival(festivalId)).rejects.toThrow(
        'API error for festival concerts'
      );
    });
  });
});
