import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import supabase from '../services/supabase';

/**
 * Authentication Context for EncoreLando
 *
 * This context provides authentication state and functions throughout
 * the application. It handles user session state, login, signup, logout,
 * and session persistence for both regular users and admins.
 *
 * Mobile-first design considerations:
 * - Minimizes re-renders to maintain performance on mobile devices
 * - Uses localStorage for session persistence to support offline patterns
 * - Simple API to reduce bundle size
 * - Optimized for touch interactions on mobile devices
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile data from the database
  const fetchUserProfile = async userId => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error.message);
      return null;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        // Get the current session from Supabase
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          setUser(data.session.user);

          // Fetch user profile data
          const profile = await fetchUserProfile(data.session.user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error checking session:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        console.log('Auth state change:', event, session.user);
        setUser(session.user);

        // Fetch user profile on sign in
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);

        // Create user profile if it doesn't exist (new signup)
        if (!profile && event === 'SIGNED_IN') {
          await createUserProfile(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setUserProfile(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Create a user profile in the database
  const createUserProfile = async user => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.name || user.email.split('@')[0], // Default to username from email
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error in createUserProfile:', error.message);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async profileData => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
      return { data };
    } catch (error) {
      console.error('Error updating profile:', error.message);
      return { error: error.message };
    }
  };

  // Signup with email and password
  const signup = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);

      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName || email.split('@')[0], // Use display name or extract username from email
          },
        },
      });

      if (error) {
        throw error;
      }

      setUser(data.user);

      // User profile will be created by the onAuthStateChange handler

      return data;
    } catch (error) {
      console.error('Signup error:', error.message);
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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setUser(data.user);

      // Fetch user profile
      const profile = await fetchUserProfile(data.user.id);
      setUserProfile(profile);

      return data;
    } catch (error) {
      console.error('Login error:', error.message);
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

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error.message);
      setError(error.message);
      throw error;
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
