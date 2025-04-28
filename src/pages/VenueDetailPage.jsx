import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import PerformanceList from '../components/organisms/PerformanceList';
import Calendar from '../components/organisms/Calendar';
import useVenues from '../hooks/useVenues';
import useConcerts from '../hooks/useConcerts';

/**
 * VenueDetailPage component for venue information and schedule
 * Mobile-optimized with calendar and upcoming performances
 */
const VenueDetailPage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateHasConcerts, setDateHasConcerts] = useState([]);

  // Use custom hooks
  const { getVenueById } = useVenues();
  const { getConcertsByVenue, concerts, loading: concertsLoading } = useConcerts();

  // Fetch venue details
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const venueData = await getVenueById(id);
        setVenue(venueData);

        // Fetch upcoming concerts at this venue
        const concertData = await getConcertsByVenue(id);

        // Extract unique dates that have concerts
        const dates = concertData.map(
          concert => new Date(concert.start_time).toISOString().split('T')[0]
        );
        setDateHasConcerts([...new Set(dates)]);
      } catch (err) {
        console.error('Error fetching venue details:', err);
        setError(err.message || 'Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id, getVenueById, getConcertsByVenue]);

  // Fetch concerts for selected date
  useEffect(() => {
    if (venue) {
      const fetchConcertsForDate = async () => {
        // Create date at local midnight to ensure proper date boundaries
        const localDate = new Date(selectedDate);

        // Ensure we're working with the local date by resetting hours to midnight local time
        // and then formatting specifically to prevent timezone shifts
        localDate.setHours(0, 0, 0, 0);

        // Format as YYYY-MM-DD
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        await getConcertsByVenue(id, { date: formattedDate });
      };

      fetchConcertsForDate();
    }
  }, [selectedDate, id, venue, getConcertsByVenue]);

  // Handle date selection
  const handleDateSelect = date => {
    setSelectedDate(date);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Show error state
  if (error || !venue) {
    return (
      <DetailPageLayout title="Venue Not Found" imageUrl="/images/placeholder-venue.jpg">
        <Typography variant="body1" color="error">
          {error || 'Could not find the requested venue.'}
        </Typography>
        <Button variant="primary" className="mt-lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout
      title={venue.name}
      subtitle={venue.park?.name}
      imageUrl={venue.image_url || '/images/placeholder-venue.jpg'}
    >
      {/* Venue description */}
      {venue.description && (
        <div className="mb-lg">
          <Typography variant="body1">{venue.description}</Typography>
        </div>
      )}

      {/* Location details */}
      {venue.location_details && (
        <div className="mb-lg">
          <Typography variant="h4" className="mb-xs">
            Location
          </Typography>
          <div className="flex items-start">
            <Icon name="map-pin" size="md" className="mr-sm text-primary mt-xxs" />
            <Typography variant="body1">{venue.location_details}</Typography>
          </div>
        </div>
      )}

      {/* Park information */}
      {venue.park && (
        <div className="mb-lg">
          <Typography variant="h4" className="mb-sm">
            Theme Park
          </Typography>
          <Link to={`/parks/${venue.park.id}`} className="block">
            <Button variant="outline" fullWidth>
              View {venue.park.name}
            </Button>
          </Link>
        </div>
      )}

      {/* Calendar for selecting dates */}
      <div className="mb-lg">
        <Typography variant="h3" className="mb-md">
          Performances Calendar
        </Typography>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          highlightedDates={dateHasConcerts}
        />
      </div>

      {/* Performances for selected date */}
      <div className="mb-lg">
        <Typography variant="h3" className="mb-md">
          Performances on{' '}
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>

        <PerformanceList
          performances={concerts}
          loading={concertsLoading}
          emptyMessage="No performances scheduled for this date"
        />
      </div>
    </DetailPageLayout>
  );
};

export default VenueDetailPage;
