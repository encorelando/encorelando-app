import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';

/**
 * MapFallback component for displaying when maps can't be loaded
 * Provides a simple visual representation of a location
 */
const MapFallback = ({
  venueTitle,
  height = 300,
  width = 400,
  className = '',
  showCoordinates = false,
  latitude,
  longitude,
}) => {
  return (
    <div
      className={`bg-off-white rounded-lg relative overflow-hidden ${className}`}
      style={{ height, width: '100%', maxWidth: width }}
    >
      {/* Grid lines for map-like background */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className="border border-secondary-light border-opacity-30"></div>
        ))}
      </div>

      {/* Location pin in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full border-2 border-sunset-orange opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 rounded-full bg-sunset-orange"></div>
        </div>
        <div className="absolute -translate-x-1/2 transform top-0 left-1/2">
          <div className="w-1 h-6 bg-sunset-orange"></div>
          <div className="w-6 h-6 bg-sunset-orange rounded-full flex items-center justify-center -mt-3">
            <Icon name="map-pin" size="sm" className="text-white" />
          </div>
        </div>
      </div>

      {/* Venue title */}
      {venueTitle && (
        <div className="absolute bottom-3 left-3 right-3 bg-white bg-opacity-70 p-2 rounded shadow-sm">
          <Typography variant="body2" className="text-dark-gray text-center">
            {venueTitle}
          </Typography>
        </div>
      )}

      {/* Coordinates (optional) */}
      {showCoordinates && latitude && longitude && (
        <div className="absolute top-3 left-3 bg-white bg-opacity-70 px-2 py-1 rounded text-xs text-medium-gray">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      )}

      {/* Map attribution */}
      <div className="absolute bottom-1 right-1 text-xs text-medium-gray bg-white bg-opacity-50 px-1 rounded">
        Map data
      </div>
    </div>
  );
};

MapFallback.propTypes = {
  venueTitle: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  className: PropTypes.string,
  showCoordinates: PropTypes.bool,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
};

export default MapFallback;
