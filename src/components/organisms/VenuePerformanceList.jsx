import PropTypes from 'prop-types';
import VenuePerformanceCard from './VenuePerformanceCard';
import Spinner from '../atoms/Spinner';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import { getRelativeDate, groupPerformancesByDate } from '../../utils/dateUtils';

/**
 * VenuePerformanceList component for displaying performances at a specific venue
 * Mobile-optimized with date grouping and loading states
 * Omits venue information display since we're already on the venue page
 */
const VenuePerformanceList = ({
  performances,
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  groupByDate = false,
  className = '',
  emptyMessage = 'No performances found',
}) => {
  // Render loading spinner
  if (loading && !performances.length) {
    return (
      <div className="flex flex-col items-center justify-center py-xl">
        <Spinner size="lg" />
        <Typography variant="body1" color="medium-gray" className="mt-md">
          Loading performances...
        </Typography>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center">
        <Icon name="alert" size="lg" className="text-sunset-orange" />
        <Typography variant="body1" color="white" className="mt-md">
          {typeof error === 'string' ? error : 'Error loading performances. Please try again.'}
        </Typography>
      </div>
    );
  }

  // Render empty state
  if (!performances.length) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center">
        <Icon name="info" size="lg" className="text-white text-opacity-50" />
        <Typography variant="body1" color="white" className="text-opacity-70 mt-md">
          {emptyMessage}
        </Typography>
      </div>
    );
  }

  // If grouping by date
  if (groupByDate) {
    const performancesByDate = groupPerformancesByDate(performances);
    const sortedDates = Object.keys(performancesByDate).sort();

    return (
      <div className={className}>
        {sortedDates.map(dateStr => (
          <div key={dateStr} className="mb-lg">
            {/* Date header - show only one version of the date */}
            <div className="sticky top-0 z-10 bg-background border-b border-deep-orchid border-opacity-30 py-sm px-md shadow-sm mb-md">
              <Typography variant="h3">{getRelativeDate(dateStr)}</Typography>
            </div>

            {/* Performances for this date */}
            <div className="space-y-md">
              {performancesByDate[dateStr].map(performance => (
                <VenuePerformanceCard
                  key={performance.id}
                  performance={performance}
                  showDate={false}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mt-lg mb-md">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="flex items-center justify-center text-primary px-lg py-sm rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light min-h-touch"
            >
              {loading ? (
                <Spinner size="sm" color="primary" className="mr-xs" />
              ) : (
                <Icon name="plus" size="sm" className="mr-xs" />
              )}
              <Typography variant="button" color="primary">
                Load More
              </Typography>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Simple list without date grouping
  return (
    <div className={`space-y-md ${className}`}>
      {performances.map(performance => (
        <VenuePerformanceCard key={performance.id} performance={performance} showDate={true} />
      ))}

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center mt-lg mb-md">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center justify-center text-primary px-lg py-sm rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light min-h-touch"
          >
            {loading ? (
              <Spinner size="sm" color="primary" className="mr-xs" />
            ) : (
              <Icon name="plus" size="sm" className="mr-xs" />
            )}
            <Typography variant="button" color="primary">
              Load More
            </Typography>
          </button>
        </div>
      )}
    </div>
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
});

VenuePerformanceList.propTypes = {
  performances: PropTypes.arrayOf(performanceShape).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  groupByDate: PropTypes.bool,
  className: PropTypes.string,
  emptyMessage: PropTypes.string,
};

export default VenuePerformanceList;
