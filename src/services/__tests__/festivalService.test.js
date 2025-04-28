import festivalService from '../festivalService';
import supabase from '../supabase';

// Mock the Supabase client
jest.mock('../supabase', () => ({
  from: jest.fn(),
}));

describe('festivalService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFestivals', () => {
    it('should fetch festivals with default parameters', async () => {
      // Mock the Supabase response
      const mockData = [
        {
          id: 'f1',
          name: 'Test Festival',
          start_date: '2025-05-01',
          end_date: '2025-05-03',
          parks: { id: 'p1', name: 'Test Park' },
        },
        {
          id: 'f2',
          name: 'Another Festival',
          start_date: '2025-06-01',
          end_date: '2025-06-05',
          parks: { id: 'p2', name: 'Another Park' },
        },
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
      const result = await festivalService.getFestivals();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('festivals');
      expect(selectMock).toHaveBeenCalled();
      expect(orderMock).toHaveBeenCalledWith('start_date', { ascending: true });
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
      const name = 'Festival';
      await festivalService.getFestivals({ name });

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
      await festivalService.getFestivals({ parkId });

      // Verify park filter was applied correctly
      expect(eqMock).toHaveBeenCalledWith('park_id', parkId);
    });

    it('should apply date filters correctly', async () => {
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
      const gteMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        gte: gteMock,
        lte: lteMock,
      });

      // Call the service function with date filters
      const startDate = '2025-05-01';
      const endDate = '2025-05-31';
      await festivalService.getFestivals({
        startDate,
        endDate,
      });

      // Verify date filters were applied correctly - should check for overlap
      expect(lteMock).toHaveBeenCalledWith('end_date', endDate);
      expect(gteMock).toHaveBeenCalledWith('start_date', startDate);
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
      await expect(festivalService.getFestivals()).rejects.toThrow('API error');
    });
  });

  describe('getFestivalById', () => {
    it('should fetch a single festival by ID', async () => {
      // Mock the Supabase response for a single festival
      const mockFestival = {
        id: 'f1',
        name: 'Test Festival',
        start_date: '2025-05-01',
        end_date: '2025-05-03',
        description: 'A test festival description',
        website_url: 'https://example.com',
        image_url: '/images/test-festival.jpg',
        parks: {
          id: 'p1',
          name: 'Test Park',
        },
      };
      const mockResponse = {
        data: mockFestival,
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
      const festivalId = 'f1';
      const result = await festivalService.getFestivalById(festivalId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('festivals');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('id', festivalId);
      expect(singleMock).toHaveBeenCalled();

      // Verify the result is what we expect
      expect(result).toEqual(mockFestival);
    });

    it('should throw an error when festival is not found', async () => {
      // Mock an error response for non-existent festival
      const mockResponse = {
        data: null,
        error: new Error('Festival not found'),
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
      const festivalId = 'non-existent-id';
      await expect(festivalService.getFestivalById(festivalId)).rejects.toThrow(
        'Festival not found'
      );
    });
  });

  describe('getCurrentFestivals', () => {
    it('should fetch currently running festivals', async () => {
      // Mock the Supabase response
      const mockFestivals = [
        { id: 'f1', name: 'Current Festival 1', start_date: '2025-04-25', end_date: '2025-05-05' },
        { id: 'f2', name: 'Current Festival 2', start_date: '2025-04-20', end_date: '2025-04-30' },
      ];
      const mockResponse = {
        data: mockFestivals,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        lte: lteMock,
        gte: gteMock,
        order: orderMock,
      });

      // Call the service function
      const result = await festivalService.getCurrentFestivals();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('festivals');
      expect(selectMock).toHaveBeenCalled();
      expect(lteMock).toHaveBeenCalled(); // Start date <= today
      expect(gteMock).toHaveBeenCalled(); // End date >= today
      expect(orderMock).toHaveBeenCalledWith('start_date');

      // Verify the result is what we expect
      expect(result).toEqual(mockFestivals);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for current festivals'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const lteMock = jest.fn().mockReturnThis();
      const gteMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        lte: lteMock,
        gte: gteMock,
        order: orderMock,
      });

      // Assert that service throws the error
      await expect(festivalService.getCurrentFestivals()).rejects.toThrow(
        'API error for current festivals'
      );
    });
  });

  describe('getUpcomingFestivals', () => {
    it('should fetch upcoming festivals', async () => {
      // Mock the Supabase response
      const mockFestivals = [
        { id: 'f1', name: 'Upcoming Festival 1', start_date: '2025-05-10', end_date: '2025-05-15' },
        { id: 'f2', name: 'Upcoming Festival 2', start_date: '2025-05-20', end_date: '2025-05-25' },
      ];
      const mockResponse = {
        data: mockFestivals,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gtMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gt: gtMock,
        order: orderMock,
        limit: limitMock,
      });

      // Call the service function
      const result = await festivalService.getUpcomingFestivals();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('festivals');
      expect(selectMock).toHaveBeenCalled();
      expect(gtMock).toHaveBeenCalled(); // Start date > today
      expect(orderMock).toHaveBeenCalledWith('start_date');
      expect(limitMock).toHaveBeenCalledWith(10);

      // Verify the result is what we expect
      expect(result).toEqual(mockFestivals);
    });

    it('should use the provided limit', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gtMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gt: gtMock,
        order: orderMock,
        limit: limitMock,
      });

      // Call the service function with a custom limit
      const limit = 5;
      await festivalService.getUpcomingFestivals(limit);

      // Verify the limit was applied correctly
      expect(limitMock).toHaveBeenCalledWith(limit);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for upcoming festivals'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const gtMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        gt: gtMock,
        order: orderMock,
        limit: limitMock,
      });

      // Assert that service throws the error
      await expect(festivalService.getUpcomingFestivals()).rejects.toThrow(
        'API error for upcoming festivals'
      );
    });
  });

  describe('getFestivalsByPark', () => {
    it('should fetch festivals by park ID', async () => {
      // Mock the Supabase response
      const mockFestivals = [
        {
          id: 'f1',
          name: 'Park Festival 1',
          park_id: 'p1',
          start_date: '2025-05-01',
          end_date: '2025-05-05',
        },
        {
          id: 'f2',
          name: 'Park Festival 2',
          park_id: 'p1',
          start_date: '2025-06-01',
          end_date: '2025-06-05',
        },
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
      const result = await festivalService.getFestivalsByPark(parkId);

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
      await festivalService.getFestivalsByPark(parkId, true);

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
      await expect(festivalService.getFestivalsByPark(parkId)).rejects.toThrow(
        'API error for park festivals'
      );
    });
  });

  describe('getFestivalConcerts', () => {
    it('should fetch concerts for a festival', async () => {
      // Mock the Supabase response
      const mockConcerts = [
        { id: 'c1', start_time: '2025-05-01T15:00:00Z', festival_id: 'f1' },
        { id: 'c2', start_time: '2025-05-01T20:00:00Z', festival_id: 'f1' },
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
      const festivalId = 'f1';
      const result = await festivalService.getFestivalConcerts(festivalId);

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

      // Call the service function with date
      const festivalId = 'f1';
      const date = '2025-05-01';
      await festivalService.getFestivalConcerts(festivalId, { date });

      // Verify date filter was applied correctly
      expect(gteMock).toHaveBeenCalled(); // Start of day
      expect(lteMock).toHaveBeenCalled(); // End of day
    });

    it('should apply sorting by artist name when specified', async () => {
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
      const festivalId = 'f1';
      await festivalService.getFestivalConcerts(festivalId, { sort: 'alphabetical' });

      // Verify sorting was applied correctly
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
      const festivalId = 'f1';
      await expect(festivalService.getFestivalConcerts(festivalId)).rejects.toThrow(
        'API error for festival concerts'
      );
    });
  });

  describe('searchFestivals', () => {
    it('should search festivals by name', async () => {
      // Mock the Supabase response
      const mockFestivals = [
        { id: 'f1', name: 'Test Festival' },
        { id: 'f2', name: 'Testing Event' },
      ];
      const mockResponse = {
        data: mockFestivals,
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
      const result = await festivalService.searchFestivals(query);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('festivals');
      expect(selectMock).toHaveBeenCalled();
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${query}%`);
      expect(orderMock).toHaveBeenCalledWith('start_date');
      expect(limitMock).toHaveBeenCalledWith(20);

      // Verify the result is what we expect
      expect(result).toEqual(mockFestivals);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for festival search'),
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
      await expect(festivalService.searchFestivals(query)).rejects.toThrow(
        'API error for festival search'
      );
    });
  });
});
