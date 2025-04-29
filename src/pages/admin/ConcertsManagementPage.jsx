import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import AdminLayout from '../../components/templates/AdminLayout';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';

/**
 * ConcertsManagementPage
 *
 * Admin interface for managing concert data
 * Mobile-first design with:
 * - List view optimized for touch interaction
 * - Sorting and filtering controls accessible on mobile
 * - Bottom action buttons within thumb reach
 */
const ConcertsManagementPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setLoading(true);

        // Fetch concerts with related artist and venue data
        const { data, error } = await supabase
          .from('concerts')
          .select(
            `
            id, 
            start_time, 
            end_time, 
            notes,
            ticket_required,
            artists(id, name),
            venues(id, name),
            festivals(id, name)
          `
          )
          .order('start_time', { ascending: true });

        if (error) throw error;

        setConcerts(data || []);
      } catch (error) {
        console.error('Error fetching concerts:', error.message);
        setError('Failed to load concerts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  const handleCreateConcert = () => {
    navigate('/admin/concerts/new');
  };

  const handleEditConcert = id => {
    console.log('Editing concert with ID:', id);
    navigate(`/admin/concerts/edit/${id}`);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <AdminLayout title="Concerts Management">
      {/* Page header with action buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <Typography variant="h2" className="text-xl font-bold mb-2 md:mb-0">
          Concerts
        </Typography>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" onClick={handleCreateConcert} className="min-h-touch">
            Add New Concert
          </Button>
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

      {/* Concerts list */}
      {!loading && concerts.length === 0 && (
        <Card className="p-6 text-center">
          <Typography variant="body1" className="mb-4">
            No concerts found. Create your first concert to get started.
          </Typography>
          <Button variant="primary" onClick={handleCreateConcert} className="min-h-touch">
            Add First Concert
          </Button>
        </Card>
      )}

      {!loading && concerts.length > 0 && (
        <div className="space-y-4">
          {concerts.map(concert => (
            <Card
              key={concert.id}
              variant="interactive"
              className="hover:bg-neutral-800 transition-colors cursor-pointer"
              // eslint-disable-next-line no-unused-vars
              onClick={e => {
                console.log('Card clicked for concert:', concert.artists?.name, concert.id);
                handleEditConcert(concert.id);
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <Typography variant="h3" className="text-lg font-medium mb-1">
                    {concert.artists?.name || 'Unknown Artist'}
                  </Typography>

                  <Typography variant="body2" className="text-light-gray mb-2">
                    {concert.venues?.name || 'Unknown Venue'}
                    {concert.festivals?.name && ` • ${concert.festivals.name}`}
                  </Typography>

                  <Typography variant="body2" className="text-light-gray">
                    {formatDate(concert.start_time)}
                    {concert.end_time && ` - ${formatDate(concert.end_time).split(', ')[1]}`}
                  </Typography>
                </div>

                <div className="flex items-center mt-2 md:mt-0">
                  {concert.ticket_required && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full mr-2">
                      Ticket Required
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation();
                      handleEditConcert(concert.id);
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
          onClick={handleCreateConcert}
          className="rounded-full shadow-lg h-14 w-14 flex items-center justify-center"
          ariaLabel="Add new concert"
        >
          +
        </Button>
      </div>
    </AdminLayout>
  );
};

export default ConcertsManagementPage;
