// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

// Add custom jest-axe matchers
expect.extend(toHaveNoViolations);

// Configure testing library
configure({ 
  testIdAttribute: 'data-testid',
  // Use a smaller timeout for more responsive tests
  asyncUtilTimeout: 1000,
});

// Mock Supabase client
jest.mock('../services/supabase', () => {
  return {
    __esModule: true,
    default: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
            in: jest.fn(),
            range: jest.fn(),
            order: jest.fn(() => ({
              select: jest.fn(),
              range: jest.fn(),
              eq: jest.fn(),
              gt: jest.fn(),
              lt: jest.fn(),
              gte: jest.fn(),
              lte: jest.fn(),
              ilike: jest.fn(),
              contains: jest.fn(),
              in: jest.fn(),
            })),
          })),
          neq: jest.fn(),
          gt: jest.fn(),
          lt: jest.fn(),
          gte: jest.fn(),
          lte: jest.fn(),
          ilike: jest.fn(),
          contains: jest.fn(),
          order: jest.fn(() => ({
            eq: jest.fn(),
            range: jest.fn(),
            single: jest.fn(),
          })),
          range: jest.fn(() => ({
            eq: jest.fn(),
            order: jest.fn(),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(),
          match: jest.fn(),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(),
          match: jest.fn(),
        })),
      }),
      auth: {
        signIn: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChange: jest.fn(),
        session: jest.fn(),
        user: jest.fn(),
      },
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn(),
          download: jest.fn(),
          remove: jest.fn(),
          list: jest.fn(),
        })),
      },
    },
  };
});

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for infinite scroll and lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn(index => {
      return Object.keys(store)[index] || null;
    }),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
