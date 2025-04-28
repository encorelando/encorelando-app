import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import { formatTime, formatDate } from '../../utils/dateUtils';

/**
 * PerformanceCard component with the new EncoreLando branding
 * Mobile-optimized with touch-friendly design on dark background
 */
const PerformanceCard = ({ 
  performance,
  showDate = false,
  featured = false,
  className = '',
}) => {
  const { 
    id, 
    artist,
    venue,
    festival,
    startTime, 
    endTime, 
  } = performance;
  
  // Format date and time with proper formatting for mobile display
  const formattedTime = `${formatTime(startTime)}${endTime ? ` - ${formatTime(endTime)}` : ''}`;

  return (
    <Link to={`/concerts/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded">
      <Card 
        variant="interactive" 
        featured={featured}
        className={`w-full p-md ${className}`}
      >
        {/* Artist name with new branding colors */}
        <Typography variant="h3" color="primary" className="mb-xs">
          {artist?.name}
        </Typography>
        
        {/* Date - only shown if requested */}
        {showDate && (
          <div className="flex items-center mb-xs">
            <Icon name="calendar" size="sm" className="mr-xs text-white text-opacity-70" />
            <Typography variant="body2" color="medium-gray">
              {formatDate(startTime)}
            </Typography>
          </div>
        )}
        
        {/* Time */}
        <div className="flex items-center mb-xs">
          <Icon name="clock" size="sm" className="mr-xs text-white text-opacity-70" />
          <Typography variant="body1" color="white">
            {formattedTime}
          </Typography>
        </div>
        
        {/* Venue */}
        <div className="flex items-center mb-sm">
          <Icon name="map-pin" size="sm" className="mr-xs text-white text-opacity-70" />
          <Typography variant="body1" color="white">
            {venue?.name}
          </Typography>
        </div>
        
        {/* Festival badge - if part of a festival */}
        {festival && (
          <div className="mt-xs">
            <Badge 
              text={festival.name}
              variant={featured ? 'gradient' : 'primary'}
              gradient={featured}
              className="mr-xs"
            />
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
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string,
  artist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  venue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  festival: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
});

PerformanceCard.propTypes = {
  performance: performanceShape.isRequired,
  showDate: PropTypes.bool,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default PerformanceCard;