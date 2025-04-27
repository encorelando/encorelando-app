import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import { formatTime, formatDate } from '../../utils/dateUtils';

/**
 * PerformanceCard component for displaying concert details
 * Mobile-optimized with touch-friendly design
 */
const PerformanceCard = ({ 
  performance,
  showDate = false,
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
    <Link to={`/concerts/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary rounded">
      <Card 
        variant="interactive" 
        className={`w-full p-md ${className}`}
      >
        {/* Artist name */}
        <Typography variant="h3" className="mb-xs text-primary">
          {artist?.name}
        </Typography>
        
        {/* Date - only shown if requested */}
        {showDate && (
          <div className="flex items-center mb-xs text-medium-gray">
            <Icon name="calendar" size="sm" className="mr-xs" />
            <Typography variant="body2">
              {formatDate(startTime)}
            </Typography>
          </div>
        )}
        
        {/* Time */}
        <div className="flex items-center mb-xs text-dark-gray">
          <Icon name="clock" size="sm" className="mr-xs text-medium-gray" />
          <Typography variant="body1">
            {formattedTime}
          </Typography>
        </div>
        
        {/* Venue */}
        <div className="flex items-center mb-sm text-dark-gray">
          <Icon name="map-pin" size="sm" className="mr-xs text-medium-gray" />
          <Typography variant="body1">
            {venue?.name}
          </Typography>
        </div>
        
        {/* Festival badge - if part of a festival */}
        {festival && (
          <div className="mt-xs">
            <Badge 
              text={festival.name}
              variant="primary"
              className="mr-xs"
            />
          </div>
        )}
        
        {/* Chevron for indicating interaction */}
        <div className="absolute right-md top-1/2 transform -translate-y-1/2 text-medium-gray">
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
  className: PropTypes.string,
};

export default PerformanceCard;