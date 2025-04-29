import { render, screen, fireEvent } from '@testing-library/react';
import StaticMap from '../molecules/StaticMap';

describe('StaticMap Component', () => {
  const validProps = {
    latitude: 28.373058,
    longitude: -81.549795,
    width: 400,
    height: 250,
    venueTitle: 'America Gardens Theatre',
    locationDetails: 'Within EPCOT theme park (American Adventure Pavilion area)',
  };

  test('renders map iframe with valid coordinates', () => {
    render(<StaticMap {...validProps} />);

    // Check for the iframe
    const mapIframe = screen.getByTitle('Venue Location Map');
    expect(mapIframe).toBeInTheDocument();

    // Check that the src contains the coordinates
    expect(mapIframe.src).toContain(`marker=${validProps.latitude},${validProps.longitude}`);
  });

  test('shows location details', () => {
    render(<StaticMap {...validProps} />);

    // Check for location heading
    expect(screen.getByText('Location')).toBeInTheDocument();

    // Check for location details text
    expect(screen.getByText(validProps.locationDetails)).toBeInTheDocument();
  });

  test('creates a link to Google Maps with correct coordinates', () => {
    render(<StaticMap {...validProps} />);

    const directionsLink = screen.getByText('Get Directions').closest('a');
    expect(directionsLink).toHaveAttribute(
      'href',
      `https://maps.google.com/?q=${validProps.latitude},${validProps.longitude}`
    );
    expect(directionsLink).toHaveAttribute('target', '_blank');
  });

  test('displays fallback UI when coordinates are missing', () => {
    render(<StaticMap latitude={null} longitude={null} />);

    // Check for fallback message
    expect(screen.getByText('Map location not available')).toBeInTheDocument();

    // Map iframe should not be rendered
    expect(screen.queryByTitle('Venue Location Map')).not.toBeInTheDocument();
  });

  test('handles iframe load event', () => {
    render(<StaticMap {...validProps} />);

    const mapIframe = screen.getByTitle('Venue Location Map');

    // Simulate iframe load
    fireEvent.load(mapIframe);

    // Loading spinner should not be visible after load
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
