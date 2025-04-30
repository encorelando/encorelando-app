import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import ImageThumbnail from '../molecules/ImageThumbnail';
import { formatTime, formatDate } from '../../utils/dateUtils';

/**
 * VenuePerformanceCard component specifically for venue detail pages
 * Mobile-optimized with touch-friendly design, focuses on artist and time info
 * Omits venue information since we're already on the venue page
 */
const VenuePerformanceCard = ({
  performance,
  showDate = false,
  featured = false,
  className = '',
}) => {
  // Handle both camelCase and snake_case property names for compatibility
  const id = performance.id;
  const artist = performance.artist || performance.artists;
  const festival = performance.festival || performance.festivals;

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
      <Card variant="interactive" featured={featured} className={`w-full ${className}`}>
        <div className="flex items-center p-sm">
          {/* Artist image */}
          {artist?.image_url && (
            <div className="mr-sm flex-shrink-0 self-center">
              <ImageThumbnail
                src={artist.image_url}
                alt={artist?.name || 'Artist image'}
                aspectRatio="square"
                rounded="lg"
                className="w-16 h-16"
              />
            </div>
          )}

          <div className="flex-grow min-w-0 flex flex-col justify-center">
            {/* Artist name with new branding colors */}
            <Typography
              variant="h3"
              color={featured ? 'primary' : 'white'}
              gradient={featured}
              className="mb-xs truncate"
            >
              {artist?.name || 'TBA'}
            </Typography>

            {/* Date - only shown if requested */}
            {showDate && (
              <div className="flex items-center mb-xs">
                <Icon
                  name="calendar"
                  size="sm"
                  className="mr-xs text-sunset-orange flex-shrink-0"
                />
                <Typography variant="body2" color="white" className="text-opacity-70 truncate">
                  {formattedDate}
                </Typography>
              </div>
            )}

            {/* Time - handles both single and multiple performance times */}
            {performance.performanceTimes && performance.performanceTimes.length > 0 ? (
              // Multiple performance times
              performance.performanceTimes.map((timeSlot, index) => (
                <div key={timeSlot.id || index} className="flex items-center mb-xs">
                  <Icon name="clock" size="sm" className="mr-xs text-sunset-orange flex-shrink-0" />
                  <Typography variant="body1" color="white" className="truncate">
                    {formatTime(timeSlot.startTime || timeSlot.start_time)}
                    {timeSlot.endTime || timeSlot.end_time
                      ? ` - ${formatTime(timeSlot.endTime || timeSlot.end_time)}`
                      : ''}
                  </Typography>
                </div>
              ))
            ) : (
              // Single performance time
              <div className="flex items-center mb-xs">
                <Icon name="clock" size="sm" className="mr-xs text-sunset-orange flex-shrink-0" />
                <Typography variant="body1" color="white" className="truncate">
                  {formattedTime}
                </Typography>
              </div>
            )}

            {/* Festival badge - if part of a festival */}
            {festival && (
              <div className="mt-xs">
                <Badge
                  text={festival.name}
                  variant="primary"
                  gradient={featured}
                  className="mr-xs"
                />
              </div>
            )}
          </div>

          {/* Chevron for indicating interaction */}
          <div className="absolute right-sm top-1/2 transform -translate-y-1/2 text-white text-opacity-70">
            <Icon name="chevron-right" size="md" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

// Define shape of performance object
const performanceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  // Support both camelCase and snake_case property names for time fields
  startTime: PropTypes.string,
  start_time: PropTypes.string,
  endTime: PropTypes.string,
  end_time: PropTypes.string,
  // Support both camelCase and snake_case for entity fields
  artist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
  }),
  artists: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
  }),
  festival: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  festivals: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  // Performance times
  performanceTimes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      startTime: PropTypes.string,
      start_time: PropTypes.string,
      endTime: PropTypes.string,
      end_time: PropTypes.string,
    })
  ),
});

VenuePerformanceCard.propTypes = {
  performance: performanceShape.isRequired,
  showDate: PropTypes.bool,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default VenuePerformanceCard;
