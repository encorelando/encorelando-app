import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Spinner from '../atoms/Spinner';

/**
 * StaticMapImage component that uses a free static map image service
 * Mobile-optimized with fallback options
 */
const StaticMapImage = ({
  latitude,
  longitude,
  width = 400,
  height = 300,
  zoom = 16,
  className = '',
  venueTitle = '',
  locationDetails = '',
}) => {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [imageRetries, setImageRetries] = useState(0);

  // Reset loading state when props change
  useEffect(() => {
    setLoading(true);
    setError(null);
    setImageRetries(0);
  }, [latitude, longitude]);

  // Validate coordinates
  const hasValidCoordinates = !!(latitude && longitude);

  // Handle image load event
  const handleImageLoad = () => {
    setLoading(false);
  };

  // Handle image error - try different services
  const handleImageError = () => {
    if (imageRetries < mapServices.length - 1) {
      setImageRetries(prev => prev + 1);
    } else {
      setLoading(false);
      setError('Could not load map image');
    }
  };

  // Multiple map services to try (free and no API key required)
  const mapServices = [
    // Geoapify with free API key - more reliable
    `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${zoom}&marker=lonlat:${longitude},${latitude};color:%23ff6a00;size:large&apiKey=fa4eff3fbf8e4d28ab12ce887d9a4ef4`,

    // Backup option - local rendering
    null,
  ];

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

  // When all map services fail, render a fallback UI
  if (imageRetries >= mapServices.length - 1) {
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

        {/* Fallback map-like UI */}
        <div className="rounded-lg overflow-hidden mb-md">
          <div
            className="relative bg-off-white"
            style={{ height: height, width: '100%', maxWidth: width }}
          >
            {/* Simple location visualization */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 rounded-full border-2 border-sunset-orange opacity-30"></div>
              <div className="w-8 h-8 rounded-full bg-sunset-orange absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <Icon name="map-pin" size="sm" className="text-white" />
              </div>
            </div>

            {/* Coordinates display */}
            <div className="absolute bottom-3 left-3 bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-medium-gray">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>
          </div>

          {/* Get Directions button */}
          <a
            href={`https://maps.google.com/?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-3 bg-sunset-orange text-white transition-colors duration-300"
          >
            <Icon name="navigation" size="sm" className="mr-2" />
            <Typography variant="body1" color="white">
              Get Directions
            </Typography>
          </a>
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

      {/* Map container */}
      <div className="rounded-lg overflow-hidden mb-md">
        <div className="relative" style={{ height: height, width: '100%', maxWidth: width }}>
          {/* Loading spinner */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-light-gray z-10">
              <Spinner color="sunset-orange" size="md" />
            </div>
          )}

          {/* The actual map image */}
          <img
            src={mapServices[imageRetries]}
            alt={`Map showing location of ${venueTitle || 'venue'}`}
            className="rounded-t-lg object-cover w-full h-full"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>

        {/* Get Directions button */}
        <a
          href={`https://maps.google.com/?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center py-3 bg-sunset-orange text-white transition-colors duration-300"
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

StaticMapImage.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  zoom: PropTypes.number,
  className: PropTypes.string,
  venueTitle: PropTypes.string,
  locationDetails: PropTypes.string,
};

export default StaticMapImage;
