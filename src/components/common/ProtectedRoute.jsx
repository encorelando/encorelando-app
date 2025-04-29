import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../atoms/Spinner';

/**
 * ProtectedRoute Component
 *
 * Restricts access to admin routes for unauthorized users
 * Follows mobile-first design by handling loading states efficiently
 * and maintaining a smooth user experience on mobile devices.
 */
const ProtectedRoute = ({ children, adminOnly = true }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin, redirect to home
  if (adminOnly && !isAdmin()) {
    console.log('User is not admin, redirecting to home page.');
    return <Navigate to="/" replace />;
  }

  // If authenticated and authorized, render the protected route
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
