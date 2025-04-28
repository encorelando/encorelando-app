import artistService from '../artistService';
import supabase from '../supabase';

// Mock the Supabase client
jest.mock('../supabase', () => ({
  from: jest.fn(),
}));

describe('artistService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getArtists', () => {
    it('should fetch artists with default parameters', async () => {
      // Mock the Supabase response
      const mockData = [
        { id: 'a1', name: 'Test Artist', genres: ['Rock'] },
        { id: 'a2', name: 'Another Artist', genres: ['Jazz', 'Blues'] },
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
      const result = await artistService.getArtists();

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('artists');
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
      const name = 'Artist';
      await artistService.getArtists({ name });

      // Verify name filter was applied correctly
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${name}%`);
    });

    it('should apply genre filter correctly', async () => {
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
      const containsMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        contains: containsMock,
      });

      // Call the service function with genre filter
      const genre = 'Rock';
      await artistService.getArtists({ genre });

      // Verify genre filter was applied correctly
      expect(containsMock).toHaveBeenCalledWith('genres', [genre]);
    });

    it('should apply festival filter correctly', async () => {
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
      const inMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        order: orderMock,
        range: rangeMock,
        in: inMock,
      });

      // Call the service function with festival filter
      const festivalId = 'festival-123';
      await artistService.getArtists({ festivalId });

      // Verify festival filter was applied correctly - should use a subquery
      expect(inMock).toHaveBeenCalled();
    });

    it('should apply sort and order correctly', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
        count: 0,
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

      // Call the service function with custom sort and order
      await artistService.getArtists({
        sort: 'created_at',
        order: 'desc',
      });

      // Verify sort and order were applied correctly
      expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
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
      await expect(artistService.getArtists()).rejects.toThrow('API error');
    });
  });

  describe('getArtistById', () => {
    it('should fetch a single artist by ID', async () => {
      // Mock the Supabase response for a single artist
      const mockArtist = {
        id: 'a1',
        name: 'Test Artist',
        description: 'A test artist description',
        image_url: '/images/test-artist.jpg',
        website_url: 'https://example.com',
        genres: ['Rock', 'Pop'],
      };
      const mockResponse = {
        data: mockArtist,
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
      const artistId = 'a1';
      const result = await artistService.getArtistById(artistId);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('artists');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('id', artistId);
      expect(singleMock).toHaveBeenCalled();

      // Verify the result is what we expect
      expect(result).toEqual(mockArtist);
    });

    it('should throw an error when artist is not found', async () => {
      // Mock an error response for non-existent artist
      const mockResponse = {
        data: null,
        error: new Error('Artist not found'),
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
      const artistId = 'non-existent-id';
      await expect(artistService.getArtistById(artistId)).rejects.toThrow('Artist not found');
    });
  });

  describe('getPopularArtists', () => {
    it('should fetch popular artists with the correct limit', async () => {
      // Mock the Supabase response
      const mockArtists = [
        { id: 'a1', name: 'Popular Artist 1' },
        { id: 'a2', name: 'Popular Artist 2' },
        { id: 'a3', name: 'Popular Artist 3' },
      ];
      const mockResponse = {
        data: mockArtists,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        limit: limitMock,
      });

      // Call the service function with a custom limit
      const limit = 3;
      const result = await artistService.getPopularArtists(limit);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('artists');
      expect(selectMock).toHaveBeenCalled();
      expect(limitMock).toHaveBeenCalledWith(limit);

      // Verify the result is what we expect
      expect(result).toEqual(mockArtists);
    });

    it('should use the default limit when not provided', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        limit: limitMock,
      });

      // Call the service function without specifying limit
      await artistService.getPopularArtists();

      // Verify default limit was used
      expect(limitMock).toHaveBeenCalledWith(10);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for popular artists'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        limit: limitMock,
      });

      // Assert that service throws the error
      await expect(artistService.getPopularArtists()).rejects.toThrow(
        'API error for popular artists'
      );
    });
  });

  describe('searchArtists', () => {
    it('should search artists by name', async () => {
      // Mock the Supabase response
      const mockArtists = [
        { id: 'a1', name: 'Test Artist' },
        { id: 'a2', name: 'Testing Band' },
      ];
      const mockResponse = {
        data: mockArtists,
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
      const result = await artistService.searchArtists(query);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('artists');
      expect(selectMock).toHaveBeenCalled();
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${query}%`);
      expect(orderMock).toHaveBeenCalledWith('name');
      expect(limitMock).toHaveBeenCalledWith(20);

      // Verify the result is what we expect
      expect(result).toEqual(mockArtists);
    });

    it('should use the provided limit', async () => {
      // Mock the Supabase response
      const mockResponse = {
        data: [],
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

      // Call the service function with custom limit
      const query = 'test';
      const limit = 5;
      await artistService.searchArtists(query, limit);

      // Verify limit was applied correctly
      expect(limitMock).toHaveBeenCalledWith(limit);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for search'),
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
      await expect(artistService.searchArtists(query)).rejects.toThrow('API error for search');
    });
  });

  describe('getArtistsByGenre', () => {
    it('should fetch artists by genre', async () => {
      // Mock the Supabase response
      const mockArtists = [
        { id: 'a1', name: 'Rock Artist 1', genres: ['Rock'] },
        { id: 'a2', name: 'Rock Artist 2', genres: ['Rock', 'Blues'] },
      ];
      const mockResponse = {
        data: mockArtists,
        error: null,
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const containsMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        contains: containsMock,
        order: orderMock,
        limit: limitMock,
      });

      // Call the service function
      const genre = 'Rock';
      const result = await artistService.getArtistsByGenre(genre);

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('artists');
      expect(selectMock).toHaveBeenCalled();
      expect(containsMock).toHaveBeenCalledWith('genres', [genre]);
      expect(orderMock).toHaveBeenCalledWith('name');
      expect(limitMock).toHaveBeenCalledWith(20);

      // Verify the result is what we expect
      expect(result).toEqual(mockArtists);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: new Error('API error for genre artists'),
      };

      // Set up the mock chain
      const selectMock = jest.fn().mockReturnThis();
      const containsMock = jest.fn().mockReturnThis();
      const orderMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(mockResponse);

      supabase.from.mockReturnValue({
        select: selectMock,
        contains: containsMock,
        order: orderMock,
        limit: limitMock,
      });

      // Assert that service throws the error
      const genre = 'Rock';
      await expect(artistService.getArtistsByGenre(genre)).rejects.toThrow(
        'API error for genre artists'
      );
    });
  });
});
