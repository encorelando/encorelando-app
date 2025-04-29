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
 * ArtistFormPage
 *
 * Form for creating or editing artist data
 *
 * Mobile-first features:
 * - Single column layout optimized for vertical scrolling
 * - Touch-friendly input elements
 * - Efficient image upload preview
 * - Bottom-fixed action buttons within thumb reach
 * - Clear validation feedback
 */
const ArtistFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    website_url: '',
    genres: [],
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
    },
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [genreInput, setGenreInput] = useState('');

  // Fetch artist data if in edit mode
  useEffect(() => {
    const fetchArtistData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);

        const { data, error } = await supabase.from('artists').select('*').eq('id', id).single();

        if (error) throw error;

        if (data) {
          // Parse the social JSON if it exists
          const social = data.social || {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: '',
          };

          // Parse genres array or default to empty array
          const genres = data.genres || [];

          setFormData({
            ...data,
            social,
            genres,
          });
        }
      } catch (error) {
        console.error('Error fetching artist data:', error.message);
        setError('Failed to load artist data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id, isEditMode]);

  const handleInputChange = e => {
    const { name, value } = e.target;

    // Handle nested social fields
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [socialField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear field-specific error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleAddGenre = () => {
    if (!genreInput.trim()) return;

    if (!formData.genres.includes(genreInput.trim())) {
      setFormData({
        ...formData,
        genres: [...formData.genres, genreInput.trim()],
      });
    }

    setGenreInput('');
  };

  const handleRemoveGenre = genreToRemove => {
    setFormData({
      ...formData,
      genres: formData.genres.filter(genre => genre !== genreToRemove),
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    // Validate URLs
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

    if (formData.website_url && !urlRegex.test(formData.website_url)) {
      errors.website_url = 'Please enter a valid URL';
    }

    if (formData.image_url && !urlRegex.test(formData.image_url)) {
      errors.image_url = 'Please enter a valid URL';
    }

    // Validate social URLs
    Object.entries(formData.social).forEach(([key, value]) => {
      if (value && !urlRegex.test(value)) {
        errors[`social.${key}`] = 'Please enter a valid URL';
      }
    });

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
      const artistData = {
        ...formData,
      };

      if (isEditMode) {
        // Update existing artist
        const { error } = await supabase.from('artists').update(artistData).eq('id', id);

        if (error) throw error;
      } else {
        // Create new artist
        const { error } = await supabase.from('artists').insert(artistData);

        if (error) throw error;
      }

      // Navigate back to artists list on success
      navigate('/admin/artists');
    } catch (error) {
      console.error('Error saving artist:', error.message);
      setError('Failed to save artist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditMode ? 'Edit Artist' : 'Add Artist'}>
        <div className="flex justify-center my-12">
          <Spinner size="lg" color="primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditMode ? 'Edit Artist' : 'Add Artist'}>
      {error && (
        <Card className="bg-error-light p-4 mb-6">
          <Typography variant="body1">{error}</Typography>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        {/* Artist name */}
        <div className={formErrors.name ? 'error-field' : ''}>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
            Artist Name<span className="text-error">*</span>
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

        {/* Genres */}
        <div>
          <label className="block mb-2 text-sm font-medium text-white">Genres</label>
          <div className="flex items-center space-x-2 mb-2">
            <Input
              type="text"
              value={genreInput}
              onChange={e => setGenreInput(e.target.value)}
              placeholder="Add a genre..."
              className="min-h-touch bg-white text-black"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddGenre}
              className="min-h-touch px-4"
            >
              Add
            </Button>
          </div>
          {formData.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.genres.map((genre, index) => (
                <div
                  key={index}
                  className="bg-neutral-700 text-white px-3 py-1 rounded-full flex items-center"
                >
                  <span>{genre}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="ml-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div>
          <Typography variant="h3" className="text-md font-medium mb-4">
            Social Links
          </Typography>

          {/* Facebook */}
          <div className={formErrors['social.facebook'] ? 'error-field mb-4' : 'mb-4'}>
            <label htmlFor="social.facebook" className="block mb-2 text-sm font-medium text-white">
              Facebook
            </label>
            <Input
              type="text"
              id="social.facebook"
              name="social.facebook"
              value={formData.social.facebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/artist"
              className={`min-h-touch bg-white text-black ${
                formErrors['social.facebook'] ? 'border-error' : ''
              }`}
            />
            {formErrors['social.facebook'] && (
              <p className="mt-1 text-sm text-error">{formErrors['social.facebook']}</p>
            )}
          </div>

          {/* Twitter */}
          <div className={formErrors['social.twitter'] ? 'error-field mb-4' : 'mb-4'}>
            <label htmlFor="social.twitter" className="block mb-2 text-sm font-medium text-white">
              Twitter
            </label>
            <Input
              type="text"
              id="social.twitter"
              name="social.twitter"
              value={formData.social.twitter}
              onChange={handleInputChange}
              placeholder="https://twitter.com/artist"
              className={`min-h-touch bg-white text-black ${
                formErrors['social.twitter'] ? 'border-error' : ''
              }`}
            />
            {formErrors['social.twitter'] && (
              <p className="mt-1 text-sm text-error">{formErrors['social.twitter']}</p>
            )}
          </div>

          {/* Instagram */}
          <div className={formErrors['social.instagram'] ? 'error-field mb-4' : 'mb-4'}>
            <label htmlFor="social.instagram" className="block mb-2 text-sm font-medium text-white">
              Instagram
            </label>
            <Input
              type="text"
              id="social.instagram"
              name="social.instagram"
              value={formData.social.instagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/artist"
              className={`min-h-touch bg-white text-black ${
                formErrors['social.instagram'] ? 'border-error' : ''
              }`}
            />
            {formErrors['social.instagram'] && (
              <p className="mt-1 text-sm text-error">{formErrors['social.instagram']}</p>
            )}
          </div>

          {/* YouTube */}
          <div className={formErrors['social.youtube'] ? 'error-field mb-4' : 'mb-4'}>
            <label htmlFor="social.youtube" className="block mb-2 text-sm font-medium text-white">
              YouTube
            </label>
            <Input
              type="text"
              id="social.youtube"
              name="social.youtube"
              value={formData.social.youtube}
              onChange={handleInputChange}
              placeholder="https://youtube.com/artist"
              className={`min-h-touch bg-white text-black ${
                formErrors['social.youtube'] ? 'border-error' : ''
              }`}
            />
            {formErrors['social.youtube'] && (
              <p className="mt-1 text-sm text-error">{formErrors['social.youtube']}</p>
            )}
          </div>
        </div>
      </form>

      {/* Fixed action buttons for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 p-4 flex space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/admin/artists')}
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
          {saving ? 'Saving...' : isEditMode ? 'Update Artist' : 'Create Artist'}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default ArtistFormPage;
