import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Card from '../../components/atoms/Card';
import IconButton from '../../components/atoms/IconButton';

/**
 * AdminDashboardPage
 *
 * Main hub for admin operations with links to manage different data types
 *
 * Mobile-first design features:
 * - Card-based navigation with large touch targets
 * - Bottom-positioned primary actions
 * - Simplified layout for small screens
 * - Uses vertical space efficiently for mobile scrolling
 */
const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const adminSections = [
    {
      title: 'Concerts',
      description: 'Manage concert listings, times, and details',
      link: '/admin/concerts',
      count: '•••',
      icon: '🎵',
    },
    {
      title: 'Artists',
      description: 'Manage artist profiles and information',
      link: '/admin/artists',
      count: '•••',
      icon: '🎤',
    },
    {
      title: 'Venues',
      description: 'Manage venue details and locations',
      link: '/admin/venues',
      count: '•••',
      icon: '🏟️',
    },
    {
      title: 'Festivals',
      description: 'Manage festival schedules and information',
      link: '/admin/festivals',
      count: '•••',
      icon: '🎪',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header with mobile-optimized touch targets */}
      <header className="bg-neutral-800 px-4 py-4 flex justify-between items-center shadow-lg">
        <div>
          <Typography variant="h1" className="text-xl font-bold">
            Admin Dashboard
          </Typography>
          <Typography variant="body2" className="text-light-gray">
            {user?.email}
          </Typography>
        </div>

        <IconButton
          icon="logout"
          ariaLabel="Log out"
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="ghost"
          className="min-h-touch min-w-touch"
        />
      </header>

      <main className="p-4">
        <section className="mb-8">
          <Typography variant="h2" className="text-lg font-semibold mb-4">
            Data Management
          </Typography>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {adminSections.map(section => (
              <Link to={section.link} key={section.title}>
                <Card className="h-full transition duration-300 hover:bg-neutral-700 active:bg-neutral-600">
                  <div className="flex justify-between items-start p-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{section.icon}</span>
                        <Typography variant="h3" className="text-lg font-medium">
                          {section.title}
                        </Typography>
                      </div>
                      <Typography variant="body2" className="text-light-gray">
                        {section.description}
                      </Typography>
                    </div>
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {section.count}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <Typography variant="h2" className="text-lg font-semibold mb-4">
            Quick Actions
          </Typography>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Button
              variant="primary"
              fullWidth
              className="min-h-touch"
              onClick={() => navigate('/admin/concerts/new')}
            >
              Add New Concert
            </Button>

            <Button
              variant="secondary"
              fullWidth
              className="min-h-touch"
              onClick={() => navigate('/admin/artists/new')}
            >
              Add New Artist
            </Button>
          </div>
        </section>
      </main>

      {/* Mobile-optimized bottom navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-800 p-4 shadow-lg">
        <Button variant="ghost" fullWidth onClick={() => navigate('/')} className="min-h-touch">
          View Public Site
        </Button>
      </footer>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
};

export default AdminDashboardPage;
