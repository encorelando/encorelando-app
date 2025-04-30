import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * FavoriteButton Component
 *
 * A mobile-optimized favorite/like button that allows users to save
 * items to their favorites. Automatically redirects to login if not authenticated.
 *
 * Mobile-first considerations:
 * - Touch-friendly size (minimum 44x44px)
 * - Instant visual feedback
 * - Minimal network requests
 * - Clear visual states
 */
const FavoriteButton = ({ entityType, entityId, size = 'md', className = '' }) => {
  const { isFavorite, toggleFavorite, ENTITY_TYPES } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Map entity type string to context constant
  const getEntityTypeValue = type => {
    switch (type.toLowerCase()) {
      case 'artist':
        return ENTITY_TYPES.ARTIST;
      case 'concert':
        return ENTITY_TYPES.CONCERT;
      case 'venue':
        return ENTITY_TYPES.VENUE;
      case 'festival':
        return ENTITY_TYPES.FESTIVAL;
      default:
        console.error(`Invalid entity type: ${type}`);
        return null;
    }
  };

  const entityTypeValue = getEntityTypeValue(entityType);

  // Check if item is favorited
  useEffect(() => {
    if (user && entityTypeValue && entityId) {
      setIsFav(isFavorite(entityTypeValue, entityId));
    }
  }, [user, entityTypeValue, entityId, isFavorite]);

  // Toggle favorite status
  const handleToggleFavorite = async e => {
    e.preventDefault();
    e.stopPropagation();

    // If not authenticated, redirect to login
    if (!user) {
      navigate('/login', {
        state: { from: window.location.pathname },
      });
      return;
    }

    if (!entityTypeValue || !entityId) return;

    try {
      setIsLoading(true);
      await toggleFavorite(entityTypeValue, entityId);

      // Update local state (redundant since context handles this, but provides instant UI feedback)
      setIsFav(!isFav);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Size variants
  const sizeStyles = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  // Icon sizes
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      className={`rounded-full flex items-center justify-center focus:outline-none ${
        isFav
          ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200'
      } ${sizeStyles[size]} ${className}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      {isLoading ? (
        <svg
          className={`animate-spin ${iconSizes[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className={iconSizes[size]}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFav ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      )}
    </button>
  );
};

FavoriteButton.propTypes = {
  entityType: PropTypes.oneOf(['artist', 'concert', 'venue', 'festival']).isRequired,
  entityId: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default FavoriteButton;
