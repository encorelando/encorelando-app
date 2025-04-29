import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import AdminLayout from '../../components/templates/AdminLayout';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';

/**
 * FestivalsManagementPage
 *
 * Admin interface for managing festival data
 * Mobile-first design features:
 * - Card-based list with clear date information
 * - Optimized for thumb scrolling
 * - Status indicators for current/upcoming/past festivals
 * - Bottom floating action button for mobile
 */
const FestivalsManagementPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPark, setSelectedPark] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'current', 'upcoming', 'past'
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch festivals with park data
        const { data: festivalsData, error: festivalsError } = await supabase
          .from('festivals')
          .select(
            `
            id, 
            name, 
            start_date, 
            end_date,
            description,
            image_url,
            recurring,
            parks(id, name)
          `
          )
          .order('start_date', { ascending: false });

        if (festivalsError) throw festivalsError;
        setFestivals(festivalsData || []);

        // Fetch parks for filtering
        const { data: parksData, error: parksError } = await supabase
          .from('parks')
          .select('id, name')
          .order('name');

        if (parksError) throw parksError;
        setParks(parksData || []);
      } catch (error) {
        console.error('Error fetching festivals:', error.message);
        setError('Failed to load festivals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateFestival = () => {
    navigate('/admin/festivals/new');
  };

  const handleEditFestival = id => {
    console.log('Editing festival with ID:', id);
    navigate(`/admin/festivals/edit/${id}`);
  };

  // Filter festivals based on selected park and status
  const filteredFestivals = festivals.filter(festival => {
    // Apply park filter
    if (selectedPark && festival.parks?.id !== selectedPark) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const startDate = new Date(festival.start_date);
      const endDate = new Date(festival.end_date);

      // Current: today is between start and end dates
      if (statusFilter === 'current' && !(today >= startDate && today <= endDate)) {
        return false;
      }

      // Upcoming: start date is in the future
      if (statusFilter === 'upcoming' && today >= startDate) {
        return false;
      }

      // Past: end date is in the past
      if (statusFilter === 'past' && today <= endDate) {
        return false;
      }
    }

    return true;
  });

  // Determine festival status
  const getFestivalStatus = festival => {
    const startDate = new Date(festival.start_date);
    const endDate = new Date(festival.end_date);

    if (today >= startDate && today <= endDate) {
      return { label: 'Current', className: 'bg-green-600' };
    } else if (today < startDate) {
      return { label: 'Upcoming', className: 'bg-blue-600' };
    } else {
      return { label: 'Past', className: 'bg-gray-600' };
    }
  };

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };

    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString(
      'en-US',
      options
    )}`;
  };

  return (
    <AdminLayout title="Festivals Management">
      {/* Page header with action buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <Typography variant="h2" className="text-xl font-bold mb-2 md:mb-0">
          Festivals
        </Typography>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" onClick={handleCreateFestival} className="min-h-touch">
            Add New Festival
          </Button>
        </div>
      </div>

      {/* Filters - mobile optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Park filter */}
        <div>
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

        {/* Status filter */}
        <div>
          <label htmlFor="status-filter" className="block mb-2 text-sm font-medium text-white">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full min-h-touch px-4 py-2 bg-white text-black placeholder-gray-500 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Festivals</option>
            <option value="current">Current</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
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

      {/* Festivals list */}
      {!loading && filteredFestivals.length === 0 && (
        <Card className="p-6 text-center">
          <Typography variant="body1" className="mb-4">
            {selectedPark || statusFilter !== 'all'
              ? 'No festivals match your filters. Try different filter options.'
              : 'No festivals found. Create your first festival to get started.'}
          </Typography>
          {!selectedPark && statusFilter === 'all' && (
            <Button variant="primary" onClick={handleCreateFestival} className="min-h-touch">
              Add First Festival
            </Button>
          )}
        </Card>
      )}

      {!loading && filteredFestivals.length > 0 && (
        <div className="space-y-4">
          {filteredFestivals.map(festival => {
            const status = getFestivalStatus(festival);

            return (
              <Card
                key={festival.id}
                variant="interactive"
                className="hover:bg-neutral-800 transition-colors cursor-pointer"
                // eslint-disable-next-line no-unused-vars
                onClick={e => {
                  console.log('Card clicked for festival:', festival.name, festival.id);
                  handleEditFestival(festival.id);
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  {/* Festival image - only shown on desktop to save space on mobile */}
                  {festival.image_url && (
                    <div className="hidden md:block md:w-40 md:h-40 flex-shrink-0">
                      <img
                        src={festival.image_url}
                        alt={festival.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-4 flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Typography variant="h3" className="text-lg font-medium mb-1">
                          {festival.name}
                        </Typography>

                        <Typography variant="body2" className="text-light-gray">
                          {festival.parks?.name || 'Unknown Park'}
                        </Typography>

                        <Typography variant="body2" className="mt-2">
                          {formatDateRange(festival.start_date, festival.end_date)}
                        </Typography>
                      </div>

                      <div className="flex items-center">
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-xs text-white px-2 py-1 rounded-full ${status.className}`}
                          >
                            {status.label}
                          </span>

                          {festival.recurring && (
                            <span className="ml-2 mt-1 text-xs bg-neutral-700 text-white px-2 py-1 rounded-full">
                              Recurring
                            </span>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditFestival(festival.id);
                          }}
                          className="min-h-touch px-3 ml-2 hidden md:inline-flex"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>

                    {festival.description && (
                      <Typography variant="body2" className="text-light-gray line-clamp-2 mt-2">
                        {festival.description}
                      </Typography>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mobile floating action button */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <Button
          variant="primary"
          onClick={handleCreateFestival}
          className="rounded-full shadow-lg h-14 w-14 flex items-center justify-center"
          ariaLabel="Add new festival"
        >
          +
        </Button>
      </div>
    </AdminLayout>
  );
};

export default FestivalsManagementPage;
