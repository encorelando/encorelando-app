import parkService from '../parkService';
import supabase from '../supabase';

// Mock the Supabase client
jest.mock('../supabase', () => ({
  from: jest.fn(),
}));

describe('parkService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getParks', () => {
    it('should fetch parks with default parameters', async () => {
      // Mock the Supabase response
      const mockData = [
        { id: 'p1', name: 'Test Park' },
        { id: 'p2', name: 'Another Park' }
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
      const result = await parkService.getParks();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('parks');
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
      const name = 'Park';
      await parkService.getParks({ name });

      // Verify name filter was applied correctly
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${name}%`);
    });

    it('should apply hasFestivals filter correctly', async () => {
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
      const notMock = jest.fn().mockReturnThis();
      const isMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        not: notMock,
        is: isMock,
      });

      // Call the service function with hasFestivals filter
      await parkService.getParks({ hasFestivals: true });

      // Verify festivals filter was applied correctly
      expect(notMock).toHaveBeenCalled();
      expect(isMock).toHaveBeenCalled();
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
      await expect(parkService.getParks()).rejects.toThrow('API error');
    });
  });

  describe('getParkById', () => {
    it('should fetch a single park by ID', async () => {
      // Mock the Supabase response for a single park
      const mockPark = {
        id: 'p1',
        name: 'Test Park',
        description: 'A test park description',
        website_url: 'https://example.com',
        image_url: '/images/test-park.jpg',
      };
      const mockResponse = {
        data: mockPark,
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
      const parkId = 'p1';
      const result = await parkService.getParkById(parkId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('parks');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('id', parkId);
      expect(singleMock).toHaveBeenCalled();

      // Verify the result is what we expect
      expect(result).toEqual(mockPark);
    });

    it('should throw an error when park is not found', async () => {
      // Mock an error response for non-existent park
      const mockResponse = {
        data: null,
        error: new Error('Park not found'),
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
      const parkId = 'non-existent-id';
      await expect(parkService.getParkById(parkId)).rejects.toThrow('Park not found');
    });
  });

  describe('getParkVenues', () => {
    it('should fetch venues for a park', async () => {
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
      const result = await parkService.getParkVenues(parkId);

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
      await expect(parkService.getParkVenues(parkId)).rejects.toThrow('API error for park venues');
    });
  });

  describe('getParkFestivals', () => {
    it('should fetch festivals for a park', async () => {
      // Mock the Supabase response
      const mockFestivals = [
        { id: 'f1', name: 'Festival 1', park_id: 'p1', start_date: '2025-05-01', end_date: '2025-05-05' },
        { id: 'f2', name: 'Festival 2', park_id: 'p1', start_date: '2025-06-01', end_date: '2025-06-05' },
      ];
      const mockResponse = {
        data: mockFestivals,
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
      const result = await parkService.getParkFestivals(parkId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('festivals');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('park_id', parkId);
      expect(orderMock).toHaveBeenCalledWith('start_date');

      // Verify the result is what we expect
      expect(result).toEqual(mockFestivals);
    });

    it('should apply current filter correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        lte: lteMock,
        gte: gteMock,
        order: orderMock,
      });

      // Call the service function with current filter
      const parkId = 'p1';
      await parkService.getParkFestivals(parkId, true);

      // Verify current filter was applied correctly
      expect(lteMock).toHaveBeenCalled(); // Start date <= today
      expect(gteMock).toHaveBeenCalled(); // End date >= today
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for park festivals'),
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
      await expect(parkService.getParkFestivals(parkId)).rejects.toThrow('API error for park festivals');
    });
  });

  describe('getParkConcerts', () => {
    it('should fetch concerts for a park', async () => {
      // Mock the Supabase response
      const mockConcerts = [
        { id: 'c1', start_time: '2025-05-01T20:00:00Z' },
        { id: 'c2', start_time: '2025-05-02T19:00:00Z' },
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
      const parkId = 'p1';
      const result = await parkService.getParkConcerts(parkId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('concerts');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('venues.park_id', parkId);
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
      const parkId = 'p1';
      const startDate = new Date('2025-05-01');
      await parkService.getParkConcerts(parkId, startDate);

      // Verify date filter was applied correctly
      expect(gteMock).toHaveBeenCalledWith('start_time', startDate.toISOString());
    });

    it('should apply festival filter correctly', async () => {
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

      // Call the service function with festival filter
      const parkId = 'p1';
      const festivalId = 'f1';
      await parkService.getParkConcerts(parkId, null, festivalId);

      // Verify festival filter was applied correctly
      expect(eqMock).toHaveBeenCalledWith('festival_id', festivalId);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for park concerts'),
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
      await expect(parkService.getParkConcerts(parkId)).rejects.toThrow('API error for park concerts');
    });
  });

  describe('searchParks', () => {
    it('should search parks by name', async () => {
      // Mock the Supabase response
      const mockParks = [
        { id: 'p1', name: 'Test Park' },
        { id: 'p2', name: 'Testing Land' },
      ];
      const mockResponse = {
        data: mockParks,
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
      const result = await parkService.searchParks(query);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('parks');
      expect(selectMock).toHaveBeenCalled();
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${query}%`);
      expect(orderMock).toHaveBeenCalledWith('name');
      expect(limitMock).toHaveBeenCalledWith(20);

      // Verify the result is what we expect
      expect(result).toEqual(mockParks);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for park search'),
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
      await expect(parkService.searchParks(query)).rejects.toThrow('API error for park search');
    });
  });
});
