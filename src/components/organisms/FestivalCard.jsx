import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import ImageThumbnail from '../molecules/ImageThumbnail';
import Badge from '../atoms/Badge';
import { formatDateRange } from '../../utils/dateUtils';

/**
 * FestivalCard component with the new EncoreLando branding
 * Mobile-optimized with dark theme styling
 */
const FestivalCard = ({ festival, featured = false, className = '' }) => {
  const { id, name, image_url, start_date, end_date, park, performances_count } = festival;

  // Format date range for display
  const dateRange = formatDateRange(start_date, end_date);

  // Determine status badge with updated styling
  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

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
      to={`/festivals/${id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
    >
      <Card
        variant="interactive"
        featured={featured}
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

          {/* Status Badge (positioned in the top-right of the image) */}
          <div className="absolute top-2 right-2 rounded-full px-2 py-1 bg-black bg-opacity-50 backdrop-blur-sm z-10">
            {getStatusBadge()}
          </div>
        </div>

        {/* Content */}
        <div className="p-md">
          {/* Festival Name with updated styling */}
          <Typography
            variant="h3"
            color={featured ? 'primary' : 'white'}
            gradient={featured}
            className="mb-xs mt-2"
          >
            {name}
          </Typography>

          {/* Date Range with updated styling for dark theme */}
          <div className="flex items-center mb-xs">
            <Icon name="calendar" size="sm" className="mr-xs text-white text-opacity-70" />
            <Typography variant="body2" color="white">
              {dateRange}
            </Typography>
          </div>

          {/* Park/Location with updated styling for dark theme */}
          {park && (
            <div className="flex items-center mb-sm">
              <Icon name="map" size="sm" className="mr-xs text-sunset-orange" />
              <Typography variant="body2" color="white">
                {park.name}
              </Typography>
            </div>
          )}

          {/* Performances Count with updated styling for dark theme */}
          {typeof performances_count !== 'undefined' && (
            <div className="flex items-center mt-xs">
              <Icon name="music" size="sm" className="mr-xs text-sunset-orange" />
              <Typography variant="body2" color="white">
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
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default FestivalCard;
