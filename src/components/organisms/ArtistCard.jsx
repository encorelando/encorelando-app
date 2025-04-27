import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Typography from '../atoms/Typography';
import ImageThumbnail from '../molecules/ImageThumbnail';
import Tag from '../atoms/Tag';
import Icon from '../atoms/Icon';

/**
 * ArtistCard component for displaying artist information
 * Mobile-optimized with appropriate sizing and touch targets
 */
const ArtistCard = ({
  artist,
  className = '',
  showUpcomingCount = true,
}) => {
  const {
    id,
    name,
    image_url,
    genres,
    upcoming_performances_count,
  } = artist;

  return (
    <Link to={`/artists/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary rounded">
      <Card 
        variant="interactive" 
        className={`w-full overflow-hidden ${className}`}
      >
        {/* Artist Image */}
        <ImageThumbnail
          src={image_url || '/images/artist-placeholder.jpg'}
          alt={name}
          aspectRatio="4:3"
          rounded="none"
        />
        
        {/* Content Area */}
        <div className="p-md">
          {/* Artist Name */}
          <Typography variant="h3" className="mb-xs">
            {name}
          </Typography>
          
          {/* Genres */}
          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-xs mb-sm">
              {genres.slice(0, 3).map((genre) => (
                <Tag 
                  key={genre} 
                  text={genre} 
                  color="secondary"
                />
              ))}
              {genres.length > 3 && (
                <Typography variant="caption" color="medium-gray" className="self-center">
                  +{genres.length - 3} more
                </Typography>
              )}
            </div>
          )}
          
          {/* Upcoming Performances Count */}
          {showUpcomingCount && typeof upcoming_performances_count !== 'undefined' && (
            <div className="flex items-center mt-xs text-primary">
              <Icon name="calendar" size="sm" className="mr-xs" />
              <Typography variant="body2">
                {upcoming_performances_count} upcoming {upcoming_performances_count === 1 ? 'performance' : 'performances'}
              </Typography>
            </div>
          )}
        </div>
        
        {/* Chevron for navigation */}
        <div className="absolute right-md top-md text-white bg-primary bg-opacity-70 rounded-full p-xxs">
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
};

export default ArtistCard;