/**
 * Token Storage Utility
 *
 * Handles secure token storage with consistent error handling
 * and follows mobile-first design principles by focusing on
 * lightweight implementation and offline capabilities.
 */

// Constants for storage keys
export const TOKEN_KEY = 'encorelando_auth_token';
export const USER_KEY = 'encorelando_user';

/**
 * Store authentication token securely
 * @param {string} token - JWT token from authentication
 */
export const storeToken = token => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store authentication token:', error);
  }
};

/**
 * Get stored authentication token
 * @returns {string|null} The stored token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve authentication token:', error);
    return null;
  }
};

/**
 * Remove authentication token (logout)
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove authentication token:', error);
  }
};

/**
 * Store user data
 * @param {Object} user - User data object
 */
export const storeUser = user => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
};

/**
 * Get stored user data
 * @returns {Object|null} The stored user object or null if not found
 */
export const getUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    return null;
  }
};

/**
 * Remove user data (logout)
 */
export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove user data:', error);
  }
};

/**
 * Clear all authentication data (complete logout)
 */
export const clearAuthData = () => {
  removeToken();
  removeUser();
};
