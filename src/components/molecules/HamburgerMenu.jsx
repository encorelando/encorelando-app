import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Avatar from '../atoms/Avatar';

/**
 * HamburgerMenu Component
 *
 * A mobile-optimized menu with navigation links and authentication options.
 *
 * Mobile-first design features:
 * - Touch-friendly menu items (min 44px height)
 * - Slide-in animation for natural mobile interaction
 * - Clear visual hierarchy
 * - Responsive layout works well on all device sizes
 */
const HamburgerMenu = ({ isOpen, onClose }) => {
  const { user, userProfile, logout, isAdmin } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Prevent scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      onClose(); // Close the menu
      navigate('/'); // Navigate to home page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Navigation links
  const navigationLinks = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Artists', path: '/artists', icon: 'music' },
    { name: 'Concerts', path: '/calendar', icon: 'calendar' },
    { name: 'Festivals', path: '/festivals', icon: 'star' },
    { name: 'Venues', path: '/venues', icon: 'map-pin' },
    { name: 'Search', path: '/search', icon: 'search' },
  ];

  // Admin dashboard link
  const adminLink = { name: 'Admin Dashboard', path: '/admin/dashboard', icon: 'settings' };

  // Authentication links
  const authLinks = user
    ? [
        { name: 'My Profile', path: '/profile', icon: 'user' },
        { name: 'Log Out', action: handleLogout, icon: 'log-out' },
      ]
    : [
        { name: 'Log In', path: '/login', icon: 'log-in' },
        { name: 'Sign Up', path: '/signup', icon: 'user-plus' },
      ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-80 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[80vw] bg-neutral-900 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <Typography variant="h2" className="text-xl font-bold" id="menu-heading">
              Menu
            </Typography>
            <button
              onClick={onClose}
              className="h-11 w-11 rounded-full flex items-center justify-center text-white hover:bg-neutral-700 focus:outline-none"
              aria-label="Close menu"
            >
              <Icon name="x" size="md" />
            </button>
          </div>
        </div>

        {/* User profile (if logged in) */}
        {user && (
          <div className="px-6 py-4 border-b border-neutral-700">
            <div className="flex items-center">
              <Avatar
                src={userProfile?.avatar_url}
                alt={userProfile?.display_name || 'User'}
                fallback={userProfile?.display_name?.[0] || user.email[0]?.toUpperCase()}
                size="md"
                className="mr-3"
              />
              <div>
                <Typography variant="h3" className="text-lg font-medium">
                  {userProfile?.display_name || user.email.split('@')[0]}
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  {user.email}
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="mt-2">
          <ul>
            {navigationLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="flex items-center px-6 py-3 text-white hover:bg-neutral-700 transition-colors"
                  onClick={onClose}
                  style={{ minHeight: '44px' }}
                >
                  <Icon name={link.icon} size="sm" className="mr-3" />
                  <Typography variant="body1">{link.name}</Typography>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin link (if user is admin) */}
        {user && isAdmin() && (
          <div className="mt-4 border-t border-neutral-700 pt-2">
            <ul>
              <li>
                <Link
                  to={adminLink.path}
                  className="flex items-center px-6 py-3 text-white hover:bg-neutral-700 transition-colors"
                  onClick={onClose}
                  style={{ minHeight: '44px' }}
                >
                  <Icon name={adminLink.icon} size="sm" className="mr-3" />
                  <Typography variant="body1">{adminLink.name}</Typography>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Authentication links */}
        <div className="mt-auto border-t border-neutral-700 pt-2">
          <ul>
            {authLinks.map(link => (
              <li key={link.name}>
                {link.path ? (
                  <Link
                    to={link.path}
                    className="flex items-center px-6 py-3 text-white hover:bg-neutral-700 transition-colors"
                    onClick={onClose}
                    style={{ minHeight: '44px' }}
                  >
                    <Icon name={link.icon} size="sm" className="mr-3" />
                    <Typography variant="body1">{link.name}</Typography>
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    disabled={loggingOut}
                    className="flex items-center w-full px-6 py-3 text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    style={{ minHeight: '44px' }}
                  >
                    <Icon name={link.icon} size="sm" className="mr-3" />
                    <Typography variant="body1">
                      {loggingOut ? 'Logging out...' : link.name}
                    </Typography>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer with app version */}
        <div className="px-6 py-4 text-center">
          <Typography variant="caption" className="text-gray-400">
            EncoreLando v1.0
          </Typography>
        </div>
      </div>
    </>
  );
};
HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HamburgerMenu;
