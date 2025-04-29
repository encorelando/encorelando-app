import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';
import Button from '../atoms/Button';

/**
 * AdminLayout template for admin pages
 *
 * Mobile-first design features:
 * - Collapsible sidebar on mobile
 * - Bottom navigation for common actions
 * - Fixed header with navigation toggle
 * - Responsive content area
 * - Touch-friendly navigation targets
 */
const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items for admin section
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Concerts', path: '/admin/concerts', icon: '🎵' },
    { label: 'Artists', path: '/admin/artists', icon: '🎤' },
    { label: 'Venues', path: '/admin/venues', icon: '🏟️' },
    { label: 'Festivals', path: '/admin/festivals', icon: '🎪' },
  ];

  // Determine if a nav item is active
  const isActive = path => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Mobile header - fixed position for easy access */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-neutral-800 px-4 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <IconButton
            icon="menu"
            ariaLabel="Toggle menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            className="mr-3 min-h-touch min-w-touch md:hidden"
          />
          <Typography variant="h1" className="text-xl font-bold truncate">
            {title || 'Admin'}
          </Typography>
        </div>

        <div className="flex">
          <IconButton
            icon="home"
            ariaLabel="Public site"
            onClick={() => navigate('/')}
            variant="ghost"
            className="min-h-touch min-w-touch mr-2"
          />
          <IconButton
            icon="logout"
            ariaLabel="Log out"
            onClick={handleLogout}
            variant="ghost"
            className="min-h-touch min-w-touch"
          />
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation - slide in on mobile, fixed on desktop */}
      <nav
        className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-neutral-800 transition-transform transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:pt-16`}
      >
        <div className="py-6 h-full flex flex-col">
          <div className="px-4 mb-4 md:hidden">
            <Typography variant="h2" className="text-lg font-bold">
              EncoreLando Admin
            </Typography>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul>
              {navItems.map(item => (
                <li key={item.path} className="mb-1">
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-base ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-neutral-700'
                    } transition-colors`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-2 border-t border-neutral-700 md:hidden">
            <Button onClick={handleLogout} variant="ghost" fullWidth className="min-h-touch">
              Log Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content area - pushed down by header height and right by sidebar width on desktop */}
      <main className="pt-16 md:pl-64 min-h-screen">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default AdminLayout;
