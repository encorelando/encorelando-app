import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import Spinner from '../components/atoms/Spinner';

/**
 * ProfilePage Component
 *
 * User profile page that displays user information and favorites.
 * Mobile-first design with touch-friendly elements and optimized layout.
 */
const ProfilePage = () => {
  const { user, userProfile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('artists');
  const { getFavoriteItems, ENTITY_TYPES, loading: favoritesLoading } = useFavorites();
  const [favorites, setFavorites] = useState({
    artists: [],
    concerts: [],
    venues: [],
    festivals: [],
  });

  useEffect(() => {
    // Set display name from profile when loaded
    if (userProfile?.display_name) {
      setDisplayName(userProfile.display_name);
    }
  }, [userProfile]);

  useEffect(() => {
    // Fetch favorites data when tab changes
    const fetchFavoriteItems = async () => {
      if (!user) return;

      try {
        let entityType;
        switch (activeTab) {
          case 'artists':
            entityType = ENTITY_TYPES.ARTIST;
            break;
          case 'concerts':
            entityType = ENTITY_TYPES.CONCERT;
            break;
          case 'venues':
            entityType = ENTITY_TYPES.VENUE;
            break;
          case 'festivals':
            entityType = ENTITY_TYPES.FESTIVAL;
            break;
          default:
            return;
        }

        const items = await getFavoriteItems(entityType);
        setFavorites(prev => ({ ...prev, [activeTab]: items }));
      } catch (error) {
        console.error(`Error fetching favorite ${activeTab}:`, error);
      }
    };

    fetchFavoriteItems();
  }, [
    activeTab,
    user,
    getFavoriteItems,
    ENTITY_TYPES.ARTIST,
    ENTITY_TYPES.CONCERT,
    ENTITY_TYPES.VENUE,
    ENTITY_TYPES.FESTIVAL,
  ]);

  // Handle profile update submission
  const handleProfileUpdate = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const { error } = await updateProfile({
        display_name: displayName,
      });

      if (error) {
        setError(error);
        return;
      }

      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If no user is logged in, redirect to login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-center mb-6">Please log in to view your profile</h2>
        <Link
          to="/login"
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700"
          style={{
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Log in
        </Link>
      </div>
    );
  }

  // Tab content selector
  const renderTabContent = () => {
    const currentFavorites = favorites[activeTab];

    if (favoritesLoading) {
      return (
        <div className="flex justify-center py-8">
          <Spinner size="lg" color="primary" />
        </div>
      );
    }

    if (!currentFavorites?.length) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">No favorite {activeTab} yet.</p>
          <Link
            to={`/${activeTab}`}
            className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Browse {activeTab}
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {currentFavorites.map(item => (
          <Link key={item.id} to={`/${activeTab.slice(0, -1)}s/${item.id}`} className="block">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {item.image_url && (
                <div className="h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                {activeTab === 'concerts' && item.start_time && (
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(item.start_time).toLocaleDateString()}
                  </p>
                )}
                {activeTab === 'festivals' && item.start_date && (
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(item.start_date).toLocaleDateString()} -{' '}
                    {new Date(item.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Profile</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 h-11 w-11 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Log out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Profile section */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {editMode ? (
            <form onSubmit={handleProfileUpdate}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ minHeight: '44px' }}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-70"
                  style={{ minHeight: '44px' }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDisplayName(userProfile?.display_name || '');
                    setEditMode(false);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg"
                  style={{ minHeight: '44px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{userProfile?.display_name || 'User'}</h2>
                <button
                  onClick={() => setEditMode(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600">{user.email}</p>
            </div>
          )}
        </div>

        {/* Favorites section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 pt-4">
            <h2 className="text-lg font-semibold mb-4">My Favorites</h2>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b">
            {['artists', 'concerts', 'venues', 'festivals'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-1 font-medium text-sm text-center focus:outline-none ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ minHeight: '44px' }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
