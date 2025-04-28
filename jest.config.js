module.exports = {
  // The root directory that Jest should scan for tests and modules
  roots: ['<rootDir>/src'],
  
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/*.test.js'
  ],
  
  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // Setup file after environment is set up
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],
  
  // A map from regular expressions to module names or to arrays of module names
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Handle CSS imports (without CSS modules)
    '\\.(css|sass|scss)$': '<rootDir>/src/test/__mocks__/styleMock.js',
    
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/test/__mocks__/fileMock.js',
    
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/coverage',
  
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/test/**/*',
    '!src/**/__mocks__/**/*',
    '!src/**/*.stories.{js,jsx}',
    '!**/node_modules/**'
  ],
  
  // The threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    },
    './src/services/': {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90
    }
  },
  
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Automatically reset mock state between every test
  resetMocks: false,
  
  // Restore the original implementation of mocked modules between tests
  restoreMocks: false,
  
  // Whether to use watchman for file crawling
  watchman: true,
  
  // Prevents tests from printing console messages 
  // silent: true,
  
  // Time in milliseconds after which a test is considered slow
  slowTestThreshold: 5,
  
  // Maximum number of workers to use when running tests
  maxWorkers: '50%',
  
  // Display individual test results with the test suite hierarchy
  displayName: {
    name: 'EncoreLando',
    color: 'magenta',
  },
  
  // Notify the test results with OS notification
  notify: false,
};
