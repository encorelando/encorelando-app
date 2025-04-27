import React from 'react';
import PropTypes from 'prop-types';
import PerformanceCard from './PerformanceCard';
import Spinner from '../atoms/Spinner';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import { formatDate, getRelativeDate, groupPerformancesByDate } from '../../utils/dateUtils';

/**
 * PerformanceList component for displaying a list of performances
 * Mobile-optimized with date grouping and loading states
 */
const PerformanceList = ({
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
        <Icon name="alert" size="lg" color="error" />
        <Typography variant="body1" color="error" className="mt-md">
          {error}
        </Typography>
      </div>
    );
  }

  // Render empty state
  if (!performances.length) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center">
        <Icon name="info" size="lg" color="medium-gray" />
        <Typography variant="body1" color="medium-gray" className="mt-md">
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
            {/* Date header */}
            <div className="sticky top-0 z-10 bg-white border-b border-light-gray py-sm px-md shadow-sm mb-md">
              <Typography variant="h3">
                {getRelativeDate(dateStr)}
              </Typography>
              <Typography variant="body2" color="medium-gray">
                {formatDate(dateStr)}
              </Typography>
            </div>

            {/* Performances for this date */}
            <div className="space-y-md">
              {performancesByDate[dateStr].map(performance => (
                <PerformanceCard
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
        <PerformanceCard
          key={performance.id}
          performance={performance}
          showDate={true}
        />
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

PerformanceList.propTypes = {
  performances: PropTypes.arrayOf(performanceShape).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  groupByDate: PropTypes.bool,
  className: PropTypes.string,
  emptyMessage: PropTypes.string,
};

export default PerformanceList;