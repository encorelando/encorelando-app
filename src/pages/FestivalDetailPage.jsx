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

/**
 * FestivalDetailPage component for festival details and lineup
 * Mobile-optimized with day-by-day breakdown of performances
 * Designed specifically for touch interaction and smaller screens
 */
const FestivalDetailPage = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [allConcerts, setAllConcerts] = useState([]);
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [venueFilter, setVenueFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Use custom hooks
  const { getFestivalById } = useFestivals();
  const { getConcertsByFestival, loading: concertsLoading } = useConcerts();

  // Define tabs for mobile interface
  const tabs = [
    //{ id: 'daily', label: 'Day by Day', icon: 'calendar' },
    { id: 'all', label: 'Performances', icon: 'list' },
    { id: 'info', label: 'Festival Info', icon: 'info' },
  ];

  // Function to sanitize description text by removing content reference tags
  const sanitizeDescription = useCallback(text => {
    if (!text) return '';
    // Remove content reference tags
    return text.replace(/&#8203;:contentReference\[oaicite:\d+\]\[index=\d+\]&#8203;/g, '');
  }, []);

  // Generate date options for the festival - moved to useCallback to use in useMemo
  const getDateOptions = useCallback(() => {
    if (!festival || !festival.start_date || !festival.end_date) return [];

    const dates = [];
    const currentDate = new Date(festival.start_date);
    const end = new Date(festival.end_date);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, [festival]);

  // Get unique venues from all concerts for filtering
  const uniqueVenues = useMemo(() => {
    const venueMap = new Map();

    if (allConcerts && allConcerts.length > 0) {
      allConcerts.forEach(concert => {
        const venue = concert.venue || concert.venues;
        if (venue && venue.id && venue.name) {
          venueMap.set(venue.id, venue);
        }
      });
    }

    return Array.from(venueMap.values());
  }, [allConcerts]);

  // Group performances by date for all concerts view
  const groupedConcerts = useMemo(() => {
    return groupPerformancesByDate(allConcerts);
  }, [allConcerts]);

  // Get sorted dates for display
  const sortedConcertDates = useMemo(() => {
    return Object.keys(groupedConcerts).sort();
  }, [groupedConcerts]);

  // Get festival dates array
  const festivalDates = useMemo(() => getDateOptions(), [getDateOptions]);

  // Format the day name (e.g., "Day 1", "Day 2")
  const getDayNumber = useCallback(
    dateStr => {
      if (!festival || !festival.start_date || !dateStr) return '';

      const startDate = new Date(festival.start_date);
      const currentDate = new Date(dateStr);

      // Reset time components to ensure accurate day calculation
      startDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = currentDate.getTime() - startDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      return `Day ${diffDays + 1}`;
    },
    [festival]
  );

  // Handle date selection
  const handleDateSelect = useCallback(date => {
    const dateStr = getValidDateString(date);
    setActiveDate(dateStr);
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setVenueFilter('all');
    setTimeFilter('all');
  }, []);

  // Fetch festival details and all performances
  useEffect(() => {
    const fetchFestivalDetails = async () => {
      try {
        setLoading(true);
        const festivalData = await getFestivalById(id);
        setFestival(festivalData);

        // Set active date to start date by default
        let initialDate = null;
        if (festivalData.start_date) {
          initialDate = getValidDateString(festivalData.start_date);
          setActiveDate(initialDate);
        }

        // Fetch all festival concerts
        const concertData = await getConcertsByFestival(id, {
          limit: 200, // Get a larger number to have all performances
        });

        // Store all concerts
        setAllConcerts(concertData);

        // Initially filter performances by the first date
        if (concertData.length > 0 && initialDate) {
          const initialFiltered = concertData.filter(concert => {
            const concertDate = getValidDateString(concert.start_time);
            return concertDate === initialDate;
          });
          setFilteredConcerts(initialFiltered);
        }
      } catch (err) {
        console.error('Error fetching festival details:', err);
        setError(err.message || 'Failed to load festival details');
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalDetails();
  }, [id, getFestivalById, getConcertsByFestival]);

  // Effect to filter concerts when date changes
  useEffect(() => {
    if (activeDate && allConcerts.length > 0) {
      // Filter concerts by active date
      const dateFiltered = allConcerts.filter(concert => {
        return getValidDateString(concert.start_time) === activeDate;
      });

      // Apply venue filter if set
      let filtered = dateFiltered;
      if (venueFilter !== 'all') {
        filtered = filtered.filter(concert => {
          const venue = concert.venue || concert.venues;
          return venue && venue.id === venueFilter;
        });
      }

      // Apply time filter if set
      if (timeFilter !== 'all') {
        filtered = filtered.filter(concert => {
          const startTime = new Date(concert.start_time || concert.startTime);
          const hours = startTime.getHours();

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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Show error state
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

  // Format date range
  const dateRange = formatDateRange(festival.start_date, festival.end_date);

  // Determine festival status
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
      {/* Status badge */}
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

      {/* Mobile Tab Navigation */}
      <div className="mb-lg">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" />
      </div>

      {/* Day by Day Tab Content */}
      {activeTab === 'daily' && (
        <>
          {/* Date selector - horizontal scrollable on mobile */}
          <div className="mb-md">
            <Typography variant="h3" className="mb-sm">
              Festival Schedule
            </Typography>
            <div className="flex overflow-x-auto scrollbar-thin scrollbar-track-transparent pb-sm whitespace-nowrap">
              {festivalDates.map((date, index) => (
                <Button
                  key={index}
                  variant={activeDate === getValidDateString(date) ? 'primary' : 'outline'}
                  className="mr-xs min-w-[120px] min-h-touch flex flex-col items-center"
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="text-xs font-semibold mb-xxs">
                    {getDayNumber(getValidDateString(date))}
                  </span>
                  {date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Button>
              ))}
            </div>
          </div>

          {/* Filtering options - touch optimized */}
          <div className="mb-md bg-background-secondary p-sm rounded-lg">
            <div className="flex items-center justify-between mb-sm">
              <Typography variant="h4">Filters</Typography>
              <Button
                variant="text"
                className="text-sunset-orange text-sm"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </div>

            {/* Venue filter */}
            {uniqueVenues.length > 1 && (
              <div className="mb-sm">
                <Typography variant="body2" className="mb-xxs">
                  Venue
                </Typography>
                <div className="flex overflow-x-auto scrollbar-thin pb-xs">
                  <Button
                    variant={venueFilter === 'all' ? 'primary' : 'outline'}
                    className="mr-xs min-w-[80px] min-h-touch"
                    onClick={() => setVenueFilter('all')}
                  >
                    All
                  </Button>
                  {uniqueVenues.map(venue => (
                    <Button
                      key={venue.id}
                      variant={venueFilter === venue.id ? 'primary' : 'outline'}
                      className="mr-xs min-w-[120px] min-h-touch truncate"
                      onClick={() => setVenueFilter(venue.id)}
                    >
                      {venue.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Time of day filter */}
            <div>
              <Typography variant="body2" className="mb-xxs">
                Time of Day
              </Typography>
              <div className="flex overflow-x-auto scrollbar-thin pb-xs">
                <Button
                  variant={timeFilter === 'all' ? 'primary' : 'outline'}
                  className="mr-xs min-w-[60px] min-h-touch"
                  onClick={() => setTimeFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={timeFilter === 'morning' ? 'primary' : 'outline'}
                  className="mr-xs min-w-[90px] min-h-touch"
                  onClick={() => setTimeFilter('morning')}
                >
                  <Icon name="sunrise" size="sm" className="mr-xxs" />
                  Morning
                </Button>
                <Button
                  variant={timeFilter === 'afternoon' ? 'primary' : 'outline'}
                  className="mr-xs min-w-[90px] min-h-touch"
                  onClick={() => setTimeFilter('afternoon')}
                >
                  <Icon name="sun" size="sm" className="mr-xxs" />
                  Afternoon
                </Button>
                <Button
                  variant={timeFilter === 'evening' ? 'primary' : 'outline'}
                  className="mr-xs min-w-[90px] min-h-touch"
                  onClick={() => setTimeFilter('evening')}
                >
                  <Icon name="sunset" size="sm" className="mr-xxs" />
                  Evening
                </Button>
                <Button
                  variant={timeFilter === 'night' ? 'primary' : 'outline'}
                  className="mr-xs min-w-[90px] min-h-touch"
                  onClick={() => setTimeFilter('night')}
                >
                  <Icon name="moon" size="sm" className="mr-xxs" />
                  Night
                </Button>
              </div>
            </div>
          </div>

          {/* Show selected day schedule */}
          <div className="pb-24">
            <div className="flex items-center justify-between mb-sm">
              <Typography variant="h4">
                {new Date(activeDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              <Badge text={getDayNumber(activeDate)} variant="info" />
            </div>

            <PerformanceList
              performances={filteredConcerts}
              loading={concertsLoading}
              emptyMessage="No performances match your filters"
            />
          </div>
        </>
      )}

      {/* All Performances Tab Content */}
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

      {/* Festival Info Tab Content */}
      {activeTab === 'info' && (
        <div className="pb-24">
          <Typography variant="h3" className="mb-md">
            Festival Information
          </Typography>

          {/* Festival description */}
          {festival.description ? (
            <div className="mb-lg">
              <Typography variant="body1">{sanitizeDescription(festival.description)}</Typography>
            </div>
          ) : (
            <div className="mb-lg">
              <Typography variant="body1" color="medium-gray">
                No detailed information available for this festival.
              </Typography>
            </div>
          )}

          {/* Location info */}
          {festival.park && (
            <div className="mb-lg">
              <Typography variant="h4" className="mb-sm">
                Location
              </Typography>
              <div className="flex items-start mb-md">
                <Icon
                  name="map-pin"
                  size="md"
                  className="mr-sm text-sunset-orange mt-xxs flex-shrink-0"
                />
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

              {/* Park link */}
              <Link to={`/parks/${festival.park.id}`} className="block">
                <Button variant="outline" fullWidth className="flex items-center justify-center">
                  <Icon name="map" size="sm" className="mr-xs" />
                  View Park Details
                </Button>
              </Link>
            </div>
          )}

          {/* Dates info */}
          <div className="mb-lg">
            <Typography variant="h4" className="mb-sm">
              Festival Dates
            </Typography>
            <div className="flex items-start mb-md">
              <Icon
                name="calendar"
                size="md"
                className="mr-sm text-sunset-orange mt-xxs flex-shrink-0"
              />
              <div>
                <Typography variant="body1" className="font-semibold">
                  {dateRange}
                </Typography>
                <Typography variant="body2" className="mt-xxs">
                  {festivalDates.length} {festivalDates.length === 1 ? 'day' : 'days'} of
                  performances
                </Typography>
              </div>
            </div>
          </div>

          {/* Website link */}
          {festival.website_url && (
            <Button
              variant="outline"
              fullWidth
              className="mb-lg flex items-center justify-center"
              onClick={() => window.open(festival.website_url, '_blank')}
            >
              <Icon name="external-link" size="sm" className="mr-xs" />
              Visit Official Festival Website
            </Button>
          )}
        </div>
      )}
    </DetailPageLayout>
  );
};

export default FestivalDetailPage;
