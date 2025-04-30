# EncoreLando Admin Interface Guide

## Overview

The EncoreLando admin interface provides a comprehensive set of tools for managing content within the application. This document details the implementation, features, and mobile-first considerations of the admin interface.

## Key Features

The admin interface includes:

1. **Dashboard**: Central hub for quick access to all management features
2. **Content Management**: CRUD operations for all entity types
3. **User Management**: Control over user accounts and permissions
4. **Authentication**: Secure login and role-based access control
5. **Mobile Optimization**: Touch-friendly design following mobile-first principles

## Implementation Details

### Admin Dashboard

The `AdminDashboardPage` component serves as the main entry point for admin functionality:

```jsx
const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Admin sections configuration
  const adminSections = [
    {
      title: 'Concerts',
      description: 'Manage concert listings, times, and details',
      link: '/admin/concerts',
      icon: '🎵',
    },
    {
      title: 'Artists',
      description: 'Manage artist profiles and information',
      link: '/admin/artists',
      icon: '🎤',
    },
    // Other sections...
  ];

  // Component implementation
};
```

#### Dashboard Features:

- Card-based navigation with large touch targets
- Quick action buttons for common tasks
- User information display
- Logout functionality
- Section-based organization of admin tools

### Content Management

Each entity type has a dedicated management page with:

1. **List View**: Showing all entries with key information
2. **Create/Edit Forms**: Mobile-optimized data entry
3. **Delete Functionality**: With confirmation dialogs
4. **Filtering**: To find specific entries quickly

Example from `ConcertsManagementPage`:

```jsx
const ConcertsManagementPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Data fetching
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setLoading(true);
        const concertData = await apiClient.get('concerts', {
          select: '*, artists(*), venues(*), festivals(*)',
          orderBy: 'start_time',
          ascending: true,
        });
        setConcerts(concertData);
      } catch (err) {
        setError('Failed to load concerts. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  // Component implementation with list view and actions
};
```

### Form Implementation

Entity forms (like `ConcertFormPage`) provide:

1. **Field Validation**: Immediate feedback on input errors
2. **Relationship Management**: Dropdowns for related entities
3. **Error Handling**: Clear error messages for API failures
4. **Loading States**: Indicators for async operations
5. **Touch-Optimized Controls**: Large input elements and action buttons

Example form validation:

```jsx
const validateForm = () => {
  const errors = {};

  if (!formData.artist_id) {
    errors.artist_id = 'Artist is required';
  }

  if (!formData.venue_id) {
    errors.venue_id = 'Venue is required';
  }

  if (!formData.start_time) {
    errors.start_time = 'Start time is required';
  }

  if (formData.end_time && new Date(formData.end_time) <= new Date(formData.start_time)) {
    errors.end_time = 'End time must be after start time';
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### Authentication & Authorization

The admin interface uses:

1. **Supabase Authentication**: For secure login
2. **Protected Routes**: For access control
3. **Role-Based Permissions**: Admin role verification
4. **Persistent Sessions**: Token-based authentication with proper storage

Example protected route implementation:

```jsx
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboardPage />
    </ProtectedRoute>
  }
/>
```

The `ProtectedRoute` component:

```jsx
const ProtectedRoute = ({ children, adminOnly = true, redirectPath = '/admin/login' }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

## Routing Structure

The admin interface uses the following route structure:

```jsx
// Admin routes
<Route path="/admin/login" element={<AdminLoginPage />} />
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboardPage />
    </ProtectedRoute>
  }
/>

// Concerts Management
<Route
  path="/admin/concerts"
  element={
    <ProtectedRoute>
      <ConcertsManagementPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/concerts/new"
  element={
    <ProtectedRoute>
      <ConcertFormPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/concerts/edit/:id"
  element={
    <ProtectedRoute>
      <ConcertFormPage />
    </ProtectedRoute>
  }
/>

// Similar routes for artists, venues, festivals, and user management
```

## Mobile-First Design

The admin interface adheres to mobile-first principles:

### 1. Touch-Optimized Controls

- All interactive elements have minimum 44×44px touch targets
- Bottom-positioned action buttons within thumb reach
- Proper spacing between interactive elements
- Form fields sized appropriately for touch input

Example:

```jsx
<div className="fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 p-4 flex space-x-4">
  <Button
    type="button"
    variant="secondary"
    onClick={() => navigate('/admin/concerts')}
    fullWidth
    className="min-h-touch"
  >
    Cancel
  </Button>
  <Button
    type="submit"
    variant="primary"
    onClick={handleSubmit}
    disabled={saving}
    fullWidth
    className="min-h-touch"
  >
    {saving ? 'Saving...' : isEditMode ? 'Update Concert' : 'Create Concert'}
  </Button>
</div>
```

### 2. Vertical Space Optimization

- Single column layouts for forms
- Collapsible sections for content organization
- Progressive disclosure of complex information
- Efficient use of screen real estate

### 3. Performance Considerations

- Pagination for large data sets
- Optimized API requests with specific field selection
- Lazy loading of components
- Minimal dependencies

### 4. Responsive Enhancement

- Mobile layout first, enhanced for larger screens
- Grid layouts that adapt to screen size
- Typography that scales appropriately
- Touch-first, mouse-second interaction design

## Entity Management

The admin interface supports the following entity types:

### 1. Concerts

Fields:
- Artist (required)
- Venue (required)
- Festival (optional)
- Start Time (required)
- End Time (optional)
- Notes (optional)
- Ticket Required (boolean)

### 2. Artists

Fields:
- Name (required)
- Description (optional)
- Image URL (optional)
- Website URL (optional)
- Genre (optional)
- Social Media Links (optional)

### 3. Venues

Fields:
- Name (required)
- Park (required)
- Description (optional)
- Image URL (optional)
- Capacity (optional)
- Status (open/closed)
- Location Details (optional)
- Latitude (optional)
- Longitude (optional)
- Website URL (optional)

### 4. Festivals

Fields:
- Name (required)
- Description (optional)
- Start Date (required)
- End Date (required)
- Image URL (optional)
- Featured (boolean)
- Website URL (optional)

### 5. Users

Fields:
- Email (required)
- Display Name (required)
- Avatar URL (optional)
- Roles (array)

## User Roles

The admin interface supports the following roles:

1. **Admin**: Full access to all management features
2. **Editor**: Can create and edit content but not manage users
3. **Viewer**: Read-only access to admin dashboard

Role checking:

```jsx
const isAdmin = () => {
  if (!user) return false;

  // Check if roles array contains 'admin'
  if (userProfile?.roles && Array.isArray(userProfile.roles)) {
    return userProfile.roles.includes('admin');
  }

  // Fallback to email check for backward compatibility
  return user.email === 'encorelandoapp@gmail.com';
};

// Check if user has a specific role
const hasRole = role => {
  if (!user || !userProfile?.roles || !Array.isArray(userProfile.roles)) {
    return false;
  }

  return userProfile.roles.includes(role);
};
```

## API Integration

The admin interface uses the `apiClient` service for data operations:

```jsx
// Create a new item
const createConcert = async (concertData) => {
  try {
    setSaving(true);
    const data = await apiClient.create('concerts', concertData);
    navigate('/admin/concerts');
    return data;
  } catch (error) {
    setError('Failed to create concert. Please try again.');
    console.error(error);
  } finally {
    setSaving(false);
  }
};

// Update an existing item
const updateConcert = async (id, concertData) => {
  try {
    setSaving(true);
    const data = await apiClient.update('concerts', id, concertData);
    navigate('/admin/concerts');
    return data;
  } catch (error) {
    setError('Failed to update concert. Please try again.');
    console.error(error);
  } finally {
    setSaving(false);
  }
};
```

## Error Handling

The admin interface includes comprehensive error handling:

1. **Form Validation**: Client-side validation with clear error messages
2. **API Error Handling**: Proper catching and display of server errors
3. **Authentication Errors**: Automatic redirection to login on auth failures
4. **Loading States**: Clear indication of async operations
5. **Empty State Handling**: Appropriate messaging for no-data scenarios

Example form error display:

```jsx
{formErrors.artist_id && (
  <p className="mt-1 text-sm text-error">{formErrors.artist_id}</p>
)}
```

## Usage Instructions

To access the admin interface:

1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. Use the dashboard to access entity management
4. Create, read, update, and delete entities as needed
5. Manage user roles and permissions

## Conclusion

The EncoreLando admin interface provides a comprehensive, mobile-optimized solution for content management. Following mobile-first design principles, it offers a touch-friendly, efficient, and secure way to manage all aspects of the application's content while maintaining consistency with the public-facing design.