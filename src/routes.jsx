import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from './components/atoms/Spinner';

/**
 * Routes configuration with code-splitting
 * Mobile-optimized with lazy-loading for performance
 */

// Lazy-load pages to reduce initial bundle size
const HomePage = lazy(() => import('./pages/HomePage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const ArtistDirectoryPage = lazy(() => import('./pages/ArtistDirectoryPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// Artist detail pages
const ArtistDetailPage = lazy(() => import('./pages/ArtistDetailPage'));
const ConcertDetailPage = lazy(() => import('./pages/ConcertDetailPage'));
const FestivalDetailPage = lazy(() => import('./pages/FestivalDetailPage'));
const VenueDetailPage = lazy(() => import('./pages/VenueDetailPage'));
const ParkDetailPage = lazy(() => import('./pages/ParkDetailPage'));

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
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Main pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/artists" element={<ArtistDirectoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        
        {/* Detail pages */}
        <Route path="/artists/:id" element={<ArtistDetailPage />} />
        <Route path="/concerts/:id" element={<ConcertDetailPage />} />
        <Route path="/festivals/:id" element={<FestivalDetailPage />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />
        <Route path="/parks/:id" element={<ParkDetailPage />} />
        
        {/* Redirect legacy routes */}
        <Route path="/events" element={<Navigate to="/calendar" replace />} />
        <Route path="/performers" element={<Navigate to="/artists" replace />} />
        
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;