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
 * FestivalFormPage
 *
 * Form for creating or editing festival data
 *
 * Mobile-first features:
 * - Date inputs optimized for mobile
 * - Touch-friendly controls
 * - Stacked layout for small screens
 * - Bottom fixed action buttons for easy access
 * - Accessible validation feedback
 */
const FestivalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    park_id: '',
    start_date: '',
    end_date: '',
    description: '',
    website_url: '',
    image_url: '',
    recurring: false,
  });

  // Options for parks dropdown
  const [parks, setParks] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch festival data if in edit mode
  useEffect(() => {
    const fetchFestivalData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);

        const { data, error } = await supabase.from('festivals').select('*').eq('id', id).single();

        if (error) throw error;

        if (data) {
          // Format dates for date input
          const formattedStartDate = data.start_date ? data.start_date : '';
          const formattedEndDate = data.end_date ? data.end_date : '';

          setFormData({
            ...data,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          });
        }
      } catch (error) {
        console.error('Error fetching festival data:', error.message);
        setError('Failed to load festival data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalData();
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

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.park_id) {
      errors.park_id = 'Park is required';
    }

    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      errors.end_date = 'End date is required';
    }

    // Validate date range
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) > new Date(formData.end_date)
    ) {
      errors.end_date = 'End date must be after start date';
    }

    // Validate URLs if provided
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

    if (formData.website_url && !urlRegex.test(formData.website_url)) {
      errors.website_url = 'Please enter a valid URL';
    }

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
      const festivalData = {
        ...formData,
      };

      if (isEditMode) {
        // Update existing festival
        const { error } = await supabase.from('festivals').update(festivalData).eq('id', id);

        if (error) throw error;
      } else {
        // Create new festival
        const { error } = await supabase.from('festivals').insert(festivalData);

        if (error) throw error;
      }

      // Navigate back to festivals list on success
      navigate('/admin/festivals');
    } catch (error) {
      console.error('Error saving festival:', error.message);
      setError('Failed to save festival. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditMode ? 'Edit Festival' : 'Add Festival'}>
        <div className="flex justify-center my-12">
          <Spinner size="lg" color="primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditMode ? 'Edit Festival' : 'Add Festival'}>
      {error && (
        <Card className="bg-error-light p-4 mb-6">
          <Typography variant="body1">{error}</Typography>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        {/* Festival name */}
        <div className={formErrors.name ? 'error-field' : ''}>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
            Festival Name<span className="text-error">*</span>
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

        {/* Date Range - mobile optimized grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start date */}
          <div className={formErrors.start_date ? 'error-field' : ''}>
            <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-white">
              Start Date<span className="text-error">*</span>
            </label>
            <Input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              className={`min-h-touch bg-white text-black ${
                formErrors.start_date ? 'border-error' : ''
              }`}
            />
            {formErrors.start_date && (
              <p className="mt-1 text-sm text-error">{formErrors.start_date}</p>
            )}
          </div>

          {/* End date */}
          <div className={formErrors.end_date ? 'error-field' : ''}>
            <label htmlFor="end_date" className="block mb-2 text-sm font-medium text-white">
              End Date<span className="text-error">*</span>
            </label>
            <Input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
              className={`min-h-touch bg-white text-black ${
                formErrors.end_date ? 'border-error' : ''
              }`}
            />
            {formErrors.end_date && (
              <p className="mt-1 text-sm text-error">{formErrors.end_date}</p>
            )}
          </div>
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

        {/* Website URL */}
        <div className={formErrors.website_url ? 'error-field' : ''}>
          <label htmlFor="website_url" className="block mb-2 text-sm font-medium text-white">
            Website URL
          </label>
          <Input
            type="text"
            id="website_url"
            name="website_url"
            value={formData.website_url}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className={`min-h-touch bg-white text-black ${
              formErrors.website_url ? 'border-error' : ''
            }`}
          />
          {formErrors.website_url && (
            <p className="mt-1 text-sm text-error">{formErrors.website_url}</p>
          )}
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

        {/* Recurring checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recurring"
            name="recurring"
            checked={formData.recurring}
            onChange={handleInputChange}
            className="h-5 w-5 text-primary focus:ring-primary border-light-gray rounded"
          />
          <label htmlFor="recurring" className="ml-2 text-sm font-medium text-white">
            This is a recurring festival
          </label>
        </div>
      </form>

      {/* Fixed action buttons for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 p-4 flex space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/admin/festivals')}
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
          {saving ? 'Saving...' : isEditMode ? 'Update Festival' : 'Create Festival'}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default FestivalFormPage;
