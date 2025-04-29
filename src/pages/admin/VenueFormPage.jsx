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
 * VenueFormPage
 *
 * Form for creating or editing venue data
 *
 * Mobile-first features:
 * - Single column layout optimized for vertical scrolling
 * - Touch-friendly input elements with appropriate spacing
 * - Location input optimized for mobile
 * - Bottom-fixed action buttons within thumb reach
 * - Clear validation feedback
 */
const VenueFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    park_id: '',
    description: '',
    location_details: '',
    image_url: '',
    capacity: '',
    latitude: '',
    longitude: '',
  });

  // Options for parks dropdown
  const [parks, setParks] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch venue data if in edit mode
  useEffect(() => {
    const fetchVenueData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);

        const { data, error } = await supabase.from('venues').select('*').eq('id', id).single();

        if (error) throw error;

        if (data) {
          setFormData({
            ...data,
            // Convert null values to empty strings for form inputs
            latitude: data.latitude || '',
            longitude: data.longitude || '',
            capacity: data.capacity || '',
          });
        }
      } catch (error) {
        console.error('Error fetching venue data:', error.message);
        setError('Failed to load venue data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [id, isEditMode]);

  // Fetch parks for dropdown
  useEffect(() => {
    const fetchParks = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.from('parks').select('id, name').order('name');

        if (error) throw error;

        setParks(data || []);
      } catch (error) {
        console.error('Error fetching parks:', error.message);
        setError('Failed to load parks data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

  const handleInputChange = e => {
    const { name, value, type } = e.target;

    let parsedValue = value;

    // Parse numeric values
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
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

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.park_id) {
      errors.park_id = 'Park is required';
    }

    // Validate coordinates if provided
    if (
      formData.latitude &&
      (isNaN(Number(formData.latitude)) ||
        Number(formData.latitude) < -90 ||
        Number(formData.latitude) > 90)
    ) {
      errors.latitude = 'Latitude must be a number between -90 and 90';
    }

    if (
      formData.longitude &&
      (isNaN(Number(formData.longitude)) ||
        Number(formData.longitude) < -180 ||
        Number(formData.longitude) > 180)
    ) {
      errors.longitude = 'Longitude must be a number between -180 and 180';
    }

    // Validate capacity if provided
    if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0)) {
      errors.capacity = 'Capacity must be a positive number';
    }

    // Validate URL if provided
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    if (formData.image_url && !urlRegex.test(formData.image_url)) {
      errors.image_url = 'Please enter a valid URL';
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
      const venueData = {
        ...formData,
        // Convert empty strings to null for the database
        latitude: formData.latitude === '' ? null : Number(formData.latitude),
        longitude: formData.longitude === '' ? null : Number(formData.longitude),
        capacity: formData.capacity === '' ? null : Number(formData.capacity),
      };

      if (isEditMode) {
        // Update existing venue
        const { error } = await supabase.from('venues').update(venueData).eq('id', id);

        if (error) throw error;
      } else {
        // Create new venue
        const { error } = await supabase.from('venues').insert(venueData);

        if (error) throw error;
      }

      // Navigate back to venues list on success
      navigate('/admin/venues');
    } catch (error) {
      console.error('Error saving venue:', error.message);
      setError('Failed to save venue. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditMode ? 'Edit Venue' : 'Add Venue'}>
        <div className="flex justify-center my-12">
          <Spinner size="lg" color="primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditMode ? 'Edit Venue' : 'Add Venue'}>
      {error && (
        <Card className="bg-error-light p-4 mb-6">
          <Typography variant="body1">{error}</Typography>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        {/* Venue name */}
        <div className={formErrors.name ? 'error-field' : ''}>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
            Venue Name<span className="text-error">*</span>
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={`min-h-touch bg-white text-black ${formErrors.name ? 'border-error' : ''}`}
          />
          {formErrors.name && <p className="mt-1 text-sm text-error">{formErrors.name}</p>}
        </div>

        {/* Park selection */}
        <div className={formErrors.park_id ? 'error-field' : ''}>
          <label htmlFor="park_id" className="block mb-2 text-sm font-medium text-white">
            Park<span className="text-error">*</span>
          </label>
          <select
            id="park_id"
            name="park_id"
            value={formData.park_id}
            onChange={handleInputChange}
            className={`appearance-none min-h-touch w-full px-md py-xs rounded border focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors bg-white text-black ${
              formErrors.park_id
                ? 'border-error focus:border-error'
                : 'border-light-gray focus:border-primary'
            }`}
            required
          >
            <option value="">Select Park</option>
            {parks.map(park => (
              <option key={park.id} value={park.id}>
                {park.name}
              </option>
            ))}
          </select>
          {formErrors.park_id && <p className="mt-1 text-sm text-error">{formErrors.park_id}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="appearance-none w-full px-md py-xs rounded border border-light-gray focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-colors bg-white text-black"
          />
        </div>

        {/* Location details */}
        <div>
          <label htmlFor="location_details" className="block mb-2 text-sm font-medium text-white">
            Location Details
          </label>
          <textarea
            id="location_details"
            name="location_details"
            value={formData.location_details}
            onChange={handleInputChange}
            rows={3}
            placeholder="E.g., Near main entrance, Northwest corner of the park"
            className="appearance-none w-full px-md py-xs rounded border border-light-gray focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-colors bg-white text-black"
          />
        </div>

        {/* Coordinates - mobile optimized grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Latitude */}
          <div className={formErrors.latitude ? 'error-field' : ''}>
            <label htmlFor="latitude" className="block mb-2 text-sm font-medium text-white">
              Latitude
            </label>
            <Input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              step="any"
              placeholder="28.3852"
              className={`min-h-touch bg-white text-black ${
                formErrors.latitude ? 'border-error' : ''
              }`}
            />
            {formErrors.latitude && (
              <p className="mt-1 text-sm text-error">{formErrors.latitude}</p>
            )}
          </div>

          {/* Longitude */}
          <div className={formErrors.longitude ? 'error-field' : ''}>
            <label htmlFor="longitude" className="block mb-2 text-sm font-medium text-white">
              Longitude
            </label>
            <Input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              step="any"
              placeholder="-81.5639"
              className={`min-h-touch bg-white text-black ${
                formErrors.longitude ? 'border-error' : ''
              }`}
            />
            {formErrors.longitude && (
              <p className="mt-1 text-sm text-error">{formErrors.longitude}</p>
            )}
          </div>
        </div>

        {/* Venue capacity */}
        <div className={formErrors.capacity ? 'error-field' : ''}>
          <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-white">
            Capacity
          </label>
          <Input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            min="0"
            placeholder="5000"
            className={`min-h-touch bg-white text-black ${
              formErrors.capacity ? 'border-error' : ''
            }`}
          />
          {formErrors.capacity && <p className="mt-1 text-sm text-error">{formErrors.capacity}</p>}
        </div>

        {/* Image URL */}
        <div className={formErrors.image_url ? 'error-field' : ''}>
          <label htmlFor="image_url" className="block mb-2 text-sm font-medium text-white">
            Image URL
          </label>
          <Input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className={`min-h-touch bg-white text-black ${
              formErrors.image_url ? 'border-error' : ''
            }`}
          />
          {formErrors.image_url && (
            <p className="mt-1 text-sm text-error">{formErrors.image_url}</p>
          )}
          {formData.image_url && (
            <div className="mt-2 relative">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-40 object-cover rounded"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+SW52YWxpZCBpbWFnZSBVUkw8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>
          )}
        </div>
      </form>

      {/* Fixed action buttons for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 p-4 flex space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/admin/venues')}
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
          {saving ? 'Saving...' : isEditMode ? 'Update Venue' : 'Create Venue'}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default VenueFormPage;
