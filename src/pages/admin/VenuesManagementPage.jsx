import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import AdminLayout from '../../components/templates/AdminLayout';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';

/**
 * VenuesManagementPage
 *
 * Admin interface for managing venue data
 * Mobile-first design features:
 * - Card-based list optimized for touch
 * - Location information presented clearly for small screens
 * - Filter by park for easy organization
 * - Bottom floating action button for new items
 */
const VenuesManagementPage = () => {
  const [venues, setVenues] = useState([]);
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPark, setSelectedPark] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch venues with park data
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select(
            `
            id, 
            name, 
            description, 
            location_details,
            image_url,
            capacity,
            latitude,
            longitude,
            parks(id, name)
          `
          )
          .order('name');

        if (venuesError) throw venuesError;
        setVenues(venuesData || []);

        // Fetch parks for filtering
        const { data: parksData, error: parksError } = await supabase
          .from('parks')
          .select('id, name')
          .order('name');

        if (parksError) throw parksError;
        setParks(parksData || []);
      } catch (error) {
        console.error('Error fetching venues:', error.message);
        setError('Failed to load venues. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateVenue = () => {
    navigate('/admin/venues/new');
  };

  const handleEditVenue = id => {
    console.log('Editing venue with ID:', id);
    navigate(`/admin/venues/edit/${id}`);
  };

  // Filter venues based on selected park
  const filteredVenues = selectedPark
    ? venues.filter(venue => venue.parks?.id === selectedPark)
    : venues;

  return (
    <AdminLayout title="Venues Management">
      {/* Page header with action buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <Typography variant="h2" className="text-xl font-bold mb-2 md:mb-0">
          Venues
        </Typography>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" onClick={handleCreateVenue} className="min-h-touch">
            Add New Venue
          </Button>
        </div>
      </div>

      {/* Park filter dropdown - mobile optimized */}
      <div className="mb-6">
        <label htmlFor="park-filter" className="block mb-2 text-sm font-medium text-white">
          Filter by Park
        </label>
        <select
          id="park-filter"
          value={selectedPark}
          onChange={e => setSelectedPark(e.target.value)}
          className="w-full min-h-touch px-4 py-2 bg-white text-black placeholder-gray-500 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Parks</option>
          {parks.map(park => (
            <option key={park.id} value={park.id}>
              {park.name}
            </option>
          ))}
        </select>
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

      {/* Venues list */}
      {!loading && filteredVenues.length === 0 && (
        <Card className="p-6 text-center">
          <Typography variant="body1" className="mb-4">
            {selectedPark
              ? 'No venues found for the selected park.'
              : 'No venues found. Create your first venue to get started.'}
          </Typography>
          {!selectedPark && (
            <Button variant="primary" onClick={handleCreateVenue} className="min-h-touch">
              Add First Venue
            </Button>
          )}
        </Card>
      )}

      {!loading && filteredVenues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVenues.map(venue => (
            <Card
              key={venue.id}
              variant="interactive"
              className="hover:bg-neutral-800 transition-colors cursor-pointer overflow-hidden"
              // eslint-disable-next-line no-unused-vars
              onClick={e => {
                console.log('Card clicked for venue:', venue.name, venue.id);
                handleEditVenue(venue.id);
              }}
            >
              {/* Venue image with fallback */}
              <div className="aspect-w-16 aspect-h-9 bg-neutral-700">
                {venue.image_url ? (
                  <img
                    src={venue.image_url}
                    alt={venue.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-neutral-500">
                    <span className="text-4xl">🏟️</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h3" className="text-lg font-medium mb-1 truncate">
                      {venue.name}
                    </Typography>

                    {venue.parks?.name && (
                      <Typography variant="body2" className="text-light-gray mb-2">
                        {venue.parks.name}
                      </Typography>
                    )}

                    {venue.capacity && (
                      <div className="mt-2 flex items-center">
                        <span className="text-xs bg-neutral-700 text-white px-2 py-1 rounded-full">
                          Capacity: {venue.capacity}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation();
                      handleEditVenue(venue.id);
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
          onClick={handleCreateVenue}
          className="rounded-full shadow-lg h-14 w-14 flex items-center justify-center"
          ariaLabel="Add new venue"
        >
          +
        </Button>
      </div>
    </AdminLayout>
  );
};

export default VenuesManagementPage;
