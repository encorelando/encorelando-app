import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import apiClient from '../services/apiClient';
import { getToken, storeToken, getUser, storeUser, clearAuthData } from '../utils/tokenStorage';

/**
 * Authentication Context for EncoreLando
 *
 * Provides authentication state and functions throughout the application.
 * Simplified implementation focused on reliability, especially across page refreshes.
 *
 * Mobile-first design considerations:
 * - Minimizes re-renders to maintain performance on mobile devices
 * - Uses localStorage for session persistence to support offline patterns
 * - Simple API to reduce bundle size
 * - Handles authentication across page reloads reliably
 */

// Create the context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Try to get token and user from storage first
        const storedToken = getToken();
        const storedUser = getUser();

        if (storedToken && storedUser) {
          // We have stored credentials, verify they are still valid
          try {
            // Verify the session with Supabase
            const session = await apiClient.getSession();

            if (session) {
              // Session is valid, update state
              setUser(storedUser);

              // Fetch user profile data
              const profile = await fetchUserProfile(storedUser.id);
              setUserProfile(profile);
            } else {
              // Session is invalid, clear storage
              clearAuthData();
            }
          } catch (err) {
            console.error('Session verification failed:', err);
            clearAuthData();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Authentication initialization failed. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Add event listener for logout events from other tabs/components
    const handleLogout = () => {
      setUser(null);
      setUserProfile(null);
    };

    window.addEventListener('auth:logout', handleLogout);

    // Cleanup
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Fetch user profile data from the database
  const fetchUserProfile = async userId => {
    if (!userId) return null;

    try {
      const profile = await apiClient.getById('user_profiles', userId);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create a user profile in the database
  const createUserProfile = async user => {
    if (!user) return null;

    try {
      const newProfile = {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.name || user.email.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || null,
      };

      const profile = await apiClient.create('user_profiles', newProfile);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async profileData => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const updatedProfile = await apiClient.update('user_profiles', user.id, profileData);
      setUserProfile(updatedProfile);
      return { data: updatedProfile };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error.message };
    }
  };

  // Signup with email and password
  const signup = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);

      // Register the user
      const authData = await apiClient.signup(email, password, {
        name: displayName || email.split('@')[0],
      });

      if (authData.user) {
        // Check if session exists (it won't if email confirmation is required)
        if (authData.session) {
          // Store authentication data
          storeToken(authData.session.access_token);
          storeUser(authData.user);

          // Update state
          setUser(authData.user);

          // Create user profile
          await createUserProfile(authData.user);

          return authData;
        } else {
          // Email confirmation is required
          return { user: authData.user, needsEmailConfirmation: true };
        }
      }

      return authData;
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const authData = await apiClient.login(email, password);

      if (authData.user) {
        // Store authentication data
        storeToken(authData.session.access_token);
        storeUser(authData.user);

        // Update state
        setUser(authData.user);

        // Fetch user profile
        const profile = await fetchUserProfile(authData.user.id);
        setUserProfile(profile);

        // Create profile if it doesn't exist
        if (!profile) {
          await createUserProfile(authData.user);
        }
      }

      return authData;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.logout();

      // Clear local state
      setUser(null);
      setUserProfile(null);

      // Clear stored auth data
      clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);

      // Force clear even on error
      clearAuthData();
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    if (!user) return false;

    // Check if roles array contains 'admin'
    if (userProfile?.roles && Array.isArray(userProfile.roles)) {
      return userProfile.roles.includes('admin');
    }

    // Fallback to email check for backward compatibility
    return user.email === 'encorelandoapp@gmail.com';
  };

  // Check if user has a specific role
  const hasRole = role => {
    if (!user || !userProfile?.roles || !Array.isArray(userProfile.roles)) {
      return false;
    }

    return userProfile.roles.includes(role);
  };

  // Provide auth context value
  const value = {
    user,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    isAdmin,
    hasRole,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
