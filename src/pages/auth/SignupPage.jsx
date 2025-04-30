import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * SignupPage Component
 *
 * Provides a user-friendly mobile-optimized signup form for new users.
 * Uses inline styles to ensure consistent appearance regardless of theme.
 *
 * Mobile-first design features:
 * - Touch-friendly input fields (minimum 44px height)
 * - Single column layout optimized for narrow screens
 * - Visible form validation with clear error messages
 * - Large, easy-to-tap submit button
 * - Simplified form with minimal required fields
 */
const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation (at least 8 characters)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call signup method from AuthContext
      await signup(email, password, displayName);

      // Redirect to home page after successful signup
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);

      // Handle specific auth errors with user-friendly messages
      if (error.message?.includes('email already in use')) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(error.message || 'An error occurred during signup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Use explicit styles to prevent color inheritance issues
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb',
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1rem 1rem',
      color: '#111827',
    },
    headerInner: {
      display: 'flex',
      alignItems: 'center',
    },
    backButton: {
      marginRight: '1rem',
      height: '2.75rem',
      width: '2.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      color: '#4b5563',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#111827',
    },
    main: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      maxWidth: '28rem',
      margin: '0 auto',
      width: '100%',
      backgroundColor: 'white',
      color: '#111827',
    },
    headingContainer: {
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    heading: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#111827',
    },
    subheading: {
      marginTop: '0.5rem',
      color: '#4b5563',
    },
    error: {
      marginBottom: '1rem',
      padding: '0.75rem',
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#b91c1c',
      borderRadius: '0.375rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
      color: '#374151',
    },
    required: {
      color: '#ef4444',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      minHeight: '44px',
      fontSize: '1rem',
      color: '#111827',
      backgroundColor: 'white',
    },
    button: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.75rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      minHeight: '48px',
      border: 'none',
      cursor: 'pointer',
    },
    buttonDisabled: {
      opacity: '0.7',
      cursor: 'not-allowed',
    },
    loginContainer: {
      marginTop: '1rem',
      textAlign: 'center',
    },
    loginText: {
      color: '#4b5563',
    },
    loginLink: {
      color: '#2563eb',
      fontWeight: '500',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header with back button for mobile */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <button onClick={() => navigate(-1)} style={styles.backButton} aria-label="Go back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 style={styles.headerTitle}>Create Account</h1>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        <div style={styles.headingContainer}>
          <h2 style={styles.heading}>Join EncoreLando</h2>
          <p style={styles.subheading}>Track your favorite artists and never miss a concert</p>
        </div>

        {/* Error display */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Signup form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Display name field */}
          <div>
            <label htmlFor="displayName" style={styles.label}>
              Name (optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              style={styles.input}
              placeholder="Your name"
            />
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" style={styles.label}>
              Email <span style={styles.required}>*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your.email@example.com"
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" style={styles.label}>
              Password <span style={styles.required}>*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Create a password (8+ characters)"
              minLength={8}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          {/* Login link */}
          <div style={styles.loginContainer}>
            <p style={styles.loginText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.loginLink}>
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
