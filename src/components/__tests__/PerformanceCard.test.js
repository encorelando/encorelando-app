import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import PerformanceCard from '../organisms/PerformanceCard';
import { formatTime, formatDate } from '../../utils/dateUtils';

// Mock the Icon component
jest.mock('../atoms/Icon', () => {
  return function MockIcon({ name, className }) {
    return <span data-testid={`icon-${name}`} className={className} />;
  };
});

// Mock the dateUtils functions
jest.mock('../../utils/dateUtils', () => ({
  formatTime: jest.fn(date => '8:00 PM'),
  formatDate: jest.fn(date => 'May 1, 2025'),
}));

describe('PerformanceCard', () => {
  const defaultPerformance = {
    id: 'concert-123',
    startTime: '2025-05-01T20:00:00Z',
    endTime: '2025-05-01T22:00:00Z',
    artist: {
      id: 'artist-456',
      name: 'Test Artist',
    },
    venue: {
      id: 'venue-789',
      name: 'Test Venue',
    },
    festival: null,
  };

  // Helper function for rendering with Router
  const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  it('renders concert details correctly', () => {
    renderWithRouter(<PerformanceCard performance={defaultPerformance} />);
    
    // Check artist name
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    
    // Check venue name
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
    
    // Check icons
    expect(screen.getByTestId('icon-clock')).toBeInTheDocument();
    expect(screen.getByTestId('icon-map-pin')).toBeInTheDocument();
    expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument();
    
    // Check time formatting (mocked)
    expect(formatTime).toHaveBeenCalledWith(defaultPerformance.startTime);
    expect(formatTime).toHaveBeenCalledWith(defaultPerformance.endTime);
    expect(screen.getByText('8:00 PM')).toBeInTheDocument();
    
    // Date should not show by default
    expect(screen.queryByTestId('icon-calendar')).not.toBeInTheDocument();
  });

  it('shows date when showDate prop is true', () => {
    renderWithRouter(<PerformanceCard performance={defaultPerformance} showDate />);
    
    // Calendar icon should be visible
    expect(screen.getByTestId('icon-calendar')).toBeInTheDocument();
    
    // Check date formatting (mocked)
    expect(formatDate).toHaveBeenCalledWith(defaultPerformance.startTime);
    expect(screen.getByText('May 1, 2025')).toBeInTheDocument();
  });

  it('displays festival badge when performance is part of a festival', () => {
    const performanceWithFestival = {
      ...defaultPerformance,
      festival: {
        id: 'festival-123',
        name: 'Summer Festival',
      },
    };
    
    renderWithRouter(<PerformanceCard performance={performanceWithFestival} />);
    
    // Festival badge should be visible
    expect(screen.getByText('Summer Festival')).toBeInTheDocument();
  });

  it('renders time correctly when no end time is provided', () => {
    const performanceWithoutEndTime = {
      ...defaultPerformance,
      endTime: null,
    };
    
    renderWithRouter(<PerformanceCard performance={performanceWithoutEndTime} />);
    
    // Should only call formatTime once for the start time
    expect(formatTime).toHaveBeenCalledTimes(1);
    expect(formatTime).toHaveBeenCalledWith(performanceWithoutEndTime.startTime);
  });

  it('links to the correct concert detail page', () => {
    renderWithRouter(<PerformanceCard performance={defaultPerformance} />);
    
    // Should link to the concert detail page
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/concerts/${defaultPerformance.id}`);
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-card-class';
    renderWithRouter(<PerformanceCard performance={defaultPerformance} className={customClass} />);
    
    // Card should have the custom class
    const card = screen.getByText('Test Artist').closest('.w-full');
    expect(card).toHaveClass(customClass);
  });

  it('has touch-friendly layout for mobile', () => {
    renderWithRouter(<PerformanceCard performance={defaultPerformance} />);
    
    // Card should have proper padding for touch targets
    const card = screen.getByText('Test Artist').closest('.w-full');
    expect(card).toHaveClass('p-md');
    
    // Check for mobile-friendly layout with icons and text
    const timeIcon = screen.getByTestId('icon-clock');
    expect(timeIcon).toHaveClass('mr-xs');
    
    const venueIcon = screen.getByTestId('icon-map-pin');
    expect(venueIcon).toHaveClass('mr-xs');
  });

  it('has accessible link with proper focus styling', () => {
    renderWithRouter(<PerformanceCard performance={defaultPerformance} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:outline-none');
    expect(link).toHaveClass('focus:ring-2');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithRouter(<PerformanceCard performance={defaultPerformance} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
