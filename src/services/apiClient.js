/**
 * API Client
 *
 * Centralized API client with authentication handling and
 * optimized for mobile-first experience with proper error handling.
 */
import { getToken, clearAuthData } from '../utils/tokenStorage';
import supabase from './supabase';

/**
 * API Client class with built-in authentication and error handling
 */
class ApiClient {
  /**
   * Initialize the API client
   */
  constructor() {
    this.supabase = supabase;
    this.isRefreshing = false;
    this.listeners = [];
  }

  /**
   * Get the current auth token
   * @returns {string|null} Current auth token or null
   */
  getAuthToken() {
    return getToken();
  }

  /**
   * Add auth headers to a request options object
   * @param {Object} options - Request options
   * @returns {Object} Options with auth headers added
   */
  addAuthHeaders(options = {}) {
    const token = this.getAuthToken();
    if (!token) return options;

    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Handle authentication errors
   * @param {Error} error - Error object from request
   */
  handleAuthError(error) {
    // Check if this is an auth error (401 Unauthorized)
    if (error.status === 401 || error.statusCode === 401) {
      console.warn('Authentication error detected, logging out');
      clearAuthData();
      // Dispatch an event to notify app that auth has been cleared
      window.dispatchEvent(new Event('auth:logout'));
    }
  }

  /**
   * Perform authenticated operations with Supabase
   * @param {Function} operation - Function that performs Supabase operation
   * @returns {Promise<any>} Result of the operation
   */
  async authenticatedOperation(operation) {
    try {
      const result = await operation();

      // Handle Supabase error format
      if (result.error) {
        this.handleAuthError(result.error);
        throw result.error;
      }

      return result.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get data with authentication
   * @param {string} path - Table path
   * @param {Object} options - Query options
   * @returns {Promise<any>} Result data
   */
  async get(path, options = {}) {
    return this.authenticatedOperation(() => {
      let query = this.supabase.from(path).select(options.select || '*');

      // Apply filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply order
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      // Apply range for pagination
      if (options.range) {
        query = query.range(options.range[0], options.range[1]);
      }

      return query;
    });
  }

  /**
   * Get a single item by ID
   * @param {string} path - Table path
   * @param {string} id - Item ID
   * @param {Object} options - Query options
   * @returns {Promise<any>} Result item
   */
  async getById(path, id, options = {}) {
    return this.authenticatedOperation(() => {
      let query = this.supabase
        .from(path)
        .select(options.select || '*')
        .eq('id', id)
        .single();

      return query;
    });
  }

  /**
   * Create a new item
   * @param {string} path - Table path
   * @param {Object} data - Data to create
   * @returns {Promise<any>} Created item
   */
  async create(path, data) {
    return this.authenticatedOperation(() => {
      return this.supabase.from(path).insert(data).select().single();
    });
  }

  /**
   * Update an existing item
   * @param {string} path - Table path
   * @param {string} id - Item ID
   * @param {Object} data - Data to update
   * @returns {Promise<any>} Updated item
   */
  async update(path, id, data) {
    return this.authenticatedOperation(() => {
      return this.supabase.from(path).update(data).eq('id', id).select().single();
    });
  }

  /**
   * Delete an item
   * @param {string} path - Table path
   * @param {string} id - Item ID
   * @returns {Promise<any>} Result of delete operation
   */
  async delete(path, id) {
    return this.authenticatedOperation(() => {
      return this.supabase.from(path).delete().eq('id', id);
    });
  }

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result
   */
  async login(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user metadata
   * @returns {Promise<Object>} Signup result
   */
  async signup(email, password, metadata = {}) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get the current session
   * @returns {Promise<Object|null>} Current session or null
   */
  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Get the current user
   * @returns {Promise<Object|null>} Current user or null
   */
  async getCurrentUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
