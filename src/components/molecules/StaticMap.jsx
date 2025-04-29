import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Spinner from '../atoms/Spinner';
import MapFallback from './MapFallback';
import './StaticMap.css'; // Import the CSS for map styling

/**
 * StaticMap component for displaying venue locations
 * Mobile-optimized with reliable rendering using OpenStreetMap tile service directly
 */
const StaticMap = ({
  latitude,
  longitude,
  width = 400,
  height = 300,
  className = '',
  venueTitle = '',
  locationDetails = '',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainerRef = useRef(null);

  // Validate coordinates
  const hasValidCoordinates = !!(latitude && longitude);

  // Calculate map parameters
  const zoom = 17; // Good zoom level for venue details
  const apiKey = 'fa4eff3fbf8e4d28ab12ce887d9a4ef4';

  // Generate map URL
  const mapUrl = hasValidCoordinates
    ? `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${zoom}&apiKey=${apiKey}`
    : '';

  // Handle image load events
  const handleMapLoad = () => {
    setLoading(false);
  };

  const handleMapError = () => {
    setLoading(false);
    setError('Could not load map');
  };

  // Add window resize handler
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const updateMapWidth = () => {
      if (mapContainerRef.current) {
        // Could adjust map sizing based on container width if needed
      }
    };

    updateMapWidth();
    window.addEventListener('resize', updateMapWidth);

    return () => {
      window.removeEventListener('resize', updateMapWidth);
    };
  }, [mapContainerRef]);

  // Prevent rendering invalid maps
  if (!hasValidCoordinates) {
    return (
      <div
        className={`flex items-center justify-center bg-light-gray rounded-lg ${className}`}
        style={{ minHeight: height, width: '100%', maxWidth: width }}
      >
        <div className="text-center p-4">
          <Icon name="map-off" size="xl" className="mb-2 text-medium-gray mx-auto" />
          <Typography variant="body2" color="medium-gray">
            Map location not available
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Location header with icon */}
      <div className="mb-md">
        <Typography variant="h3" className="mb-xs">
          Location
        </Typography>
        <div className="flex items-center">
          <Icon name="map-pin" size="md" className="text-sunset-orange mr-sm" />
          <Typography variant="body1">{locationDetails}</Typography>
        </div>
      </div>

      {/* Map container with custom styling */}
      <div
        ref={mapContainerRef}
        className="rounded-lg overflow-hidden mb-md map-container"
        style={{ width: '100%' }}
      >
        <div className="relative" style={{ height: height, width: '100%' }}>
          {/* Loading state with fallback map */}
          {loading && (
            <div className="absolute inset-0 z-10">
              <MapFallback
                venueTitle={venueTitle}
                latitude={latitude}
                longitude={longitude}
                height={height}
                width="100%"
                showCoordinates={true}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                <Spinner color="sunset-orange" size="md" />
              </div>
            </div>
          )}

          {/* Error state with fallback map */}
          {error && (
            <div className="absolute inset-0 z-10">
              <MapFallback
                venueTitle={venueTitle}
                latitude={latitude}
                longitude={longitude}
                height={height}
                width="100%"
                showCoordinates={true}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
                <div className="flex items-center justify-center">
                  <Icon name="alert-triangle" size="sm" className="text-warning mr-2" />
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          {mapUrl && (
            <img
              src={mapUrl}
              alt={`Map showing location of ${venueTitle || 'venue'}`}
              className="w-full h-full object-cover rounded-t-lg"
              style={{ width: '100%', height: '100%' }}
              onLoad={handleMapLoad}
              onError={handleMapError}
            />
          )}

          {/* Custom marker overlay */}
          {!loading && !error && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="map-marker-pin">
                <div className="map-marker-dot"></div>
              </div>
            </div>
          )}

          {/* +/- Zoom controls to match the screenshot */}
          <div className="absolute left-2 top-2 bg-white rounded-md shadow-md">
            <button className="w-8 h-8 flex items-center justify-center border-b border-gray-200">
              <Icon name="plus" size="sm" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center">
              <Icon name="minus" size="sm" />
            </button>
          </div>
        </div>

        {/* Get Directions button with custom styling */}
        <a
          href={`https://maps.google.com/?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="directions-button"
        >
          <Icon name="navigation" size="sm" className="mr-2" />
          <Typography variant="body1" color="white">
            Get Directions
          </Typography>
        </a>
      </div>
    </div>
  );
};

StaticMap.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  venueTitle: PropTypes.string,
  locationDetails: PropTypes.string,
};

export default StaticMap;
