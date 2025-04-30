import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import ImageThumbnail from '../molecules/ImageThumbnail';
import { formatTime, formatDate } from '../../utils/dateUtils';

/**
 * PerformanceCard component with the new EncoreLando branding
 * Mobile-optimized with touch-friendly design on dark background
 * Now includes artist image similar to VenuePerformanceCard
 */
const PerformanceCard = ({ performance, showDate = false, featured = false, className = '' }) => {
  // Log received performance data for debugging
  console.log('[PerformanceCard] Received performance data:', performance);

  if (!performance) {
    console.log('[PerformanceCard] No performance data provided');
    return null;
  }

  // Handle both camelCase and snake_case property names for compatibility
  const id = performance.id;

  // The data might come in different structures or have null values that we need to handle
  // We'll do deep inspection of the data structure to ensure we extract what we need

  // Extract artist data from either artist or artists fields, handling null values
  let artist = {};
  if (performance.artist && typeof performance.artist === 'object') {
    artist = performance.artist;
  } else if (performance.artists && typeof performance.artists === 'object') {
    artist = performance.artists;
  } else if (performance.artist_id) {
    // If we only have an artist ID, create a minimal artist object
    artist = { id: performance.artist_id };
  }

  // Extract venue data from either venue or venues fields, handling null values
  let venue = {};
  if (performance.venue && typeof performance.venue === 'object') {
    venue = performance.venue;
  } else if (performance.venues && typeof performance.venues === 'object') {
    venue = performance.venues;
  } else if (performance.venue_id) {
    // If we only have a venue ID, create a minimal venue object
    venue = { id: performance.venue_id };
  }

  // Extract festival data from either festival or festivals fields, handling null values
  let festival = {};
  if (performance.festival && typeof performance.festival === 'object') {
    festival = performance.festival;
  } else if (performance.festivals && typeof performance.festivals === 'object') {
    festival = performance.festivals;
  } else if (performance.festival_id) {
    // If we only have a festival ID, create a minimal festival object
    festival = { id: performance.festival_id };
  }

  console.log('[PerformanceCard] Normalized data:');
  console.log('- artist:', artist ? JSON.stringify(artist) : 'null');
  console.log('- venue:', venue ? JSON.stringify(venue) : 'null');
  console.log('- festival:', festival ? JSON.stringify(festival) : 'null');

  // Handle both naming conventions for time fields
  const startTime = performance.startTime || performance.start_time;
  const endTime = performance.endTime || performance.end_time;

  // Format date and time with proper formatting for mobile display
  const formattedTime = startTime
    ? `${formatTime(startTime)}${endTime ? ` - ${formatTime(endTime)}` : ''}`
    : 'TBA';

  // Format the date of the performance
  const formattedDate = startTime ? formatDate(startTime) : 'Date TBD';

  // Check if we have a valid artist name
  const artistName = artist?.name || 'TBA';

  // Check if we have a valid venue name
  const venueName = venue?.name || 'Location TBD';

  // Check if we have a park name from any of the possible paths
  const parkName =
    venue?.parks?.name ||
    venue?.park?.name ||
    performance.themePark ||
    performance.theme_park ||
    '';

  return (
    <Link
      to={`/concerts/${id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
    >
      <Card variant="interactive" featured={featured} className={`w-full ${className}`}>
        <div className="flex items-center">
          {/* Artist image */}
          {artist?.image_url && (
            <div className="mr-sm flex-shrink-0 self-center">
              <ImageThumbnail
                src={artist.image_url}
                alt={artistName}
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
              {artistName}
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

            {/* Venue */}
            <div className="flex items-center mb-xs">
              <Icon name="map-pin" size="sm" className="mr-xs text-sunset-orange flex-shrink-0" />
              <Typography variant="body1" color="white" className="truncate">
                {venueName}
              </Typography>
            </div>

            {/* Theme Park - if available from venues.parks */}
            {parkName && (
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
  startTime: PropTypes.string,
  start_time: PropTypes.string,
  endTime: PropTypes.string,
  end_time: PropTypes.string,
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
      startTime: PropTypes.string,
      start_time: PropTypes.string,
      endTime: PropTypes.string,
      end_time: PropTypes.string,
    })
  ),
});

PerformanceCard.propTypes = {
  performance: performanceShape.isRequired,
  showDate: PropTypes.bool,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default PerformanceCard;
