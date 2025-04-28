import venueService from '../venueService';
import supabase from '../supabase';

// Mock the Supabase client
jest.mock('../supabase', () => ({
  from: jest.fn(),
}));

describe('venueService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVenues', () => {
    it('should fetch venues with default parameters', async () => {
      // Mock the Supabase response
      const mockData = [
        { id: 'v1', name: 'Test Venue', parks: { id: 'p1', name: 'Test Park' } },
        { id: 'v2', name: 'Another Venue', parks: { id: 'p2', name: 'Another Park' } },
      ];
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
      const result = await venueService.getVenues();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('venues');
      expect(selectMock).toHaveBeenCalled();
      expect(orderMock).toHaveBeenCalledWith('name', { ascending: true });
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

    it('should apply name filter correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
        count: 0,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const rangeMock = jest.fn().mockReturnThis();
      const ilikeMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        ilike: ilikeMock,
      });

      // Call the service function with name filter
      const name = 'Venue';
      await venueService.getVenues({ name });

      // Verify name filter was applied correctly
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${name}%`);
    });

    it('should apply park filter correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
        count: 0,
      };

      // Set up the mock chain
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

      // Call the service function with park filter
      const parkId = 'park-123';
      await venueService.getVenues({ parkId });

      // Verify park filter was applied correctly
      expect(eqMock).toHaveBeenCalledWith('park_id', parkId);
    });

    it('should apply pagination correctly', async () => {
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
      const result = await venueService.getVenues({
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
      await expect(venueService.getVenues()).rejects.toThrow('API error');
    });
  });

  describe('getVenueById', () => {
    it('should fetch a single venue by ID', async () => {
      // Mock the Supabase response for a single venue
      const mockVenue = {
        id: 'v1',
        name: 'Test Venue',
        description: 'A test venue description',
        location_details: 'Near the entrance',
        image_url: '/images/test-venue.jpg',
        parks: {
          id: 'p1',
          name: 'Test Park',
        },
      };
      const mockResponse = {
        data: mockVenue,
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
      const venueId = 'v1';
      const result = await venueService.getVenueById(venueId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('venues');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('id', venueId);
      expect(singleMock).toHaveBeenCalled();

      // Verify the result is what we expect
      expect(result).toEqual(mockVenue);
    });

    it('should throw an error when venue is not found', async () => {
      // Mock an error response for non-existent venue
      const mockResponse = {
        data: null,
        error: new Error('Venue not found'),
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
      const venueId = 'non-existent-id';
      await expect(venueService.getVenueById(venueId)).rejects.toThrow('Venue not found');
    });
  });

  describe('getVenuesByPark', () => {
    it('should fetch venues by park ID', async () => {
      // Mock the Supabase response
      const mockVenues = [
        { id: 'v1', name: 'Venue 1', park_id: 'p1' },
        { id: 'v2', name: 'Venue 2', park_id: 'p1' },
      ];
      const mockResponse = {
        data: mockVenues,
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
      const parkId = 'p1';
      const result = await venueService.getVenuesByPark(parkId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('venues');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('park_id', parkId);
      expect(orderMock).toHaveBeenCalledWith('name');

      // Verify the result is what we expect
      expect(result).toEqual(mockVenues);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for park venues'),
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
      const parkId = 'p1';
      await expect(venueService.getVenuesByPark(parkId)).rejects.toThrow(
        'API error for park venues'
      );
    });
  });

  describe('getVenueConcerts', () => {
    it('should fetch concerts for a venue', async () => {
      // Mock the Supabase response
      const mockConcerts = [
        { id: 'c1', start_time: '2025-05-01T20:00:00Z', venue_id: 'v1' },
        { id: 'c2', start_time: '2025-05-02T19:00:00Z', venue_id: 'v1' },
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
      const venueId = 'v1';
      const result = await venueService.getVenueConcerts(venueId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('venue_id', venueId);
      expect(orderMock).toHaveBeenCalledWith('start_time');

      // Verify the result is what we expect
      expect(result).toEqual(mockConcerts);
    });

    it('should apply date filter correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        gte: gteMock,
        order: orderMock,
      });

      // Call the service function with date filter
      const venueId = 'v1';
      const startDate = new Date('2025-05-01');
      await venueService.getVenueConcerts(venueId, startDate);

      // Verify date filter was applied correctly
      expect(gteMock).toHaveBeenCalledWith('start_time', startDate.toISOString());
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for venue concerts'),
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
      const venueId = 'v1';
      await expect(venueService.getVenueConcerts(venueId)).rejects.toThrow(
        'API error for venue concerts'
      );
    });
  });

  describe('searchVenues', () => {
    it('should search venues by name', async () => {
      // Mock the Supabase response
      const mockVenues = [
        { id: 'v1', name: 'Test Venue' },
        { id: 'v2', name: 'Testing Stage' },
      ];
      const mockResponse = {
        data: mockVenues,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const ilikeMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        ilike: ilikeMock,
        order: orderMock,
        limit: limitMock,
      });

      // Call the service function
      const query = 'test';
      const result = await venueService.searchVenues(query);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('venues');
      expect(selectMock).toHaveBeenCalled();
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${query}%`);
      expect(orderMock).toHaveBeenCalledWith('name');
      expect(limitMock).toHaveBeenCalledWith(20);

      // Verify the result is what we expect
      expect(result).toEqual(mockVenues);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for venue search'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const ilikeMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        ilike: ilikeMock,
        order: orderMock,
        limit: limitMock,
      });

      // Assert that service throws the error
      const query = 'test';
      await expect(venueService.searchVenues(query)).rejects.toThrow('API error for venue search');
    });
  });
});
