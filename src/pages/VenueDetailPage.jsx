/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import Tabs from '../components/molecules/Tabs';
import VenuePerformanceList from '../components/organisms/VenuePerformanceList';
import Calendar from '../components/organisms/Calendar';
import StaticMap from '../components/molecules/StaticMap';
import useVenues from '../hooks/useVenues';
import useConcerts from '../hooks/useConcerts';
import { groupPerformancesByDate, getValidDateString } from '../utils/dateUtils';
import FavoriteButton from '../components/molecules/FavoriteButton';
import ShareButton from '../components/molecules/ShareButton';

const VenueDetailPage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);
  const [calendarConcerts, setCalendarConcerts] = useState([]);
  const [calendarEventCounts, setCalendarEventCounts] = useState([]);
  const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);

  const { getVenueById } = useVenues();
  const { getConcertsByVenue, concerts, loading: concertsLoading } = useConcerts();

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: 'calendar' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar-days' },
  ];

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        setIsUpcomingLoading(true);

        const venueData = await getVenueById(id);
        setVenue(venueData);

        // Fetch all concerts for event highlighting
        const allConcerts = await getConcertsByVenue(id);
        setCalendarConcerts(allConcerts);

        const grouped = groupPerformancesByDate(allConcerts);
        const counts = Object.entries(grouped).map(([date, perfs]) => ({
          date,
          count: perfs.length,
        }));
        setCalendarEventCounts(counts);

        const upcomingData = await getConcertsByVenue(id, {
          future: true,
          limit: 20,
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
  }, [id, getVenueById, getConcertsByVenue]);

  useEffect(() => {
    if (venue) {
      const fetchConcertsForDate = async () => {
        const formattedDate =
          getValidDateString(selectedDate) || new Date().toISOString().split('T')[0];
        await getConcertsByVenue(id, { date: formattedDate });
      };
      fetchConcertsForDate();
    }
  }, [selectedDate, id, venue, getConcertsByVenue]);

  const handleDateSelect = date => setSelectedDate(date);

  const groupedUpcomingConcerts = useMemo(
    () => groupPerformancesByDate(upcomingConcerts),
    [upcomingConcerts]
  );

  const sortedUpcomingDates = useMemo(
    () => Object.keys(groupedUpcomingConcerts).sort(),
    [groupedUpcomingConcerts]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

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

  // Create action buttons for the header
  const actionButtons = (
    <>
      {/* Favorite button */}
      <FavoriteButton
        entityType="venue"
        entityId={id}
        size="sm"
        className="text-white bg-black bg-opacity-20 hover:bg-opacity-30"
      />

      {/* Share button */}
      <ShareButton
        title={`${venue.name} | EncoreLando`}
        text={`Check out performances at ${venue.name}${
          venue.park ? ` in ${venue.park.name}` : ''
        } on EncoreLando!`}
        url={`/venues/${id}`}
        size="sm"
        className="text-white bg-black bg-opacity-20 hover:bg-opacity-30"
      />
    </>
  );

  return (
    <DetailPageLayout
      title={venue.name}
      subtitle={venue.park?.name}
      imageUrl={venue.image_url || '/images/placeholder-venue.jpg'}
      actions={actionButtons}
    >
      {venue.status && (
        <div className="mb-md">
          <Badge
            text={venue.status === 'open' ? 'Open' : 'Temporarily Closed'}
            variant={venue.status === 'open' ? 'success' : 'warning'}
          />
        </div>
      )}

      {venue.description && (
        <div className="mb-lg">
          <Typography variant="body1">{venue.description}</Typography>
        </div>
      )}

      {(venue.location_details || venue.latitude || venue.longitude) && (
        <div className="mb-lg">
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

      <div className="mb-lg">
        <Typography variant="h3" className="mb-md">
          Performances
        </Typography>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-md" />

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
              <VenuePerformanceList
                performances={upcomingConcerts}
                groupByDate={true}
                emptyMessage="No upcoming performances scheduled"
              />
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

        {activeTab === 'calendar' && (
          <div>
            <div className="mb-md">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                eventCounts={calendarEventCounts}
              />
            </div>
            <div className="pb-6">
              <Typography variant="h4" className="mb-md">
                {new Date(`${getValidDateString(selectedDate)}T12:00:00`).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </Typography>
              <VenuePerformanceList
                performances={concerts}
                loading={concertsLoading}
                emptyMessage="No performances scheduled for this date"
              />
            </div>
          </div>
        )}
      </div>

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
