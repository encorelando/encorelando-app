import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import PerformanceList from '../components/organisms/PerformanceList';
import Tag from '../components/atoms/Tag';
import Button from '../components/atoms/Button';
import useArtists from '../hooks/useArtists';
import useConcerts from '../hooks/useConcerts';
import supabase from '../services/supabase';
import Icon from '../components/atoms/Icon';

/**
 * ArtistDetailPage component for artist profiles
 * Mobile-optimized with performances listing
 */
const ArtistDetailPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processedConcerts, setProcessedConcerts] = useState([]);
  const [includePastPerformances, setIncludePastPerformances] = useState(false);

  // Use custom hooks
  const { getArtistById } = useArtists();
  const { getConcertsByArtist, concerts, loading: concertsLoading } = useConcerts();

  // Fetch the venue details including park information
  const fetchVenueDetails = async venueId => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(
          `
          id,
          name,
          park:park_id (id, name)
        `
        )
        .eq('id', venueId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching venue details for venue ${venueId}:`, error);
      return null;
    }
  };

  // Fetch artist details
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setLoading(true);
        const artistData = await getArtistById(id);
        setArtist(artistData);

        // Fetch artist's concerts
        await getConcertsByArtist(id, includePastPerformances);
      } catch (err) {
        console.error('Error fetching artist details:', err);
        setError(err.message || 'Failed to load artist details');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [id, getArtistById, getConcertsByArtist, includePastPerformances]);

  // Effect to process concert data and add venue/park details
  useEffect(() => {
    const processConcertData = async () => {
      if (!artist) return;

      // Reset processed concerts if there are no concerts to process
      if (!concerts.length) {
        setProcessedConcerts([]);
        return;
      }

      console.log('Processing concerts for artist:', artist.name, concerts.length);

      // Verify these concerts are for the current artist by checking artist_id
      const artistConcerts = concerts.filter(concert => {
        // Only include concerts that explicitly have this artist's ID
        return concert.artist_id === artist.id;
      });

      if (artistConcerts.length === 0) {
        console.log('No matching concerts found for this artist');
        setProcessedConcerts([]);
        return;
      }

      // Process each concert to add park information
      const processedData = await Promise.all(
        artistConcerts.map(async concert => {
          let themeParkName = '';

          // Support both singular and plural field names
          const venueData = concert.venue || concert.venues;

          // If venue exists, try to get its park information
          if (venueData && venueData.id) {
            const venueDetails = await fetchVenueDetails(venueData.id);
            if (venueDetails && venueDetails.park) {
              themeParkName = venueDetails.park.name;
            }
          }

          // Adjust date if needed to ensure correct local date
          const startTime = concert.startTime || concert.start_time;
          const adjustedDate = startTime ? new Date(startTime) : null;

          return {
            ...concert,
            // Use the corrected date if available
            start_time: adjustedDate ? adjustedDate.toISOString() : concert.start_time,
            startTime: adjustedDate ? adjustedDate.toISOString() : concert.startTime,
            name: 'Concert', // Use generic "Concert" as the default name
            artist_name: artist.name, // Add artist name explicitly
            theme_park: themeParkName || '', // Add theme park name if available
          };
        })
      );

      setProcessedConcerts(processedData);
    };

    processConcertData();
  }, [concerts, artist]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Show error state
  if (error || !artist) {
    return (
      <DetailPageLayout title="Artist Not Found" imageUrl="/images/placeholder-artist.jpg">
        <Typography variant="body1" color="error">
          {error || 'Could not find the requested artist.'}
        </Typography>
        <Button variant="primary" className="mt-lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </DetailPageLayout>
    );
  }

  // Ensure we have a valid image URL
  const artistImageUrl =
    artist.image_url && artist.image_url.trim() !== ''
      ? artist.image_url
      : '/images/placeholder-artist.jpg';

  return (
    <DetailPageLayout title={artist.name} imageUrl={artistImageUrl} minHeight="full">
      {/* Artist metadata */}
      <div className="mb-lg">
        {/* Genres */}
        {artist.genres && artist.genres.length > 0 && (
          <div className="mb-md">
            <Typography variant="h4" className="mb-xs">
              Genres
            </Typography>
            <div className="flex flex-wrap gap-xs">
              {artist.genres.map(genre => (
                <Tag key={genre} text={genre} />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {artist.description && (
          <div className="mt-md">
            <Typography variant="h4" className="mb-xs">
              About
            </Typography>
            <Typography variant="body1">{artist.description}</Typography>
          </div>
        )}

        {/* Website */}
        {artist.website_url && (
          <div className="mt-md">
            <Button variant="outline" onClick={() => window.open(artist.website_url, '_blank')}>
              Official Website
            </Button>
          </div>
        )}
      </div>

      {/* Performances */}
      <div className="mt-xl">
        <div className="flex justify-between items-center mb-md">
          <Typography variant="h3">Performances</Typography>

          {/* Past performances toggle - Mobile-friendly touch target */}
          <button
            onClick={() => setIncludePastPerformances(prev => !prev)}
            className={`
              flex items-center px-xs py-xxs rounded-full min-h-touch
              ${
                includePastPerformances
                  ? 'bg-primary bg-opacity-20 text-primary'
                  : 'bg-dark-gray text-light-gray'
              }
            `}
          >
            <div className="mr-xs">
              <Icon name="clock" size="sm" />
            </div>
            <Typography variant="button">
              {includePastPerformances ? 'Hide Past' : 'Show Past'}
            </Typography>
          </button>
        </div>

        <PerformanceList
          performances={processedConcerts}
          loading={concertsLoading}
          emptyMessage={
            includePastPerformances
              ? `No performances found for ${artist.name}`
              : `No upcoming performances scheduled for ${artist.name}`
          }
          groupByDate={true}
          useArtistCard={true}
        />
      </div>
    </DetailPageLayout>
  );
};

export default ArtistDetailPage;
