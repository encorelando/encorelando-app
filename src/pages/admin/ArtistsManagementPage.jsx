import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import AdminLayout from '../../components/templates/AdminLayout';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';

/**
 * ArtistsManagementPage
 *
 * Admin interface for managing artist data
 * Mobile-first design features:
 * - Card-based list optimized for touch
 * - Image thumbnails optimized for mobile loading
 * - Simple filtering options with clear touch targets
 * - Bottom floating action button for new items
 */
const ArtistsManagementPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.from('artists').select('*').order('name');

        if (error) throw error;

        setArtists(data || []);
      } catch (error) {
        console.error('Error fetching artists:', error.message);
        setError('Failed to load artists. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleCreateArtist = () => {
    navigate('/admin/artists/new');
  };

  const handleEditArtist = id => {
    console.log('Editing artist with ID:', id);
    navigate(`/admin/artists/edit/${id}`);
  };

  // Filter artists based on search query
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Artists Management">
      {/* Page header with action buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <Typography variant="h2" className="text-xl font-bold mb-2 md:mb-0">
          Artists
        </Typography>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" onClick={handleCreateArtist} className="min-h-touch">
            Add New Artist
          </Button>
        </div>
      </div>

      {/* Search filter - mobile optimized */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search artists..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full min-h-touch px-4 py-2 bg-white text-black placeholder-gray-500 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="flex justify-center my-12">
          <Spinner size="lg" color="primary" />
        </div>
      )}

      {error && (
        <Card className="bg-error-light p-4 mb-6">
          <Typography variant="body1">{error}</Typography>
        </Card>
      )}

      {/* Artists list */}
      {!loading && filteredArtists.length === 0 && (
        <Card className="p-6 text-center">
          <Typography variant="body1" className="mb-4">
            {searchQuery
              ? 'No artists match your search. Try a different search term.'
              : 'No artists found. Create your first artist to get started.'}
          </Typography>
          {!searchQuery && (
            <Button variant="primary" onClick={handleCreateArtist} className="min-h-touch">
              Add First Artist
            </Button>
          )}
        </Card>
      )}

      {!loading && filteredArtists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtists.map(artist => (
            <Card
              key={artist.id}
              variant="interactive"
              className="hover:bg-neutral-800 transition-colors cursor-pointer overflow-hidden"
              // eslint-disable-next-line no-unused-vars
              onClick={e => {
                console.log('Card clicked for artist:', artist.name, artist.id);
                handleEditArtist(artist.id);
              }}
            >
              {/* Artist image with fallback */}
              <div className="aspect-w-16 aspect-h-9 bg-neutral-700">
                {artist.image_url ? (
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-neutral-500">
                    <span className="text-4xl">🎤</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h3" className="text-lg font-medium mb-1 truncate">
                      {artist.name}
                    </Typography>

                    {artist.genres && artist.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {artist.genres.map((genre, index) => (
                          <span
                            key={index}
                            className="text-xs bg-neutral-700 text-white px-2 py-1 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation();
                      handleEditArtist(artist.id);
                    }}
                    className="min-h-touch px-3 hidden md:inline-flex"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Mobile floating action button */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <Button
          variant="primary"
          onClick={handleCreateArtist}
          className="rounded-full shadow-lg h-14 w-14 flex items-center justify-center"
          ariaLabel="Add new artist"
        >
          +
        </Button>
      </div>
    </AdminLayout>
  );
};

export default ArtistsManagementPage;
