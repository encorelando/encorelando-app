import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe } from 'jest-axe';

// Mock data for testing
export const mockConcerts = [
  {
    id: '1',
    start_time: '2025-05-01T19:00:00Z',
    end_time: '2025-05-01T21:00:00Z',
    notes: 'Special performance',
    artists: {
      id: 'a1',
      name: 'Test Artist'
    },
    venues: {
      id: 'v1',
      name: 'Test Venue'
    },
    festivals: {
      id: 'f1',
      name: 'Test Festival'
    }
  },
  {
    id: '2',
    start_time: '2025-05-02T20:00:00Z',
    end_time: '2025-05-02T22:00:00Z',
    notes: null,
    artists: {
      id: 'a2',
      name: 'Another Artist'
    },
    venues: {
      id: 'v1',
      name: 'Test Venue'
    },
    festivals: null
  }
];

export const mockArtists = [
  {
    id: 'a1',
    name: 'Test Artist',
    description: 'A test artist description',
    image_url: '/images/test-artist.jpg',
    website_url: 'https://example.com',
    genres: ['Rock', 'Pop']
  },
  {
    id: 'a2',
    name: 'Another Artist',
    description: 'Another artist description',
    image_url: '/images/another-artist.jpg',
    website_url: null,
    genres: ['Jazz', 'Blues']
  }
];

export const mockVenues = [
  {
    id: 'v1',
    name: 'Test Venue',
    description: 'A test venue description',
    location_details: 'Near the entrance',
    image_url: '/images/test-venue.jpg',
    parks: {
      id: 'p1',
      name: 'Test Park'
    }
  },
  {
    id: 'v2',
    name: 'Another Venue',
    description: 'Another venue description',
    location_details: 'By the lake',
    image_url: null,
    parks: {
      id: 'p1',
      name: 'Test Park'
    }
  }
];

export const mockParks = [
  {
    id: 'p1',
    name: 'Test Park',
    description: 'A test park description',
    website_url: 'https://example.com',
    image_url: '/images/test-park.jpg'
  },
  {
    id: 'p2',
    name: 'Another Park',
    description: 'Another park description',
    website_url: 'https://example2.com',
    image_url: '/images/another-park.jpg'
  }
];

export const mockFestivals = [
  {
    id: 'f1',
    name: 'Test Festival',
    start_date: '2025-05-01',
    end_date: '2025-05-03',
    description: 'A test festival description',
    website_url: 'https://example.com',
    image_url: '/images/test-festival.jpg',
    parks: {
      id: 'p1',
      name: 'Test Park'
    }
  },
  {
    id: 'f2',
    name: 'Another Festival',
    start_date: '2025-06-01',
    end_date: '2025-06-02',
    description: 'Another festival description',
    website_url: null,
    image_url: null,
    parks: {
      id: 'p2',
      name: 'Another Park'
    }
  }
];

// Custom render with providers
function render(ui, { route = '/', ...renderOptions } = {}) {
  window.history.pushState({}, 'Test page', route);
  
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  }
  
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Test for accessibility violations
export async function axeTest(html) {
  const results = await axe(html);
  expect(results).toHaveNoViolations();
}

// Set up different viewport sizes for responsive testing
export function setMobileViewport() {
  global.innerWidth = 375;
  global.innerHeight = 667;
  global.dispatchEvent(new Event('resize'));
}

export function setTabletViewport() {
  global.innerWidth = 768;
  global.innerHeight = 1024;
  global.dispatchEvent(new Event('resize'));
}

export function setDesktopViewport() {
  global.innerWidth = 1280;
  global.innerHeight = 800;
  global.dispatchEvent(new Event('resize'));
}

// Mock Supabase responses
export function mockSupabaseResponse(module, method, response) {
  const supabase = require('../services/supabase').default;
  
  // Handle different methods and their chaining
  if (method === 'select') {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(response)
        })
      })
    });
  } else if (method === 'getById') {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(response)
        })
      })
    });
  } else {
    // Generic mock for other cases
    supabase.from.mockReturnValueOnce({
      [method]: jest.fn().mockResolvedValue(response)
    });
  }
}

// Export utilities and mocked data
export {
  render,
  // Re-export testing-library utilities
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
