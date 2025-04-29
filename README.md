# EncoreLando

A mobile-first application for displaying concert and festival information for theme parks in Orlando.

## Project Overview

EncoreLando provides comprehensive information about concerts, performances, and festivals at Orlando area theme parks. The application is designed with a strict mobile-first approach to serve users who are primarily accessing the information while at theme parks, standing in lines, or planning from hotel rooms.

## Features

- Browse concerts and performances by date
- View festival schedules and lineups
- Explore venue information with location maps
- Search for artists, venues, and performances
- Filter events by park, date, and more

## Mobile-First Design

This application is built with a strict mobile-first approach. All features are optimized for mobile devices with:

- Touch-friendly interfaces with minimum 44×44px touch targets
- Performance optimization for mobile networks
- Battery-conscious operations
- Responsive design that enhances for larger screens
- Bottom navigation for thumb-reach optimization

## Getting Started

1. Clone the repository:
```
git clone https://github.com/yourusername/encorelando.git
```

2. Install dependencies:
```
cd encorelando
npm install
```

3. Start the development server:
```
npm start
```

## Recent Updates

### Admin Interface Implementation (May 1, 2025)

- Built comprehensive admin interface with Supabase authentication
- Created mobile-optimized CRUD forms for all data types:
  - Concerts management
  - Artists management 
  - Venues management
  - Festivals management
- Implemented protected routes with role-based access control
- Designed responsive admin dashboard with touch-friendly cards
- Added client-side validation with clear error messaging

### Festival Schedule Enhancement (April 30, 2025)

- Implemented day-by-day breakdown of festival performances
- Added touch-optimized filtering for venues and time of day
- Created tab-based interface for better mobile organization
- Enhanced festival information display with clear visual hierarchy
- Added day numbering (Day 1, Day 2, etc.) for easier festival navigation

### VenueDetailPage Enhancement (April 29, 2025)

- Added comprehensive upcoming performances section
- Implemented tab-based interface with "Upcoming" and "Calendar" views
- Enhanced performance information display with date grouping
- Optimized all interactive elements for mobile touch interaction
- Improved location details with direct "Get Directions" integration

### Map Integration (April 28, 2025)

- Added venue location maps to venue detail pages
- Implemented a fully client-side, CSS-based map solution
- Zero external dependencies for 100% reliability
- Interactive toggle for precise coordinates
- Added "Get Directions" integration with native map applications
- Optimized for mobile with no data usage or battery drain

### Venue Directory (April 15, 2025)

- Implemented VenuesPage with mobile-optimized grid layout
- Added filtering capabilities by park and upcoming concerts
- Created responsive design with single column on mobile, expanding to multi-column on larger screens

## Technical Documentation

Detailed technical documentation is available in the `/docs` directory:

- [Mobile-First Design Mandate](docs/design/wireframes.md)
- [Map Integration Guide](docs/design/map-integration.md)
- [Map Providers Configuration](docs/design/map-providers-config.md)
- [Database Schema](docs/database/schema.sql)
- [Implementation Summary - April 2025](docs/project/implementation-summary-april2025.md)
- [Project Tracking](docs/project/project-tracking.md)
- [Remaining Tasks](docs/project/remaining-tasks.md)
- [Admin Interface Guide](docs/admin/admin-interface-guide.md)
- [Supabase Auth Setup](docs/admin/supabase-auth-setup.md)

## Project Structure

```
src/
├── components/       # React components following atomic design
│   ├── atoms/        # Foundational components
│   ├── molecules/    # Combinations of atoms
│   ├── organisms/    # Complex components
│   ├── templates/    # Page layouts
│   └── common/       # Shared components like ProtectedRoute
├── context/          # React context providers
│   └── AuthContext.jsx  # Authentication context
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   └── admin/        # Admin interface pages
├── services/         # API services
│   └── supabase.js   # Supabase client configuration
└── utils/            # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
