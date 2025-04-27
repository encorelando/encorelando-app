import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import ImageThumbnail from '../molecules/ImageThumbnail';
import Badge from '../atoms/Badge';
import { formatDateRange } from '../../utils/dateUtils';

/**
 * FestivalCard component for displaying festival information
 * Mobile-optimized with appropriate sizing and touch targets
 */
const FestivalCard = ({
  festival,
  className = '',
}) => {
  const {
    id,
    name,
    image_url,
    start_date,
    end_date,
    park,
    performances_count,
    is_active,
  } = festival;

  // Format date range for display
  const dateRange = formatDateRange(start_date, end_date);
  
  // Determine status badge
  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (now >= startDate && now <= endDate) {
      return <Badge text="Now On" variant="success" />;
    } else if (now < startDate) {
      return <Badge text="Upcoming" variant="info" />;
    } else {
      return <Badge text="Completed" variant="outline" />;
    }
  };

  return (
    <Link to={`/festivals/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary rounded">
      <Card 
        variant="interactive" 
        className={`w-full overflow-hidden ${className}`}
      >
        {/* Festival Image */}
        <div className="relative">
          <ImageThumbnail
            src={image_url || '/images/festival-placeholder.jpg'}
            alt={name}
            aspectRatio="16:9"
            rounded="none"
          />
          
          {/* Status Badge (positioned on the image) */}
          <div className="absolute top-md right-md">
            {getStatusBadge()}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-md">
          {/* Festival Name */}
          <Typography variant="h3" className="mb-xs">
            {name}
          </Typography>
          
          {/* Date Range */}
          <div className="flex items-center mb-xs text-dark-gray">
            <Icon name="calendar" size="sm" className="mr-xs text-medium-gray" />
            <Typography variant="body2">
              {dateRange}
            </Typography>
          </div>
          
          {/* Park/Location */}
          {park && (
            <div className="flex items-center mb-sm text-dark-gray">
              <Icon name="map-pin" size="sm" className="mr-xs text-medium-gray" />
              <Typography variant="body2">
                {park.name}
              </Typography>
            </div>
          )}
          
          {/* Performances Count */}
          {typeof performances_count !== 'undefined' && (
            <div className="flex items-center mt-xs text-primary">
              <Icon name="music" size="sm" className="mr-xs" />
              <Typography variant="body2">
                {performances_count} {performances_count === 1 ? 'performance' : 'performances'}
              </Typography>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

// Define festival shape
const festivalShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  park: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  performances_count: PropTypes.number,
  is_active: PropTypes.bool,
});

FestivalCard.propTypes = {
  festival: festivalShape.isRequired,
  className: PropTypes.string,
};

export default FestivalCard;