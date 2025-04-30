import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';
import Badge from '../../components/atoms/Badge';

/**
 * UserManagementPage
 *
 * Admin interface for managing user roles
 *
 * Mobile-first design features:
 * - Responsive design for all screen sizes
 * - Touch-friendly controls
 * - Optimized for quick role management
 */
const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Fetch user profiles from the database
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if admin
    if (isAdmin()) {
      fetchUsers();
    } else {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Toggle admin role for a user
  const toggleAdminRole = async (userId, currentRoles) => {
    try {
      // Check if user already has admin role
      const hasAdminRole = Array.isArray(currentRoles) && currentRoles.includes('admin');

      // Create new roles array
      let newRoles;
      if (hasAdminRole) {
        // Remove admin role
        newRoles = Array.isArray(currentRoles) ? currentRoles.filter(r => r !== 'admin') : [];
      } else {
        // Add admin role
        newRoles = Array.isArray(currentRoles) ? [...currentRoles, 'admin'] : ['admin'];
      }

      // Update user in database
      const { error } = await supabase
        .from('user_profiles')
        .update({ roles: newRoles })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => (user.id === userId ? { ...user, roles: newRoles } : user)));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Typography variant="h1" className="mb-2">
          User Management
        </Typography>
        <Typography variant="body1" color="medium-gray">
          Manage user roles for EncoreLando
        </Typography>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')} className="mr-2">
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <Typography variant="h2" className="text-lg">
            Users ({users.length})
          </Typography>
        </div>

        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.id} className="p-4">
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Typography variant="h3" className="mb-1">
                      {user.display_name || 'Unnamed User'}
                    </Typography>
                    <Typography variant="body2" className="mb-2">
                      {user.email}
                    </Typography>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Array.isArray(user.roles) &&
                        user.roles.map(role => (
                          <Badge
                            key={role}
                            text={role}
                            variant={role === 'admin' ? 'primary' : 'outline'}
                          />
                        ))}
                      {(!user.roles || user.roles.length === 0) && (
                        <Badge text="user" variant="outline" />
                      )}
                    </div>
                    <Typography variant="caption" color="medium-gray">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      variant={user.roles?.includes('admin') ? 'error' : 'primary'}
                      onClick={() => toggleAdminRole(user.id, user.roles)}
                      size="sm"
                    >
                      {user.roles?.includes('admin') ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}

          {users.length === 0 && (
            <li className="p-4 text-center">
              <Typography variant="body1" color="medium-gray">
                No users found
              </Typography>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserManagementPage;
