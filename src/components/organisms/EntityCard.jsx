import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import Icon from '../atoms/Icon';
import ImageThumbnail from '../molecules/ImageThumbnail';
import { formatDateRange } from '../../utils/dateUtils';

/**
 * Unified EntityCard component that can display Artist, Festival, or Venue entities
 * Mobile-optimized with dark theme styling
 *
 * @param {Object} entity - The entity data (artist, festival, or venue)
 * @param {string} type - The type of entity ('artist', 'festival', 'venue')
 * @param {boolean} featured - Whether this is a featured card
 * @param {string} className - Additional CSS classes
 */
const EntityCard = ({ entity, type, featured = false, className = '' }) => {
  if (!entity || !entity.id) {
    return null;
  }

  // Determine entity-specific information and routing
  const getEntityConfig = () => {
    switch (type) {
      case 'artist':
        return {
          route: `/artists/${entity.id}`,
          imageSrc: entity.image_url || '/images/artist-placeholder.jpg',
          imageAspectRatio: '4:3',
          defaultPlaceholder: '/images/artist-placeholder.jpg',
          showGenres: true,
          showUpcomingPerformances: true,
        };
      case 'festival':
        return {
          route: `/festivals/${entity.id}`,
          imageSrc: entity.image_url || '/images/festival-placeholder.jpg',
          imageAspectRatio: '16:9',
          defaultPlaceholder: '/images/festival-placeholder.jpg',
          showDateRange: true,
          showPerformancesCount: true,
          showLocation: true,
        };
      case 'venue':
        return {
          route: `/venues/${entity.id}`,
          imageSrc: entity.image_url || '/images/venue-placeholder.jpg',
          imageAspectRatio: '16:9',
          defaultPlaceholder: '/images/venue-placeholder.jpg',
          showPark: true,
          showCapacity: true,
          showPerformancesCount: true,
        };
      default:
        return {
          route: '#',
          imageSrc: null,
          imageAspectRatio: '1:1',
        };
    }
  };

  const config = getEntityConfig();

  // Determine status badge for festivals
  const getStatusBadge = () => {
    if (type !== 'festival' || !entity.start_date || !entity.end_date) return null;

    const now = new Date();
    const startDate = new Date(entity.start_date);
    const endDate = new Date(entity.end_date);

    if (now >= startDate && now <= endDate) {
      return <Badge text="Now On" variant="accent" gradient={featured} />;
    } else if (now < startDate) {
      return <Badge text="Upcoming" variant="secondary" gradient={featured} />;
    } else {
      return <Badge text="Completed" variant="outline" />;
    }
  };

  return (
    <Link
      to={config.route}
      className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
    >
      <Card
        variant="interactive"
        featured={featured}
        className={`w-full overflow-hidden ${className}`}
        padding={false}
      >
        {/* Entity Image */}
        {config.imageSrc && (
          <div className="relative">
            <ImageThumbnail
              src={config.imageSrc}
              alt={entity.name}
              aspectRatio={config.imageAspectRatio}
              rounded="none"
              grayscale={type === 'artist'}
              className={type === 'artist' ? 'brightness-70 contrast-130' : ''}
            />

            {/* Status Badge for Festivals */}
            {type === 'festival' && (
              <div className="absolute top-2 right-2 rounded-full px-2 py-1 bg-black bg-opacity-50 backdrop-blur-sm z-10">
                {getStatusBadge()}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-md">
          {/* Entity Name with updated styling */}
          <Typography
            variant="h3"
            color={featured ? 'primary' : 'white'}
            gradient={featured}
            className="mb-xs mt-2"
          >
            {entity.name}
          </Typography>

          {/* Artist-specific: Genres */}
          {type === 'artist' && entity.genres && entity.genres.length > 0 && config.showGenres && (
            <div className="flex flex-wrap gap-xs mb-sm">
              {entity.genres.slice(0, 3).map((genre, index) => (
                <Badge
                  key={genre}
                  text={genre}
                  variant={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'outline'}
                  size="sm"
                />
              ))}
              {entity.genres.length > 3 && (
                <Typography variant="caption" color="medium-gray" className="self-center">
                  +{entity.genres.length - 3} more
                </Typography>
              )}
            </div>
          )}

          {/* Festival-specific: Date Range */}
          {type === 'festival' && entity.start_date && entity.end_date && config.showDateRange && (
            <div className="flex items-center mb-xs">
              <Icon name="calendar" size="sm" className="mr-xs text-white text-opacity-70" />
              <Typography variant="body2" color="white">
                {formatDateRange(entity.start_date, entity.end_date)}
              </Typography>
            </div>
          )}

          {/* Venue-specific: Capacity */}
          {type === 'venue' && entity.capacity && config.showCapacity && (
            <div className="flex items-center mb-xs">
              <Icon name="users" size="sm" className="mr-xs text-white text-opacity-70" />
              <Typography variant="body2" color="white">
                Capacity: {entity.capacity.toLocaleString()}
              </Typography>
            </div>
          )}

          {/* Park/Location */}
          {config.showPark && entity.park && (
            <div className="flex items-center mb-sm">
              <Icon name="map" size="sm" className="mr-xs text-sunset-orange" />
              <Typography variant="body2" color="white">
                {entity.park.name}
              </Typography>
            </div>
          )}

          {/* Upcoming Performances Count */}
          {(config.showUpcomingPerformances || config.showPerformancesCount) &&
            (typeof entity.upcoming_performances_count !== 'undefined' ||
              typeof entity.performances_count !== 'undefined') && (
              <div className="flex items-center mt-xs">
                <Icon
                  name={type === 'artist' ? 'calendar' : 'music'}
                  size="sm"
                  className="mr-xs text-sunset-orange"
                />
                <Typography variant="body2" color="white">
                  {type === 'artist'
                    ? `${entity.upcoming_performances_count} upcoming ${
                        entity.upcoming_performances_count === 1 ? 'performance' : 'performances'
                      }`
                    : `${entity.performances_count} ${
                        entity.performances_count === 1 ? 'performance' : 'performances'
                      }`}
                </Typography>
              </div>
            )}
        </div>

        {/* Chevron for navigation - updated styling */}
        <div className="absolute right-md top-md bg-sunset-orange text-white rounded-full p-xxs shadow-md">
          <Icon name="chevron-right" size="sm" />
        </div>
      </Card>
    </Link>
  );
};

// Define entity shapes
const artistShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string,
  genres: PropTypes.arrayOf(PropTypes.string),
  upcoming_performances_count: PropTypes.number,
});

const festivalShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  park: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  performances_count: PropTypes.number,
  is_active: PropTypes.bool,
});

const venueShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string,
  capacity: PropTypes.number,
  park: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  performances_count: PropTypes.number,
});

EntityCard.propTypes = {
  entity: PropTypes.oneOfType([artistShape, festivalShape, venueShape]).isRequired,
  type: PropTypes.oneOf(['artist', 'festival', 'venue']).isRequired,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default EntityCard;
