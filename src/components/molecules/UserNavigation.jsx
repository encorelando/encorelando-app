import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';

/**
 * UserNavigation Component
 *
 * Displays login/signup links or user profile based on authentication status.
 *
 * Mobile-first design features:
 * - Touch-friendly buttons and targets
 * - Simple and clear visual cues
 * - Space-efficient layout
 */
const UserNavigation = () => {
  const { user, userProfile } = useAuth();

  return (
    <div className="flex items-center">
      {user ? (
        // Logged in state
        <Link to="/profile" className="inline-flex items-center">
          <Avatar
            src={userProfile?.avatar_url}
            alt={userProfile?.display_name || 'User'}
            size="sm"
            fallback={userProfile?.display_name?.[0] || user.email[0]?.toUpperCase()}
            className="border-2 border-white"
          />
        </Link>
      ) : (
        // Logged out state
        <div className="flex items-center">
          <Link to="/login">
            <Button variant="outline" size="sm" className="mr-2 hidden sm:inline-flex">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">
              Sign up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserNavigation;
