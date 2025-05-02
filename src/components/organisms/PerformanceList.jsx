import PropTypes from 'prop-types';
import PerformanceCard from './PerformanceCard';
import Spinner from '../atoms/Spinner';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import {
  getRelativeDate,
  groupPerformancesByDate,
  groupArtistPerformancesByDateAndVenue,
} from '../../utils/dateUtils';

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
  useArtistCard = false,
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
    // Use different grouping logic based on whether we're on an artist page
    const performancesByDate = useArtistCard
      ? groupArtistPerformancesByDateAndVenue(performances)
      : groupPerformancesByDate(performances);

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
              {performancesByDate[dateStr].map(performance => {
                // Add debugging to see what we're passing to the PerformanceCard
                console.log('PerformanceList rendering:', {
                  performanceId: performance.id,
                  hasArtist: Boolean(performance.artist),
                  hasArtists: Boolean(performance.artists),
                  artistImageUrl: performance.artist?.image_url,
                  artistsImageUrl: performance.artists?.image_url,
                });

                // Ensure both artist and artists properties are defined for compatibility
                const enhancedPerformance = {
                  ...performance,
                  artist: performance.artist || {
                    id: performance.artists?.id,
                    name: performance.artists?.name,
                    image_url: performance.artists?.image_url,
                  },
                  artists: performance.artists || {
                    id: performance.artist?.id,
                    name: performance.artist?.name,
                    image_url: performance.artist?.image_url,
                  },
                };

                return useArtistCard ? (
                  <PerformanceCard
                    key={performance.id}
                    performance={enhancedPerformance}
                    showDate={false}
                    context="artist"
                  />
                ) : (
                  <PerformanceCard
                    key={performance.id}
                    performance={enhancedPerformance}
                    showDate={false}
                  />
                );
              })}
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
      {performances.map(performance => {
        // Add debugging to see what we're passing to the PerformanceCard
        console.log('PerformanceList rendering (non-grouped):', {
          performanceId: performance.id,
          hasArtist: Boolean(performance.artist),
          hasArtists: Boolean(performance.artists),
          artistImageUrl: performance.artist?.image_url,
          artistsImageUrl: performance.artists?.image_url,
        });

        // Ensure both artist and artists properties are defined for compatibility
        const enhancedPerformance = {
          ...performance,
          artist: performance.artist || {
            id: performance.artists?.id,
            name: performance.artists?.name,
            image_url: performance.artists?.image_url,
          },
          artists: performance.artists || {
            id: performance.artist?.id,
            name: performance.artist?.name,
            image_url: performance.artist?.image_url,
          },
        };

        return useArtistCard ? (
          <PerformanceCard
            key={performance.id}
            performance={enhancedPerformance}
            showDate={true}
            context="artist"
          />
        ) : (
          <PerformanceCard key={performance.id} performance={enhancedPerformance} showDate={true} />
        );
      })}

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
  venue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  venues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
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

PerformanceList.propTypes = {
  performances: PropTypes.arrayOf(performanceShape).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  groupByDate: PropTypes.bool,
  className: PropTypes.string,
  emptyMessage: PropTypes.string,
  useArtistCard: PropTypes.bool,
};

export default PerformanceList;
