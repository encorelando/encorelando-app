import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';

/**
 * AdminLoginPage
 *
 * Provides authentication for admin users
 * Follows mobile-first design principles with:
 * - Touch-friendly input fields
 * - Accessible error messages
 * - Simple, focused layout for mobile screens
 * - Visible feedback during loading states
 */
const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to admin dashboard
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async e => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      // Attempt login
      await login(email, password);

      // Navigate to previous protected route or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error.message);
      // Display user-friendly error message
      setFormError(
        error.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : 'Login failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-900">
      <div className="w-full max-w-md px-6 py-8 bg-neutral-800 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <Typography variant="h1" className="text-2xl font-bold text-white mb-2">
            EncoreLando Admin
          </Typography>
          <Typography variant="body1" className="text-light-gray">
            Enter your credentials to access the admin portal
          </Typography>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-md">
            <Typography variant="body1" className="text-error">
              {formError}
            </Typography>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@encorelando.com"
              required
              disabled={isSubmitting}
              fullWidth
              autoComplete="email"
              className="bg-white text-black placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              fullWidth
              autoComplete="current-password"
              className="bg-white text-black placeholder-gray-500"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
            className="min-h-touch"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
