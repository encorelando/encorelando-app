import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import Icon from '../atoms/Icon';

/**
 * ArtistCard component with the new EncoreLando branding
 * Mobile-optimized with dark theme styling
 */
const ArtistCard = ({ artist, className = '', showUpcomingCount = true, featured = false }) => {
  const { id, name, image_url, genres, upcoming_performances_count } = artist;

  return (
    <Link
      to={`/artists/${id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
    >
      <Card
        variant="interactive"
        featured={featured}
        className={`w-full overflow-hidden ${className}`}
      >
        {/* Artist Image with grayscale effect for consistency */}
        <div className="w-full relative" style={{ paddingBottom: '75%' }}>
          {' '}
          {/* 4:3 aspect ratio */}
          <img
            src={image_url || '/images/artist-placeholder.jpg'}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'grayscale(100%) brightness(0.7) contrast(1.3)',
              WebkitFilter: 'grayscale(100%) brightness(0.7) contrast(1.3)',
            }}
          />
        </div>

        {/* Content Area */}
        <div className="p-md">
          {/* Artist Name with new brand styling */}
          <Typography
            variant="h3"
            color={featured ? 'primary' : 'white'}
            gradient={featured}
            className="mb-xs"
          >
            {name}
          </Typography>

          {/* Genres with updated styling */}
          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-xs mb-sm">
              {genres.slice(0, 3).map((genre, index) => (
                <Badge
                  key={genre}
                  text={genre}
                  variant={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'outline'}
                  size="sm"
                />
              ))}
              {genres.length > 3 && (
                <Typography variant="caption" color="medium-gray" className="self-center">
                  +{genres.length - 3} more
                </Typography>
              )}
            </div>
          )}

          {/* Upcoming Performances Count with updated styling */}
          {showUpcomingCount && typeof upcoming_performances_count !== 'undefined' && (
            <div className="flex items-center mt-xs">
              <Icon name="calendar" size="sm" className="mr-xs text-sunset-orange" />
              <Typography variant="body2" color="white">
                {upcoming_performances_count} upcoming{' '}
                {upcoming_performances_count === 1 ? 'performance' : 'performances'}
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

// Define artist shape
const artistShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string,
  genres: PropTypes.arrayOf(PropTypes.string),
  upcoming_performances_count: PropTypes.number,
});

ArtistCard.propTypes = {
  artist: artistShape.isRequired,
  className: PropTypes.string,
  showUpcomingCount: PropTypes.bool,
  featured: PropTypes.bool,
};

export default ArtistCard;
