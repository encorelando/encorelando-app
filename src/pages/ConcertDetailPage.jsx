import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import Icon from '../components/atoms/Icon';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import FavoriteButton from '../components/molecules/FavoriteButton';
import ShareButton from '../components/molecules/ShareButton';
import AddToCalendarButton from '../components/molecules/AddToCalendarButton';
import { formatDate, formatTime } from '../utils/dateUtils';
import { generateEventFromConcert } from '../utils/calendarUtils';
import useConcerts from '../hooks/useConcerts';

/**
 * ConcertDetailPage component for concert details
 * Mobile-optimized with date, venue, and artist information
 */
const ConcertDetailPage = () => {
  const { id } = useParams();
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarEvent, setCalendarEvent] = useState(null);

  // Use custom hook
  const { getConcertById } = useConcerts();

  // Fetch concert details
  useEffect(() => {
    const fetchConcertDetails = async () => {
      try {
        setLoading(true);
        const concertData = await getConcertById(id);
        setConcert(concertData);

        // Generate calendar event data
        const concertUrl = `https://encorelando.com/concerts/${id}`;
        const eventData = generateEventFromConcert(concertData, concertUrl);
        setCalendarEvent(eventData);
      } catch (err) {
        console.error('Error fetching concert details:', err);
        setError(err.message || 'Failed to load concert details');
      } finally {
        setLoading(false);
      }
    };

    fetchConcertDetails();
  }, [id, getConcertById]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Show error state
  if (error || !concert) {
    return (
      <DetailPageLayout title="Concert Not Found" imageUrl="/images/placeholder-concert.jpg">
        <Typography variant="body1" color="error">
          {error || 'Could not find the requested concert.'}
        </Typography>
        <Button variant="primary" className="mt-lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </DetailPageLayout>
    );
  }

  // Check if required nested objects exist
  // First look for the singular fields (artist, venue) that should be provided
  // by the updated API, but fall back to the plural fields (artists, venues) if needed
  const artistData = concert.artist || concert.artists;
  const venueData = concert.venue || concert.venues;

  if (!artistData || !venueData) {
    console.error('Missing data in concert:', concert);
    return (
      <DetailPageLayout title="Concert Data Error" imageUrl="/images/placeholder-concert.jpg">
        <Typography variant="body1" color="error">
          The concert data is incomplete. Missing artist or venue information.
        </Typography>
        <Button variant="primary" className="mt-lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </DetailPageLayout>
    );
  }

  // Assign the data to constants for use in the component
  const artist = artistData;
  const venue = venueData;
  const festival = concert.festival || concert.festivals;

  // Get remaining data from concert
  const { start_time, end_time, notes } = concert;

  // Format date and time
  const formattedDate = formatDate(start_time);
  const timeRange = `${formatTime(start_time)}${end_time ? ` - ${formatTime(end_time)}` : ''}`;

  // Check if concert has already occurred
  // Account for timezone differences and add a buffer period
  const currentTime = new Date();
  const concertStartTime = new Date(start_time);
  const concertEndTime = end_time
    ? new Date(end_time)
    : new Date(concertStartTime.getTime() + 90 * 60 * 1000); // Default to 90 min if no end time

  // Add a 2-hour buffer to account for timezone issues
  // This ensures a concert isn't marked as "past" during the performance time
  const bufferTimeMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const isPast = concertEndTime.getTime() + bufferTimeMs < currentTime.getTime();

  // Create action buttons for the header
  const actionButtons = (
    <>
      {/* Favorite button */}
      <FavoriteButton
        entityType="concert"
        entityId={id}
        size="sm"
        className="text-white bg-black bg-opacity-20 hover:bg-opacity-30"
      />

      {/* Share button */}
      <ShareButton
        title={`${artist.name} at ${venue.name}`}
        text={`Check out ${artist.name} at ${venue.name} on ${formattedDate} at ${formatTime(
          start_time
        )}`}
        url={`/concerts/${id}`}
        size="sm"
        className="text-white bg-black bg-opacity-20 hover:bg-opacity-30"
      />

      {/* Add to calendar button - Only show for appropriate events */}
      {calendarEvent &&
        (!isPast ||
          new Date().getTime() - new Date(end_time || start_time).getTime() <
            24 * 60 * 60 * 1000) && (
          <AddToCalendarButton
            event={calendarEvent}
            size="sm"
            className="text-white bg-black bg-opacity-20 hover:bg-opacity-30"
          />
        )}
    </>
  );

  return (
    <DetailPageLayout
      title={artist.name}
      subtitle="" // Remove the venue name from the header to prevent overlap
      imageUrl={artist.image_url || '/images/placeholder-concert.jpg'}
      actions={actionButtons}
    >
      {/* Status badge */}
      <div className="mb-md">
        {isPast ? (
          <Badge text="Past Event" variant="outline" />
        ) : (
          <Badge text="Upcoming Event" variant="primary" />
        )}

        {/* Festival badge */}
        {festival && <Badge text={festival.name} variant="secondary" className="ml-xs" />}
      </div>

      {/* Date and time */}
      <Card className="mb-lg p-md">
        <div className="flex items-center mb-sm">
          <Icon name="calendar" size="md" className="mr-sm text-primary" />
          <Typography variant="h3">{formattedDate}</Typography>
        </div>

        <div className="flex items-center">
          <Icon name="clock" size="md" className="mr-sm text-primary" />
          <Typography variant="h4">{timeRange}</Typography>
        </div>
      </Card>

      {/* Venue information */}
      <div className="mb-lg">
        <Typography variant="h3" className="mb-sm">
          Venue
        </Typography>
        <Link to={`/venues/${venue.id}`}>
          <Card variant="interactive" className="p-md">
            <Typography variant="h4" className="mb-xs">
              {venue.name}
            </Typography>

            {venue.location_details && (
              <Typography variant="body2" color="medium-gray" className="mb-xs">
                {venue.location_details}
              </Typography>
            )}

            {venue.park && (
              <div className="flex items-center mt-xs text-primary">
                <Icon name="map-pin" size="sm" className="mr-xs" />
                <Typography variant="body2" color="primary">
                  {venue.park.name}
                </Typography>
              </div>
            )}

            <div className="absolute right-md top-1/2 transform -translate-y-1/2">
              <Icon name="chevron-right" size="md" color="medium-gray" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Artist information */}
      <div className="mb-lg">
        <Typography variant="h3" className="mb-sm">
          Artist
        </Typography>
        <Link to={`/artists/${artist.id}`}>
          <Card variant="interactive" className="p-md">
            <Typography variant="h4" className="mb-xs">
              {artist.name}
            </Typography>

            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-xs mt-xs">
                {artist.genres.slice(0, 3).map(genre => (
                  <Badge key={genre} text={genre} variant="outline" size="sm" />
                ))}
                {artist.genres.length > 3 && (
                  <Typography variant="caption" color="medium-gray">
                    +{artist.genres.length - 3} more
                  </Typography>
                )}
              </div>
            )}

            <div className="absolute right-md top-1/2 transform -translate-y-1/2">
              <Icon name="chevron-right" size="md" color="medium-gray" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-lg">
          <Typography variant="h3" className="mb-sm">
            Performance Notes
          </Typography>
          <Card className="p-md">
            <Typography variant="body1">{notes}</Typography>
          </Card>
        </div>
      )}
    </DetailPageLayout>
  );
};

export default ConcertDetailPage;
