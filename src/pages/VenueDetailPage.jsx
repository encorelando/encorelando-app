import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import Tabs from '../components/molecules/Tabs';
import PerformanceList from '../components/organisms/PerformanceList';
import Calendar from '../components/organisms/Calendar';
import StaticMap from '../components/molecules/StaticMap';
import useVenues from '../hooks/useVenues';
import useConcerts from '../hooks/useConcerts';
import { groupPerformancesByDate } from '../utils/dateUtils';

/**
 * VenueDetailPage component for venue information and schedule
 * Mobile-optimized with calendar and upcoming performances
 * Enhanced with sections for upcoming performances and calendar view
 */
const VenueDetailPage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateHasConcerts, setDateHasConcerts] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);
  const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);

  // Use custom hooks
  const { getVenueById } = useVenues();
  const {
    getConcertsByVenue,
    concerts,
    loading: concertsLoading,
    getUpcomingConcerts,
  } = useConcerts();

  // Define tabs for mobile interface
  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: 'calendar' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar-days' },
  ];

  // Fetch venue details and upcoming concerts
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        setIsUpcomingLoading(true);

        const venueData = await getVenueById(id);
        setVenue(venueData);

        // Fetch upcoming concerts at this venue
        const concertData = await getConcertsByVenue(id);

        // Extract unique dates that have concerts for calendar
        const dates = concertData.map(
          concert => new Date(concert.start_time).toISOString().split('T')[0]
        );
        setDateHasConcerts([...new Set(dates)]);

        // Fetch specifically upcoming concerts for the upcoming tab
        const upcomingData = await getUpcomingConcerts({
          venueId: id,
          limit: 20, // Limit for initial load
        });

        setUpcomingConcerts(upcomingData);
      } catch (err) {
        console.error('Error fetching venue details:', err);
        setError(err.message || 'Failed to load venue details');
      } finally {
        setLoading(false);
        setIsUpcomingLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id, getVenueById, getConcertsByVenue, getUpcomingConcerts]);

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

  // Group upcoming concerts by date for better organization on mobile
  const groupedUpcomingConcerts = useMemo(() => {
    return groupPerformancesByDate(upcomingConcerts);
  }, [upcomingConcerts]);

  // Convert grouped concerts to sorted array for rendering
  const sortedUpcomingDates = useMemo(() => {
    return Object.keys(groupedUpcomingConcerts).sort();
  }, [groupedUpcomingConcerts]);

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
      {/* Venue status */}
      {venue.status && (
        <div className="mb-md">
          <Badge
            text={venue.status === 'open' ? 'Open' : 'Temporarily Closed'}
            variant={venue.status === 'open' ? 'success' : 'warning'}
          />
        </div>
      )}

      {/* Venue description */}
      {venue.description && (
        <div className="mb-lg">
          <Typography variant="body1">{venue.description}</Typography>
        </div>
      )}

      {/* Map and location details */}
      {(venue.location_details || venue.latitude || venue.longitude) && (
        <div className="mb-lg">
          <Typography variant="h3" className="mb-xs">
            Location
          </Typography>

          {/* Use map when coordinates are available */}
          {venue.latitude && venue.longitude ? (
            <div className="mb-sm">
              <StaticMap
                latitude={venue.latitude}
                longitude={venue.longitude}
                width={800}
                height={300}
                venueTitle={venue.name}
                locationDetails={
                  venue.location_details || `Within ${venue.park?.name || 'theme park'}`
                }
                className="w-full rounded-lg overflow-hidden"
              />

              {venue.location_details && (
                <div className="flex items-start mt-sm">
                  <Icon
                    name="map-pin"
                    size="md"
                    className="mr-sm text-sunset-orange mt-xxs flex-shrink-0"
                  />
                  <Typography variant="body1">{venue.location_details}</Typography>
                </div>
              )}

              {/* Get directions button optimized for mobile */}
              <a
                href={`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-sm"
              >
                <Button variant="outline" fullWidth className="flex items-center justify-center">
                  <Icon name="navigation" size="sm" className="mr-xs" />
                  Get Directions
                </Button>
              </a>
            </div>
          ) : (
            <div className="mb-sm">
              {venue.location_details && (
                <div className="flex items-start">
                  <Icon
                    name="map-pin"
                    size="md"
                    className="mr-sm text-sunset-orange mt-xxs flex-shrink-0"
                  />
                  <Typography variant="body1">{venue.location_details}</Typography>
                </div>
              )}

              <div className="text-center p-4 bg-light-gray rounded-lg mt-md">
                <Icon name="map-off" size="md" className="mb-sm text-medium-gray mx-auto" />
                <Typography variant="body2" color="medium-gray">
                  Map not available for this venue
                </Typography>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Park information */}
      {venue.park && (
        <div className="mb-lg">
          <Typography variant="h4" className="mb-sm">
            Theme Park
          </Typography>
          <Link to={`/parks/${venue.park.id}`} className="block">
            <Button variant="outline" fullWidth className="flex items-center justify-center">
              <Icon name="map" size="sm" className="mr-xs" />
              View {venue.park.name}
            </Button>
          </Link>
        </div>
      )}

      {/* Performances Section with Tabs - Mobile Optimized */}
      <div className="mb-lg">
        <Typography variant="h3" className="mb-md">
          Performances
        </Typography>

        {/* Mobile-optimized tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-md" />

        {/* Upcoming Performances Tab */}
        {activeTab === 'upcoming' && (
          <div className="pb-6">
            {isUpcomingLoading ? (
              <div className="flex flex-col items-center justify-center py-xl">
                <Spinner size="lg" />
                <Typography variant="body1" color="medium-gray" className="mt-md">
                  Loading upcoming performances...
                </Typography>
              </div>
            ) : sortedUpcomingDates.length > 0 ? (
              <div>
                {/* Show grouped performances by date for better mobile organization */}
                <PerformanceList
                  performances={upcomingConcerts}
                  groupByDate={true}
                  emptyMessage="No upcoming performances scheduled"
                />
              </div>
            ) : (
              <div className="text-center p-6 bg-background-secondary rounded-lg">
                <Icon name="calendar-x" size="lg" className="mb-sm text-medium-gray mx-auto" />
                <Typography variant="body1" color="medium-gray">
                  No upcoming performances scheduled at this venue
                </Typography>
              </div>
            )}
          </div>
        )}

        {/* Calendar View Tab */}
        {activeTab === 'calendar' && (
          <div>
            {/* Calendar for selecting dates - Mobile friendly */}
            <div className="mb-md">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                highlightedDates={dateHasConcerts}
              />
            </div>

            {/* Performances for selected date */}
            <div className="pb-6">
              <Typography variant="h4" className="mb-md">
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
          </div>
        )}
      </div>

      {/* Website link if available */}
      {venue.website_url && (
        <Button
          variant="outline"
          fullWidth
          className="mt-lg flex items-center justify-center"
          onClick={() => window.open(venue.website_url, '_blank')}
        >
          <Icon name="external-link" size="sm" className="mr-xs" />
          Visit Official Venue Website
        </Button>
      )}
    </DetailPageLayout>
  );
};

export default VenueDetailPage;
