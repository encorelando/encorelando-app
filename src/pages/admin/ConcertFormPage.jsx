import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../services/supabase';
import AdminLayout from '../../components/templates/AdminLayout';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Spinner from '../../components/atoms/Spinner';
import Input from '../../components/atoms/Input';
import Card from '../../components/atoms/Card';

/**
 * ConcertFormPage
 *
 * Form for creating or editing concert data
 *
 * Mobile-first features:
 * - Single column layout optimized for vertical scrolling on mobile
 * - Touch-friendly input elements (min 44px height)
 * - Bottom-fixed action buttons within thumb reach
 * - Contextual validation with clear error messages
 * - Optimized dropdowns for touch interaction
 */
const ConcertFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    artist_id: '',
    venue_id: '',
    festival_id: '',
    start_time: '',
    end_time: '',
    notes: '',
    ticket_required: false,
  });

  // Options for dropdowns
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  const [festivals, setFestivals] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch concert data if in edit mode
  useEffect(() => {
    const fetchConcertData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);

        const { data, error } = await supabase.from('concerts').select('*').eq('id', id).single();

        if (error) throw error;

        if (data) {
          // Format dates for datetime-local input
          const formattedStartTime = data.start_time
            ? new Date(data.start_time).toISOString().slice(0, 16)
            : '';
          const formattedEndTime = data.end_time
            ? new Date(data.end_time).toISOString().slice(0, 16)
            : '';

          setFormData({
            ...data,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
          });
        }
      } catch (error) {
        console.error('Error fetching concert data:', error.message);
        setError('Failed to load concert data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConcertData();
  }, [id, isEditMode]);

  // Fetch options for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);

        // Fetch artists
        const { data: artistsData, error: artistsError } = await supabase
          .from('artists')
          .select('id, name')
          .order('name');

        if (artistsError) throw artistsError;
        setArtists(artistsData || []);

        // Fetch venues
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('id, name')
          .order('name');

        if (venuesError) throw venuesError;
        setVenues(venuesData || []);

        // Fetch festivals
        const { data: festivalsData, error: festivalsError } = await supabase
          .from('festivals')
          .select('id, name')
          .order('name');

        if (festivalsError) throw festivalsError;
        setFestivals(festivalsData || []);
      } catch (error) {
        console.error('Error fetching options:', error.message);
        setError('Failed to load form options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear field-specific error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.artist_id) {
      errors.artist_id = 'Artist is required';
    }

    if (!formData.venue_id) {
      errors.venue_id = 'Venue is required';
    }

    if (!formData.start_time) {
      errors.start_time = 'Start time is required';
    }

    if (formData.end_time && new Date(formData.end_time) <= new Date(formData.start_time)) {
      errors.end_time = 'End time must be after start time';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setSaving(true);

      // Prepare data
      const concertData = {
        ...formData,
        // Convert empty strings to null for non-required fields
        festival_id: formData.festival_id || null,
        end_time: formData.end_time || null,
      };

      if (isEditMode) {
        // Update existing concert
        const { error } = await supabase.from('concerts').update(concertData).eq('id', id);

        if (error) throw error;
      } else {
        // Create new concert
        const { error } = await supabase.from('concerts').insert(concertData);

        if (error) throw error;
      }

      // Navigate back to concerts list on success
      navigate('/admin/concerts');
    } catch (error) {
      console.error('Error saving concert:', error.message);
      setError('Failed to save concert. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditMode ? 'Edit Concert' : 'Add Concert'}>
        <div className="flex justify-center my-12">
          <Spinner size="lg" color="primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditMode ? 'Edit Concert' : 'Add Concert'}>
      {error && (
        <Card className="bg-error-light p-4 mb-6">
          <Typography variant="body1">{error}</Typography>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        {/* Artist selection */}
        <div className={formErrors.artist_id ? 'error-field' : ''}>
          <label htmlFor="artist_id" className="block mb-2 text-sm font-medium text-white">
            Artist<span className="text-error">*</span>
          </label>
          <select
            id="artist_id"
            name="artist_id"
            value={formData.artist_id}
            onChange={handleInputChange}
            className={`appearance-none min-h-touch w-full px-md py-xs rounded border focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors bg-white text-black ${
              formErrors.artist_id
                ? 'border-error focus:border-error'
                : 'border-light-gray focus:border-primary'
            }`}
            required
          >
            <option value="">Select Artist</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          {formErrors.artist_id && (
            <p className="mt-1 text-sm text-error">{formErrors.artist_id}</p>
          )}
        </div>

        {/* Venue selection */}
        <div className={formErrors.venue_id ? 'error-field' : ''}>
          <label htmlFor="venue_id" className="block mb-2 text-sm font-medium text-white">
            Venue<span className="text-error">*</span>
          </label>
          <select
            id="venue_id"
            name="venue_id"
            value={formData.venue_id}
            onChange={handleInputChange}
            className={`appearance-none min-h-touch w-full px-md py-xs rounded border focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors bg-white text-black ${
              formErrors.venue_id
                ? 'border-error focus:border-error'
                : 'border-light-gray focus:border-primary'
            }`}
            required
          >
            <option value="">Select Venue</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
          {formErrors.venue_id && <p className="mt-1 text-sm text-error">{formErrors.venue_id}</p>}
        </div>

        {/* Festival selection (optional) */}
        <div>
          <label htmlFor="festival_id" className="block mb-2 text-sm font-medium text-white">
            Festival (optional)
          </label>
          <select
            id="festival_id"
            name="festival_id"
            value={formData.festival_id}
            onChange={handleInputChange}
            className="appearance-none min-h-touch w-full px-md py-xs rounded border border-light-gray focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-colors bg-white text-black"
          >
            <option value="">None</option>
            {festivals.map(festival => (
              <option key={festival.id} value={festival.id}>
                {festival.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start time */}
        <div className={formErrors.start_time ? 'error-field' : ''}>
          <label htmlFor="start_time" className="block mb-2 text-sm font-medium text-white">
            Start Time<span className="text-error">*</span>
          </label>
          <Input
            type="datetime-local"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
            className={`min-h-touch bg-white text-black ${
              formErrors.start_time ? 'border-error' : ''
            }`}
          />
          {formErrors.start_time && (
            <p className="mt-1 text-sm text-error">{formErrors.start_time}</p>
          )}
        </div>

        {/* End time (optional) */}
        <div className={formErrors.end_time ? 'error-field' : ''}>
          <label htmlFor="end_time" className="block mb-2 text-sm font-medium text-white">
            End Time (optional)
          </label>
          <Input
            type="datetime-local"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleInputChange}
            className={`min-h-touch bg-white text-black ${
              formErrors.end_time ? 'border-error' : ''
            }`}
          />
          {formErrors.end_time && <p className="mt-1 text-sm text-error">{formErrors.end_time}</p>}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block mb-2 text-sm font-medium text-white">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="appearance-none w-full px-md py-xs rounded border border-light-gray focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-colors bg-white text-black"
          />
        </div>

        {/* Ticket required */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="ticket_required"
            name="ticket_required"
            checked={formData.ticket_required}
            onChange={handleInputChange}
            className="h-5 w-5 text-primary focus:ring-primary border-light-gray rounded"
          />
          <label htmlFor="ticket_required" className="ml-2 text-sm font-medium text-white">
            Ticket required for this concert
          </label>
        </div>
      </form>

      {/* Fixed action buttons for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 p-4 flex space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/admin/concerts')}
          fullWidth
          className="min-h-touch"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={handleSubmit}
          disabled={saving}
          fullWidth
          className="min-h-touch"
        >
          {saving ? 'Saving...' : isEditMode ? 'Update Concert' : 'Create Concert'}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default ConcertFormPage;
