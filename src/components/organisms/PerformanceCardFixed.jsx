import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import { formatTime, formatDate } from '../../utils/dateUtils';

/**
 * Unified PerformanceCard component with context-aware display options
 * Mobile-optimized with touch-friendly design on dark background
 *
 * This component consolidates functionality from:
 * - PerformanceCard
 * - ArtistPerformanceCard
 * - VenuePerformanceCard
 *
 * @param {Object} performance - The performance data
 * @param {string} context - The context in which this card is displayed ('default', 'artist', 'venue')
 * @param {boolean} showDate - Whether to show the date
 * @param {boolean} featured - Whether this is a featured card
 * @param {string} className - Additional CSS classes
 */
const PerformanceCard = ({
  performance,
  context = 'default',
  showDate = false,
  featured = false,
  className = '',
}) => {
  if (!performance || !performance.id) {
    console.error('Invalid performance data:', performance);
    return null;
  }

  // Extract and normalize data based on different possible structures
  // Handle both camelCase and snake_case property names for compatibility
  const id = performance.id;

  // Extract artist data
  let artist = {};
  if (performance.artist && typeof performance.artist === 'object') {
    artist = performance.artist;
  } else if (performance.artists && typeof performance.artists === 'object') {
    artist = performance.artists;
  } else if (performance.artist_id) {
    artist = { id: performance.artist_id };
  }

  // Extract venue data
  let venue = {};
  if (performance.venue && typeof performance.venue === 'object') {
    venue = performance.venue;
  } else if (performance.venues && typeof performance.venues === 'object') {
    venue = performance.venues;
  } else if (performance.venue_id) {
    venue = { id: performance.venue_id };
  }

  // Extract festival data
  let festival = {};
  if (performance.festival && typeof performance.festival === 'object') {
    festival = performance.festival;
  } else if (performance.festivals && typeof performance.festivals === 'object') {
    festival = performance.festivals;
  } else if (performance.festival_id) {
    festival = { id: performance.festival_id };
  }

  // Handle both naming conventions for time fields
  const startTime = performance.startTime || performance.start_time;
  const endTime = performance.endTime || performance.end_time;

  // Format time
  const formattedTime = startTime
    ? `${formatTime(startTime)}${endTime ? ` - ${formatTime(endTime)}` : ''}`
    : 'TBA';

  // Format date
  const formattedDate = startTime ? formatDate(startTime) : 'Date TBD';

  // Get normalized field values
  const artistName = artist?.name || performance.artist_name || performance.name || 'TBA';
  const venueName = venue?.name || 'Location TBD';
  const parkName =
    venue?.parks?.name ||
    venue?.park?.name ||
    performance.themePark ||
    performance.theme_park ||
    '';

  // The title to display varies based on context
  const displayTitle =
    context === 'artist' ? venueName || 'Concert' : context === 'venue' ? artistName : artistName;

  // Get artist image URL with fallbacks
  const getArtistImageUrl = () => {
    // For debugging - log all potential image sources
    console.log('Image sources for artist:', {
      'artist.image_url': artist?.image_url,
      'performance.artist?.image_url': performance.artist?.image_url,
      'performance.artists?.image_url': performance.artists?.image_url,
      artistName,
    });

    // Return the first valid URL or fallback to placeholder
    return (
      artist?.image_url ||
      performance.artist?.image_url ||
      performance.artists?.image_url ||
      `/images/artist-placeholder.jpg`
    );
  };

  const artistImageUrl = getArtistImageUrl();

  return (
    <Link
      to={`/concerts/${id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
    >
      <Card variant="interactive" featured={featured} className={`w-full ${className}`}>
        <div className="flex items-center p-md">
          {/* Artist image - always show except in artist context */}
          {context !== 'artist' && (
            <div className="mr-sm flex-shrink-0 self-center">
              <img
                src={artistImageUrl}
                alt={artistName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex-grow min-w-0 flex flex-col justify-center">
            {/* Display title based on context */}
            <Typography
              variant="h3"
              color={featured ? 'primary' : 'white'}
              gradient={featured}
              className="mb-xs truncate"
            >
              {displayTitle}
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

            {/* Venue - show only if not in venue context and not in artist context */}
            {context === 'default' && (
              <div className="flex items-center mb-xs">
                <Icon name="map-pin" size="sm" className="mr-xs text-sunset-orange flex-shrink-0" />
                <Typography variant="body1" color="white" className="truncate">
                  {venueName}
                </Typography>
              </div>
            )}

            {/* Theme Park - show if available and not in venue context where it's already known */}
            {parkName && context !== 'venue' && (
              <div className="flex items-center mb-sm">
                <Icon name="map" size="sm" className="mr-xs text-sunset-orange flex-shrink-0" />
                <Typography variant="body1" color="white" className="truncate">
                  {parkName}
                </Typography>
              </div>
            )}

            {/* Festival badge - if part of a festival */}
            {festival && festival.name && (
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
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  start_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  end_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // Direct IDs
  artist_id: PropTypes.string,
  venue_id: PropTypes.string,
  festival_id: PropTypes.string,
  // Support both camelCase and snake_case for entity fields
  artist: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image_url: PropTypes.string,
  }),
  artist_name: PropTypes.string,
  name: PropTypes.string,
  artists: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image_url: PropTypes.string,
  }),
  venue: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    park: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    parks: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  venues: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    park: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    parks: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
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
  // Performance times
  performanceTimes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      start_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      end_time: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    })
  ),
});

PerformanceCard.propTypes = {
  performance: performanceShape.isRequired,
  context: PropTypes.oneOf(['default', 'artist', 'venue']),
  showDate: PropTypes.bool,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default PerformanceCard;
