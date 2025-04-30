import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import PerformanceList from '../components/organisms/PerformanceList';
import Tabs from '../components/molecules/Tabs';
import { formatDateRange, getValidDateString, groupPerformancesByDate } from '../utils/dateUtils';
import useFestivals from '../hooks/useFestivals';
import useConcerts from '../hooks/useConcerts';

const FestivalDetailPage = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [allConcerts, setAllConcerts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [venueFilter, setVenueFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const { getFestivalById } = useFestivals();
  const { getConcertsByFestival, loading: concertsLoading } = useConcerts();

  const tabs = [
    { id: 'all', label: 'Performances', icon: 'list' },
    { id: 'info', label: 'Festival Info', icon: 'info' },
  ];

  const sanitizeDescription = useCallback(text => {
    if (!text) return '';
    return text.replace(/&#8203;:contentReference\[oaicite:\d+\]\[index=\d+\]&#8203;/g, '');
  }, []);

  const getDateOptions = useCallback(() => {
    if (!festival?.start_date || !festival?.end_date) return [];

    const dates = [];
    const currentDate = new Date(festival.start_date);
    const end = new Date(festival.end_date);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, [festival]);

  // eslint-disable-next-line no-unused-vars
  const uniqueVenues = useMemo(() => {
    const venueMap = new Map();

    if (allConcerts.length > 0) {
      allConcerts.forEach(concert => {
        const venue = concert.venue || concert.venues;
        if (venue?.id && venue?.name) {
          venueMap.set(venue.id, venue);
        }
      });
    }

    return Array.from(venueMap.values());
  }, [allConcerts]);

  const groupedConcerts = useMemo(() => {
    return groupPerformancesByDate(allConcerts);
  }, [allConcerts]);

  const sortedConcertDates = useMemo(() => {
    return Object.keys(groupedConcerts).sort();
  }, [groupedConcerts]);

  // eslint-disable-next-line no-unused-vars
  const festivalDates = useMemo(() => getDateOptions(), [getDateOptions]);

  // eslint-disable-next-line no-unused-vars
  const getDayNumber = useCallback(
    dateStr => {
      if (!festival?.start_date || !dateStr) return '';

      const startDate = new Date(festival.start_date);
      const currentDate = new Date(`${dateStr}T00:00:00`);

      startDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      const diffTime = currentDate.getTime() - startDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      return `Day ${diffDays + 1}`;
    },
    [festival]
  );

  // eslint-disable-next-line no-unused-vars
  const handleDateSelect = useCallback(date => {
    const dateStr = getValidDateString(date);
    setActiveDate(dateStr);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleResetFilters = useCallback(() => {
    setVenueFilter('all');
    setTimeFilter('all');
  }, []);

  useEffect(() => {
    const fetchFestivalDetails = async () => {
      try {
        setLoading(true);
        const festivalData = await getFestivalById(id);
        setFestival(festivalData);

        if (festivalData.start_date) {
          const initialDate = getValidDateString(festivalData.start_date);
          setActiveDate(initialDate);
        }

        const concertData = await getConcertsByFestival(id, { limit: 200 });
        setAllConcerts(concertData);
      } catch (err) {
        console.error('Error fetching festival details:', err);
        setError(err.message || 'Failed to load festival details');
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalDetails();
  }, [id, getFestivalById, getConcertsByFestival]);

  useEffect(() => {
    if (activeDate && allConcerts.length > 0) {
      const dateFiltered = allConcerts.filter(concert => {
        const concertDate = getValidDateString(concert.start_time);
        return concertDate === activeDate;
      });

      let filtered = dateFiltered;
      if (venueFilter !== 'all') {
        filtered = filtered.filter(concert => {
          const venue = concert.venue || concert.venues;
          return venue?.id === venueFilter;
        });
      }

      if (timeFilter !== 'all') {
        filtered = filtered.filter(concert => {
          const timeStr = concert.start_time || concert.startTime;
          let hours = null;

          if (typeof timeStr === 'string') {
            const match = timeStr.match(/T(\d{2}):/);
            hours = match ? parseInt(match[1], 10) : new Date(timeStr).getHours();
          } else if (timeStr instanceof Date) {
            hours = timeStr.getHours();
          }

          if (hours == null) return true;
          if (timeFilter === 'morning') return hours >= 6 && hours < 12;
          if (timeFilter === 'afternoon') return hours >= 12 && hours < 17;
          if (timeFilter === 'evening') return hours >= 17 && hours < 20;
          if (timeFilter === 'night') return hours >= 20 || hours < 6;

          return true;
        });
      }

      setFilteredConcerts(filtered);
    }
  }, [activeDate, allConcerts, venueFilter, timeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error || !festival) {
    return (
      <DetailPageLayout title="Festival Not Found" imageUrl="/images/placeholder-festival.jpg">
        <Typography variant="body1" color="error">
          {error || 'Could not find the requested festival.'}
        </Typography>
        <Button variant="primary" className="mt-lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </DetailPageLayout>
    );
  }

  const dateRange = formatDateRange(festival.start_date, festival.end_date);
  const today = new Date();
  const startDate = new Date(festival.start_date);
  const endDate = new Date(festival.end_date);

  let statusBadge;
  if (today >= startDate && today <= endDate) {
    statusBadge = <Badge text="Happening Now" variant="success" />;
  } else if (today < startDate) {
    statusBadge = <Badge text="Upcoming" variant="info" />;
  } else {
    statusBadge = <Badge text="Past Event" variant="outline" />;
  }

  return (
    <DetailPageLayout
      title={festival.name}
      subtitle={dateRange}
      imageUrl={festival.image_url || '/images/placeholder-festival.jpg'}
    >
      <div className="mb-md flex items-center flex-wrap">
        {statusBadge}
        {festival.park && (
          <div className="ml-xs flex items-center">
            <Icon name="map-pin" size="sm" className="mr-xxs text-medium-gray" />
            <Typography variant="body2" className="text-medium-gray">
              {festival.park.name}
            </Typography>
          </div>
        )}
      </div>

      <div className="mb-lg">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" />
      </div>

      {activeTab === 'all' && (
        <div className="pb-24">
          <Typography variant="h3" className="mb-md">
            Full Festival Lineup
          </Typography>
          {sortedConcertDates.length > 0 ? (
            <PerformanceList
              performances={allConcerts}
              groupByDate={true}
              loading={concertsLoading}
              emptyMessage="No performances scheduled for this festival"
              useArtistCard={false}
            />
          ) : (
            <div className="text-center p-6 bg-background-secondary rounded-lg">
              <Icon name="calendar-x" size="lg" className="mb-sm text-medium-gray mx-auto" />
              <Typography variant="body1" color="medium-gray">
                No performances have been announced yet
              </Typography>
            </div>
          )}
        </div>
      )}

      {activeTab === 'info' && (
        <div className="pb-24">
          <Typography variant="h3" className="mb-md">
            Festival Information
          </Typography>
          {festival.description ? (
            <Typography variant="body1" className="mb-lg">
              {sanitizeDescription(festival.description)}
            </Typography>
          ) : (
            <Typography variant="body1" color="medium-gray" className="mb-lg">
              No detailed information available for this festival.
            </Typography>
          )}

          {festival.park && (
            <div className="mb-lg">
              <Typography variant="h4" className="mb-sm">
                Location
              </Typography>
              <div className="flex items-start mb-md">
                <Icon name="map-pin" size="md" className="mr-sm text-sunset-orange mt-xxs" />
                <div>
                  <Typography variant="body1" className="font-semibold">
                    {festival.park.name}
                  </Typography>
                  {festival.park.description && (
                    <Typography variant="body2" className="mt-xxs">
                      {festival.park.description}
                    </Typography>
                  )}
                </div>
              </div>
              <Link to={`/parks/${festival.park.id}`} className="block">
                <Button variant="outline" fullWidth className="flex items-center justify-center">
                  <Icon name="map" size="sm" className="mr-xs" />
                  View Park Details
                </Button>
              </Link>
            </div>
          )}

          <div className="mb-lg">
            <Typography variant="h4" className="mb-sm">
              Festival Dates
            </Typography>
            <div className="flex items-start mb-md">
              <Icon name="calendar" size="md" className="mr-sm text-sunset-orange mt-xxs" />
              <Typography variant="body1">{dateRange}</Typography>
            </div>
          </div>
        </div>
      )}
    </DetailPageLayout>
  );
};

export default FestivalDetailPage;
