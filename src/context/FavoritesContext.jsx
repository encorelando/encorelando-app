import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import supabase from '../services/supabase';
import { useAuth } from './AuthContext';

/**
 * Favorites Context for EncoreLando
 *
 * This context provides functionality for users to favorite and unfavorite
 * various entities (concerts, artists, venues, festivals) and retrieve
 * their favorite items.
 *
 * Mobile-first design considerations:
 * - Optimized for minimal network requests
 * - Batch operations where possible
 * - Local state management for immediate UI feedback
 * - Efficient data fetching patterns
 */

// Create the context
const FavoritesContext = createContext();

// Custom hook for using the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Entity types for favorites
const ENTITY_TYPES = {
  CONCERT: 'concerts',
  ARTIST: 'artists',
  VENUE: 'venues',
  FESTIVAL: 'festivals',
};

// Favorites provider component
export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState({
    [ENTITY_TYPES.CONCERT]: [],
    [ENTITY_TYPES.ARTIST]: [],
    [ENTITY_TYPES.VENUE]: [],
    [ENTITY_TYPES.FESTIVAL]: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites({
        [ENTITY_TYPES.CONCERT]: [],
        [ENTITY_TYPES.ARTIST]: [],
        [ENTITY_TYPES.VENUE]: [],
        [ENTITY_TYPES.FESTIVAL]: [],
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all types of favorites in parallel
      const [concertsRes, artistsRes, venuesRes, festivalsRes] = await Promise.all([
        supabase.from('favorites_concerts').select('concert_id').eq('user_id', user.id),
        supabase.from('favorites_artists').select('artist_id').eq('user_id', user.id),
        supabase.from('favorites_venues').select('venue_id').eq('user_id', user.id),
        supabase.from('favorites_festivals').select('festival_id').eq('user_id', user.id),
      ]);

      // Check for errors
      if (concertsRes.error) throw concertsRes.error;
      if (artistsRes.error) throw artistsRes.error;
      if (venuesRes.error) throw venuesRes.error;
      if (festivalsRes.error) throw festivalsRes.error;

      // Update favorites state
      setFavorites({
        [ENTITY_TYPES.CONCERT]: concertsRes.data.map(item => item.concert_id),
        [ENTITY_TYPES.ARTIST]: artistsRes.data.map(item => item.artist_id),
        [ENTITY_TYPES.VENUE]: venuesRes.data.map(item => item.venue_id),
        [ENTITY_TYPES.FESTIVAL]: festivalsRes.data.map(item => item.festival_id),
      });
    } catch (error) {
      console.error('Error fetching favorites:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch favorites when user changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if an entity is favorited
  const isFavorite = useCallback(
    (entityType, entityId) => {
      if (!user || !favorites[entityType]) return false;
      return favorites[entityType].includes(entityId);
    },
    [user, favorites]
  );

  // Toggle favorite status for an entity
  const toggleFavorite = useCallback(
    async (entityType, entityId) => {
      if (!user) return { error: 'User not authenticated' };

      try {
        setError(null);
        const tableName = `favorites_${entityType}`;
        const idColumn = `${entityType.slice(0, -1)}_id`; // Remove 's' to get singular form

        // Check if already favorited
        const isFav = isFavorite(entityType, entityId);

        // Optimistically update UI
        setFavorites(prev => ({
          ...prev,
          [entityType]: isFav
            ? prev[entityType].filter(id => id !== entityId)
            : [...prev[entityType], entityId],
        }));

        // Perform database operation
        if (isFav) {
          // Remove from favorites
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('user_id', user.id)
            .eq(idColumn, entityId);

          if (error) throw error;
        } else {
          // Add to favorites
          const { error } = await supabase.from(tableName).insert({
            user_id: user.id,
            [idColumn]: entityId,
          });

          if (error) throw error;
        }

        return { success: true };
      } catch (error) {
        console.error(`Error toggling ${entityType} favorite:`, error.message);
        setError(error.message);

        // Revert the optimistic update
        fetchFavorites();
        return { error: error.message };
      }
    },
    [user, isFavorite, fetchFavorites]
  );

  // Fetch detailed data for favorites
  const getFavoriteItems = useCallback(
    async entityType => {
      if (!user || !favorites[entityType]?.length) return [];

      try {
        setError(null);

        // For concerts, join with artists table to get artist name
        if (entityType === ENTITY_TYPES.CONCERT) {
          const { data, error } = await supabase
            .from(entityType)
            .select(
              `
              *,
              artist:artist_id (
                id,
                name
              )
            `
            )
            .in('id', favorites[entityType]);

          if (error) throw error;
          return data;
        } else {
          // For other entity types, use the regular query
          const { data, error } = await supabase
            .from(entityType)
            .select('*')
            .in('id', favorites[entityType]);

          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error(`Error fetching favorite ${entityType}:`, error.message);
        setError(error.message);
        return [];
      }
    },
    [user, favorites]
  );

  // Value object for the context
  const value = {
    favorites,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    getFavoriteItems,
    ENTITY_TYPES,
    refreshFavorites: fetchFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FavoritesContext;
