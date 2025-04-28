import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import PerformanceList from '../components/organisms/PerformanceList';
import { formatDateRange } from '../utils/dateUtils';
import useFestivals from '../hooks/useFestivals';
import useConcerts from '../hooks/useConcerts';

/**
 * FestivalDetailPage component for festival details and lineup
 * Mobile-optimized with date information and performances
 */
const FestivalDetailPage = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDate, setActiveDate] = useState(null);

  // Use custom hooks
  const { getFestivalById } = useFestivals();
  const { getConcertsByFestival, concerts, loading: concertsLoading } = useConcerts();

  // Fetch festival details
  useEffect(() => {
    const fetchFestivalDetails = async () => {
      try {
        setLoading(true);
        const festivalData = await getFestivalById(id);
        setFestival(festivalData);

        // Set active date to start date by default
        if (festivalData.start_date) {
          setActiveDate(festivalData.start_date);
        }

        // Fetch festival concerts
        await getConcertsByFestival(id);
      } catch (err) {
        console.error('Error fetching festival details:', err);
        setError(err.message || 'Failed to load festival details');
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalDetails();
  }, [id, getFestivalById, getConcertsByFestival]);

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

  // Generate date options for the festival
  const getDateOptions = () => {
    const dates = [];
    const currentDate = new Date(festival.start_date);
    const end = new Date(festival.end_date);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const festivalDates = getDateOptions();

  return (
    <DetailPageLayout
      title={festival.name}
      subtitle={dateRange}
      imageUrl={festival.image_url || '/images/placeholder-festival.jpg'}
    >
      {/* Status badge */}
      <div className="mb-md flex items-center">
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

      {/* Festival description */}
      {festival.description && (
        <div className="mb-lg">
          <Typography variant="body1">{festival.description}</Typography>
        </div>
      )}

      {/* Date selector for performances */}
      <div className="mb-md">
        <Typography variant="h3" className="mb-sm">
          Festival Lineup
        </Typography>
        <div className="flex overflow-x-auto pb-sm whitespace-nowrap">
          {festivalDates.map((date, index) => (
            <Button
              key={index}
              variant={activeDate === date.toISOString().split('T')[0] ? 'primary' : 'outline'}
              className="mr-xs"
              onClick={() => setActiveDate(date.toISOString().split('T')[0])}
            >
              {date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Button>
          ))}
        </div>
      </div>

      {/* Performances for selected date */}
      <PerformanceList
        performances={concerts.filter(
          concert => new Date(concert.start_time).toISOString().split('T')[0] === activeDate
        )}
        loading={concertsLoading}
        emptyMessage={`No performances scheduled for this date`}
      />

      {/* Website link */}
      {festival.website_url && (
        <Button
          variant="outline"
          fullWidth
          className="mt-lg"
          onClick={() => window.open(festival.website_url, '_blank')}
        >
          Visit Official Festival Website
        </Button>
      )}
    </DetailPageLayout>
  );
};

export default FestivalDetailPage;
