import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import { formatTime, formatDate } from '../../utils/dateUtils';

/**
 * ArtistPerformanceCard component designed specifically for artist detail pages
 * Omits the artist name (since it's already known) and adds theme park info
 * Mobile-optimized with touch-friendly design on dark background
 */
const ArtistPerformanceCard = ({
  performance,
  showDate = false,
  featured = false,
  className = '',
}) => {
  // Safety check for performance object
  if (!performance || !performance.id) {
    console.error('Invalid performance object:', performance);
    return null; // Return null if performance is invalid
  }

  // Handle both camelCase and snake_case property names for compatibility
  const id = performance.id;
  const venue = performance.venue || performance.venues || {};
  const festival = performance.festival || performance.festivals;

  // Extract theme park info from various possible sources (with safe access)
  const themePark = performance.themePark || performance.theme_park || venue?.park?.name || '';

  // Get performance name/title from various possible sources (with safe access)
  const performanceName =
    performance.title ||
    performance.name ||
    performance.artist_name ||
    performance.artist?.name ||
    'Concert';

  // Handle both naming conventions for time fields
  const startTime = performance.startTime || performance.start_time;
  const endTime = performance.endTime || performance.end_time;

  // Format date and time with proper formatting for mobile display
  const formattedTime = startTime
    ? `${formatTime(startTime)}${endTime ? ` - ${formatTime(endTime)}` : ''}`
    : 'TBA';

  // Format the date of the performance
  const formattedDate = formatDate(startTime);

  return (
    <Link
      to={`/concerts/${id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
    >
      <Card variant="interactive" featured={featured} className={`w-full p-md ${className}`}>
        {/* Show performance name */}
        <Typography variant="h3" color="white" className="mb-xs">
          {performanceName}
        </Typography>

        {/* Date - only shown if requested */}
        {showDate && (
          <div className="flex items-center mb-xs">
            <Icon name="calendar" size="sm" className="mr-xs text-sunset-orange" />
            <Typography variant="body2" color="white" className="text-opacity-70">
              {formattedDate}
            </Typography>
          </div>
        )}

        {/* Time - handles both single and multiple performance times */}
        {performance.performanceTimes && performance.performanceTimes.length > 0 ? (
          // Multiple performance times
          performance.performanceTimes.map((timeSlot, index) => {
            if (!timeSlot) return null;

            const slotStart = timeSlot.startTime || timeSlot.start_time;
            const slotEnd = timeSlot.endTime || timeSlot.end_time;

            return (
              <div key={timeSlot.id || `time-${index}`} className="flex items-center mb-xs">
                <Icon name="clock" size="sm" className="mr-xs text-sunset-orange" />
                <Typography variant="body1" color="white">
                  {formatTime(slotStart)}
                  {slotEnd ? ` - ${formatTime(slotEnd)}` : ''}
                </Typography>
              </div>
            );
          })
        ) : (
          // Single performance time
          <div className="flex items-center mb-xs">
            <Icon name="clock" size="sm" className="mr-xs text-sunset-orange" />
            <Typography variant="body1" color="white">
              {formattedTime}
            </Typography>
          </div>
        )}

        {/* Venue */}
        <div className="flex items-center mb-xs">
          <Icon name="map-pin" size="sm" className="mr-xs text-sunset-orange" />
          <Typography variant="body1" color="white">
            {venue?.name || 'Location TBD'}
          </Typography>
        </div>

        {/* Theme Park - if available */}
        {themePark && (
          <div className="flex items-center mb-sm">
            <Icon name="map" size="sm" className="mr-xs text-sunset-orange" />
            <Typography variant="body1" color="white">
              {themePark}
            </Typography>
          </div>
        )}

        {/* Festival badge - if part of a festival */}
        {festival && (
          <div className="mt-xs">
            <Badge text={festival.name} variant="primary" gradient={featured} className="mr-xs" />
          </div>
        )}

        {/* Chevron for indicating interaction */}
        <div className="absolute right-md top-1/2 transform -translate-y-1/2 text-white text-opacity-70">
          <Icon name="chevron-right" size="md" />
        </div>
      </Card>
    </Link>
  );
};

// Define shape of performance object
const performanceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  // Support both camelCase and snake_case property names for time fields
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  start_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  end_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // Support title or name for the performance
  title: PropTypes.string,
  name: PropTypes.string,
  artist_name: PropTypes.string,
  // Support both camelCase and snake_case for entity fields
  artist: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  // Performance times array for consolidated performances
  performanceTimes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      start_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      end_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    })
  ),
  venue: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    park: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  venues: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  festival: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  festivals: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  // Theme park information
  themePark: PropTypes.string,
  theme_park: PropTypes.string,
});

ArtistPerformanceCard.propTypes = {
  performance: performanceShape.isRequired,
  showDate: PropTypes.bool,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default ArtistPerformanceCard;
