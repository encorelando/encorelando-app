/**
 * Authentication utilities for EncoreLando
 *
 * Helper functions for checking authentication status and permissions.
 */

/**
 * Check if a user needs to log in before accessing a feature
 * Displays a prompt if they need to login
 *
 * @param {Object} user - Current user object from AuthContext
 * @param {Function} navigate - Navigate function from react-router-dom
 * @param {string} returnPath - Path to return to after login
 * @returns {boolean} - True if user can proceed, false if redirected to login
 */
export const requireAuth = (user, navigate, returnPath) => {
  if (!user) {
    // Navigate to login with return path
    navigate('/login', {
      state: { from: returnPath || window.location.pathname },
    });
    return false;
  }

  return true;
};

/**
 * Generate a display name from user information
 *
 * @param {Object} user - User object from auth provider
 * @param {Object} userProfile - User profile from database
 * @returns {string} - Display name to show in the UI
 */
export const getDisplayName = (user, userProfile) => {
  if (!user) return '';

  // First priority: profile display name
  if (userProfile?.display_name) {
    return userProfile.display_name;
  }

  // Second priority: user metadata name
  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }

  // Third priority: email username
  if (user.email) {
    return user.email.split('@')[0];
  }

  // Fallback
  return 'User';
};
