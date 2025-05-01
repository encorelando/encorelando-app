import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandButton from '../../components/atoms/BrandButton';
import BrandHeading from '../../components/atoms/BrandHeading';
import { BrandLogo } from '../../components/branding';
import BrandCard from '../../components/atoms/BrandCard';

/**
 * SignupPage Component
 *
 * Provides a user-friendly mobile-optimized signup form for new users.
 * Updated to follow EncoreLando branding guidelines.
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
      const result = await signup(email, password, displayName);

      // Check if email confirmation is needed
      if (result && result.needsEmailConfirmation) {
        // Show success message instead of redirecting
        navigate('/signup-confirmation', {
          replace: true,
          state: { email },
        });
      } else {
        // Redirect to home page after successful signup
        navigate('/', { replace: true });
      }
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

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header with back button for mobile */}
      <div className="bg-background border-b border-white border-opacity-10 p-md">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-md h-11 w-11 flex items-center justify-center rounded-full text-white hover:bg-white hover:bg-opacity-10"
            aria-label="Go back"
          >
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
          <BrandHeading level={3}>Create Account</BrandHeading>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-md max-w-md mx-auto w-full">
        <div className="mb-xl text-center">
          <BrandLogo variant="white" size="md" className="mb-md" />

          <BrandHeading level={2} className="mb-xs">
            Join EncoreLando
          </BrandHeading>
          <p className="font-manrope text-white text-opacity-90">
            Track your favorite artists and never miss a concert
          </p>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-md p-sm bg-error bg-opacity-10 border border-error border-opacity-20 text-error rounded">
            {error}
          </div>
        )}

        {/* Signup form */}
        <BrandCard className="mb-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            {/* Display name field */}
            <div>
              <label
                htmlFor="displayName"
                className="block font-manrope text-sm font-medium text-white mb-xxs"
              >
                Name (optional)
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

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block font-manrope text-sm font-medium text-white mb-xxs"
              >
                Email <span className="text-error">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-md py-xs bg-white bg-opacity-10 border border-white border-opacity-10 rounded focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange min-h-touch text-white font-manrope"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block font-manrope text-sm font-medium text-white mb-xxs"
              >
                Password <span className="text-error">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-md py-xs bg-white bg-opacity-10 border border-white border-opacity-10 rounded focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange min-h-touch text-white font-manrope"
                placeholder="Create a password (8+ characters)"
                minLength={8}
              />
            </div>

            {/* Submit button */}
            <BrandButton type="submit" variant="gradient" fullWidth disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </BrandButton>
          </form>
        </BrandCard>

        {/* Login link */}
        <div className="text-center">
          <p className="font-manrope text-white text-opacity-70">
            Already have an account?{' '}
            <Link to="/login" className="text-sunset-orange hover:text-magenta-pink font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
