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
import { getValidDateString } from '../utils/dateUtils';

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

  const { getArtistById } = useArtists();
  const { getConcertsByArtist, concerts, loading: concertsLoading } = useConcerts();

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

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setLoading(true);
        const artistData = await getArtistById(id);
        setArtist(artistData);
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

  useEffect(() => {
    const processConcertData = async () => {
      if (!artist) return;

      if (!concerts.length) {
        setProcessedConcerts([]);
        return;
      }

      const artistConcerts = concerts.filter(concert => concert.artist_id === artist.id);

      if (artistConcerts.length === 0) {
        setProcessedConcerts([]);
        return;
      }

      const processedData = await Promise.all(
        artistConcerts.map(async concert => {
          let themeParkName = '';
          const venueData = concert.venue || concert.venues;

          if (venueData && venueData.id) {
            const venueDetails = await fetchVenueDetails(venueData.id);
            if (venueDetails?.park) {
              themeParkName = venueDetails.park.name;
            }
          }

          const startTime = concert.startTime || concert.start_time;

          return {
            ...concert,
            name: 'Concert',
            artist_name: artist.name,
            theme_park: themeParkName,
            date: getValidDateString(startTime), // ✅ use safe date string
          };
        })
      );

      setProcessedConcerts(processedData);
    };

    processConcertData();
  }, [concerts, artist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

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

  const artistImageUrl =
    artist.image_url?.trim() !== '' ? artist.image_url : '/images/placeholder-artist.jpg';

  return (
    <DetailPageLayout title={artist.name} imageUrl={artistImageUrl} minHeight="full">
      <div className="mb-lg">
        {artist.genres?.length > 0 && (
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

        {artist.description && (
          <div className="mt-md">
            <Typography variant="h4" className="mb-xs">
              About
            </Typography>
            <Typography variant="body1">{artist.description}</Typography>
          </div>
        )}

        {artist.website_url && (
          <div className="mt-md">
            <Button variant="outline" onClick={() => window.open(artist.website_url, '_blank')}>
              Official Website
            </Button>
          </div>
        )}
      </div>

      <div className="mt-xl">
        <div className="flex justify-between items-center mb-md">
          <Typography variant="h3">Performances</Typography>
          <button
            onClick={() => setIncludePastPerformances(prev => !prev)}
            className={`flex items-center px-xs py-xxs rounded-full min-h-touch ${
              includePastPerformances
                ? 'bg-primary bg-opacity-20 text-primary'
                : 'bg-dark-gray text-light-gray'
            }`}
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
