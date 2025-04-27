import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import Button from '../components/atoms/Button';
import HorizontalScroller from '../components/organisms/HorizontalScroller';
import PerformanceList from '../components/organisms/PerformanceList';
import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import FestivalCard from '../components/organisms/FestivalCard';
import useParks from '../hooks/useParks';
import useVenues from '../hooks/useVenues';
import useConcerts from '../hooks/useConcerts';
import useFestivals from '../hooks/useFestivals';

/**
 * ParkDetailPage component for park information, venues, festivals
 * Mobile-optimized with venue and festival listings
 */
const ParkDetailPage = () => {
  const { id } = useParams();
  const [park, setPark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use custom hooks
  const { getParkById } = useParks();
  const { getVenuesByPark, venues } = useVenues();
  const { getConcertsByPark, concerts, loading: concertsLoading } = useConcerts();
  const { getFestivalsByPark, festivals } = useFestivals();
  
  // Fetch park details
  useEffect(() => {
    const fetchParkDetails = async () => {
      try {
        setLoading(true);
        const parkData = await getParkById(id);
        setPark(parkData);
        
        // Fetch related data
        await Promise.all([
          getVenuesByPark(id),
          getConcertsByPark(id, { limit: 10 }),
          getFestivalsByPark(id)
        ]);
      } catch (err) {
        console.error('Error fetching park details:', err);
        setError(err.message || 'Failed to load park details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchParkDetails();
  }, [id, getParkById, getVenuesByPark, getConcertsByPark, getFestivalsByPark]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  
  // Show error state
  if (error || !park) {
    return (
      <DetailPageLayout
        title="Park Not Found"
        imageUrl="/images/placeholder-park.jpg"
      >
        <Typography variant="body1" color="error">
          {error || 'Could not find the requested park.'}
        </Typography>
        <Button variant="primary" className="mt-lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout
      title={park.name}
      imageUrl={park.image_url || '/images/placeholder-park.jpg'}
    >
      {/* Park description */}
      {park.description && (
        <div className="mb-lg">
          <Typography variant="body1">
            {park.description}
          </Typography>
        </div>
      )}
      
      {/* Active festivals section */}
      {festivals.length > 0 && (
        <div className="mb-xl">
          <Typography variant="h3" className="mb-md">Current & Upcoming Festivals</Typography>
          <HorizontalScroller>
            {festivals.map(festival => (
              <div key={festival.id} className="w-[300px]">
                <FestivalCard festival={festival} />
              </div>
            ))}
          </HorizontalScroller>
        </div>
      )}
      
      {/* Venues section */}
      {venues.length > 0 && (
        <div className="mb-xl">
          <Typography variant="h3" className="mb-md">Music Venues</Typography>
          <div className="space-y-md">
            {venues.map(venue => (
              <Link key={venue.id} to={`/venues/${venue.id}`}>
                <Card variant="interactive" className="p-md">
                  <Typography variant="h4" className="mb-xs">
                    {venue.name}
                  </Typography>
                  
                  {venue.location_details && (
                    <Typography variant="body2" color="medium-gray">
                      {venue.location_details}
                    </Typography>
                  )}
                  
                  <div className="absolute right-md top-1/2 transform -translate-y-1/2">
                    <Icon name="chevron-right" size="md" color="medium-gray" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Today's performances */}
      <div className="mb-xl">
        <Typography variant="h3" className="mb-md">Today's Performances</Typography>
        <PerformanceList
          performances={concerts}
          loading={concertsLoading}
          emptyMessage="No performances scheduled for today"
        />
        
        <Link to={`/calendar`} className="block mt-md">
          <Button variant="outline" fullWidth>
            View Full Schedule
          </Button>
        </Link>
      </div>
      
      {/* Website link */}
      {park.website_url && (
        <Button 
          variant="outline"
          fullWidth
          className="mt-lg"
          onClick={() => window.open(park.website_url, '_blank')}
        >
          Visit Official Park Website
        </Button>
      )}
    </DetailPageLayout>
  );
};

export default ParkDetailPage;