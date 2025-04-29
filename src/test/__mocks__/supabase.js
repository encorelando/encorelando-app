// Mock for Supabase client
const createSupabaseMock = () => {
  // Create chainable mock functions
  const selectMock = jest.fn().mockReturnThis();
  const orderMock = jest.fn().mockReturnThis();
  const rangeMock = jest.fn().mockReturnThis();
  const eqMock = jest.fn().mockReturnThis();
  const ilikeMock = jest.fn().mockReturnThis();
  const gteMock = jest.fn().mockReturnThis();
  const lteMock = jest.fn().mockReturnThis();
  const containsMock = jest.fn().mockReturnThis();
  const inMock = jest.fn().mockReturnThis();
  const notMock = jest.fn().mockReturnThis();
  const singleMock = jest.fn().mockReturnThis();
  const limitMock = jest.fn().mockReturnThis();

  // Mock response for successful queries
  const mockResponse = {
    data: [],
    error: null,
    count: 0,
  };

  // Final return function to terminate the chain
  const executeQueryMock = jest.fn().mockResolvedValue(mockResponse);

  // Create the Supabase mock
  const supabaseMock = {
    from: jest.fn().mockReturnValue({
      select: selectMock,
      order: orderMock,
      range: rangeMock,
      eq: eqMock,
      ilike: ilikeMock,
      gte: gteMock,
      lte: lteMock,
      contains: containsMock,
      in: inMock,
      not: notMock,
      single: singleMock,
      limit: limitMock,
      then: executeQueryMock,
    }),
    mocks: {
      selectMock,
      orderMock,
      rangeMock,
      eqMock,
      ilikeMock,
      gteMock,
      lteMock,
      containsMock,
      inMock,
      notMock,
      singleMock,
      limitMock,
      executeQueryMock,
    },
    setMockResponse: (response) => {
      executeQueryMock.mockResolvedValue(response);
    },
    setErrorResponse: (error) => {
      executeQueryMock.mockResolvedValue({ data: null, error, count: 0 });
    },
  };

  return supabaseMock;
};

export default createSupabaseMock;