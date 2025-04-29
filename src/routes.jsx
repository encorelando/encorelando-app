import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from './components/atoms/Spinner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

/**
 * Routes configuration with code-splitting
 * Mobile-optimized with lazy-loading for performance
 */

// Lazy-load pages to reduce initial bundle size
const HomePage = lazy(() => import('./pages/HomePage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const ArtistDirectoryPage = lazy(() => import('./pages/ArtistDirectoryPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const FestivalsPage = lazy(() => import('./pages/FestivalsPage'));
const VenuesPage = lazy(() => import('./pages/VenuesPage'));

// Artist detail pages
const ArtistDetailPage = lazy(() => import('./pages/ArtistDetailPage'));
const ConcertDetailPage = lazy(() => import('./pages/ConcertDetailPage'));
const FestivalDetailPage = lazy(() => import('./pages/FestivalDetailPage'));
const VenueDetailPage = lazy(() => import('./pages/VenueDetailPage'));
const ParkDetailPage = lazy(() => import('./pages/ParkDetailPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ConcertsManagementPage = lazy(() => import('./pages/admin/ConcertsManagementPage'));
const ConcertFormPage = lazy(() => import('./pages/admin/ConcertFormPage'));
const ArtistsManagementPage = lazy(() => import('./pages/admin/ArtistsManagementPage'));
const ArtistFormPage = lazy(() => import('./pages/admin/ArtistFormPage'));
const VenuesManagementPage = lazy(() => import('./pages/admin/VenuesManagementPage'));
const VenueFormPage = lazy(() => import('./pages/admin/VenueFormPage'));
const FestivalsManagementPage = lazy(() => import('./pages/admin/FestivalsManagementPage'));
const FestivalFormPage = lazy(() => import('./pages/admin/FestivalFormPage'));

// Branding showcase page
const BrandExamplePage = lazy(() => import('./pages/BrandExamplePage'));

// Error and not found pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" color="primary" />
  </div>
);

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/artists" element={<ArtistDirectoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/festivals" element={<FestivalsPage />} />
          <Route path="/venues" element={<VenuesPage />} />

          {/* Detail pages */}
          <Route path="/artists/:id" element={<ArtistDetailPage />} />
          <Route path="/concerts/:id" element={<ConcertDetailPage />} />
          <Route path="/festivals/:id" element={<FestivalDetailPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />
          <Route path="/parks/:id" element={<ParkDetailPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Concerts Management */}
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

          {/* Artists Management */}
          <Route
            path="/admin/artists"
            element={
              <ProtectedRoute>
                <ArtistsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/artists/new"
            element={
              <ProtectedRoute>
                <ArtistFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/artists/edit/:id"
            element={
              <ProtectedRoute>
                <ArtistFormPage />
              </ProtectedRoute>
            }
          />

          {/* Venues Management */}
          <Route
            path="/admin/venues"
            element={
              <ProtectedRoute>
                <VenuesManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/venues/new"
            element={
              <ProtectedRoute>
                <VenueFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/venues/edit/:id"
            element={
              <ProtectedRoute>
                <VenueFormPage />
              </ProtectedRoute>
            }
          />

          {/* Festivals Management */}
          <Route
            path="/admin/festivals"
            element={
              <ProtectedRoute>
                <FestivalsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/festivals/new"
            element={
              <ProtectedRoute>
                <FestivalFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/festivals/edit/:id"
            element={
              <ProtectedRoute>
                <FestivalFormPage />
              </ProtectedRoute>
            }
          />

          {/* Branding showcase */}
          <Route path="/brand" element={<BrandExamplePage />} />

          {/* Redirect legacy routes */}
          <Route path="/events" element={<Navigate to="/calendar" replace />} />
          <Route path="/performers" element={<Navigate to="/artists" replace />} />

          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default AppRoutes;
