import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailPageLayout from '../components/templates/DetailPageLayout';
import Typography from '../components/atoms/Typography';
import Spinner from '../components/atoms/Spinner';
import PerformanceList from '../components/organisms/PerformanceList';
import Tag from '../components/atoms/Tag';
import Button from '../components/atoms/Button';
import useArtists from '../hooks/useArtists';
import useConcerts from '../hooks/useConcerts';

/**
 * ArtistDetailPage component for artist profiles
 * Mobile-optimized with performances listing
 */
const ArtistDetailPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use custom hooks
  const { getArtistById } = useArtists();
  const { getConcertsByArtist, concerts, loading: concertsLoading } = useConcerts();
  
  // Fetch artist details
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setLoading(true);
        const artistData = await getArtistById(id);
        setArtist(artistData);
        
        // Fetch artist's concerts
        await getConcertsByArtist(id, false); // Include past concerts
      } catch (err) {
        console.error('Error fetching artist details:', err);
        setError(err.message || 'Failed to load artist details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtistDetails();
  }, [id, getArtistById, getConcertsByArtist]);
  
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
      <DetailPageLayout
        title="Artist Not Found"
        imageUrl="/images/placeholder-artist.jpg"
      >
        <Typography variant="body1" color="error">
          {error || 'Could not find the requested artist.'}
        </Typography>
        <Button variant="primary" className="mt-lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout
      title={artist.name}
      imageUrl={artist.image_url || '/images/placeholder-artist.jpg'}
    >
      {/* Artist metadata */}
      <div className="mb-lg">
        {/* Genres */}
        {artist.genres && artist.genres.length > 0 && (
          <div className="mb-md">
            <Typography variant="h4" className="mb-xs">Genres</Typography>
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
            <Typography variant="h4" className="mb-xs">About</Typography>
            <Typography variant="body1">
              {artist.description}
            </Typography>
          </div>
        )}
        
        {/* Website */}
        {artist.website_url && (
          <div className="mt-md">
            <Button 
              variant="outline"
              onClick={() => window.open(artist.website_url, '_blank')}
            >
              Official Website
            </Button>
          </div>
        )}
      </div>
      
      {/* Performances */}
      <div className="mt-xl">
        <Typography variant="h3" className="mb-md">Performances</Typography>
        <PerformanceList
          performances={concerts}
          loading={concertsLoading}
          emptyMessage="No performances scheduled for this artist"
          groupByDate={true}
        />
      </div>
    </DetailPageLayout>
  );
};

export default ArtistDetailPage;