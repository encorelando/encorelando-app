import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import Spinner from '../components/atoms/Spinner';
import BrandButton from '../components/atoms/BrandButton';
import BrandHeading from '../components/atoms/BrandHeading';
import BrandCard from '../components/atoms/BrandCard';
import PageLayout from '../components/templates/PageLayout';

/**
 * ProfilePage Component
 *
 * User profile page that displays user information and favorites.
 * Mobile-first design with touch-friendly elements and optimized layout.
 * Updated to match the EncoreLando branding guidelines.
 * Uses standard PageLayout for consistent header and navigation.
 */
const ProfilePage = () => {
  const { user, userProfile, updateProfile } = useAuth();
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

  // If no user is logged in, redirect to login
  if (!user) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center p-md">
          <BrandHeading level={2} className="mb-lg" align="center">
            Please log in to view your profile
          </BrandHeading>
          <BrandButton variant="primary" onClick={() => navigate('/login')}>
            Log in
          </BrandButton>
        </div>
      </PageLayout>
    );
  }

  // Tab content selector
  const renderTabContent = () => {
    const currentFavorites = favorites[activeTab];

    if (favoritesLoading) {
      return (
        <div className="flex justify-center py-lg">
          <Spinner size="lg" color="sunset-orange" />
        </div>
      );
    }

    if (!currentFavorites?.length) {
      return (
        <div className="py-lg text-center">
          <p className="font-manrope text-white text-opacity-70 mb-md">
            No favorite {activeTab} yet.
          </p>
          <BrandButton variant="secondary" onClick={() => navigate(`/${activeTab}`)}>
            Browse {activeTab}
          </BrandButton>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md mt-md">
        {currentFavorites.map(item => (
          <Link key={item.id} to={`/${activeTab.slice(0, -1)}/${item.id}`} className="block">
            <BrandCard variant="interactive">
              {item.image_url && (
                <div className="h-40 bg-white bg-opacity-5 overflow-hidden rounded">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-md">
                <h3 className="font-poppins font-semibold text-lg truncate text-white">
                  {item.name}
                </h3>
                {activeTab === 'concerts' && item.start_time && (
                  <p className="text-sm font-manrope text-white text-opacity-70 mt-xs">
                    {new Date(item.start_time).toLocaleDateString()}
                  </p>
                )}
                {activeTab === 'festivals' && item.start_date && (
                  <p className="text-sm font-manrope text-white text-opacity-70 mt-xs">
                    {new Date(item.start_date).toLocaleDateString()} -{' '}
                    {new Date(item.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </BrandCard>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <PageLayout>
      {/* Profile header with logout */}
      <div className="flex items-center justify-between px-md py-md">
        <BrandHeading level={3}>My Profile</BrandHeading>
      </div>

      {/* Profile section */}
      <div className="p-md">
        <BrandCard className="mb-lg">
          {editMode ? (
            <form onSubmit={handleProfileUpdate}>
              {error && (
                <div className="mb-md p-sm bg-error bg-opacity-10 border border-error border-opacity-20 text-error rounded">
                  {error}
                </div>
              )}

              <div className="mb-md">
                <label
                  htmlFor="displayName"
                  className="block font-manrope text-sm font-medium text-white mb-xxs"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-md py-xs bg-white bg-opacity-10 border border-white border-opacity-10 rounded focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange min-h-touch text-white font-manrope"
                  placeholder="Your name"
                />
              </div>

              <div className="flex space-x-sm">
                <BrandButton type="submit" variant="primary" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : 'Save Changes'}
                </BrandButton>
                <BrandButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setDisplayName(userProfile?.display_name || '');
                    setEditMode(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </BrandButton>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-xs">
                <BrandHeading level={4}>{userProfile?.display_name || 'User'}</BrandHeading>
                <button
                  onClick={() => setEditMode(true)}
                  className="text-sunset-orange hover:text-magenta-pink text-sm font-medium h-10 w-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
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
              <p className="font-manrope text-white text-opacity-70">{user.email}</p>
            </div>
          )}
        </BrandCard>

        {/* Favorites section */}
        <BrandCard className="overflow-hidden">
          <div className="px-md pt-md">
            <BrandHeading level={4} className="mb-md">
              My Favorites
            </BrandHeading>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-white border-opacity-10">
            {['artists', 'concerts', 'venues', 'festivals'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-sm px-xxs font-medium text-sm text-center focus:outline-none min-h-touch font-manrope ${
                  activeTab === tab
                    ? 'text-sunset-orange border-b-2 border-sunset-orange'
                    : 'text-white text-opacity-70 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-md">{renderTabContent()}</div>
        </BrandCard>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
