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
- Admin interface for content management
- User authentication and profile management
- Venue directory with "Get Directions" functionality
- Artist directory with upcoming performances
- Festival directory with day-by-day schedules

## Mobile-First Design

This application is built with a strict mobile-first approach. All features are optimized for mobile devices with:

- Touch-friendly interfaces with minimum 44×44px touch targets
- Performance optimization for mobile networks
- Battery-conscious operations
- Responsive design that enhances for larger screens
- Bottom navigation for thumb-reach optimization
- Horizontal scrollers for efficient content browsing
- High contrast options for outdoor viewing
- Efficient data loading for mobile connections
- Touch-optimized date selection and calendar views

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

3. Set up environment variables:
```
cp .env.example .env
```
Edit the `.env` file with your Supabase credentials.

4. Start the development server:
```
npm start
```

## Recent Updates

### Admin Interface Implementation

- Comprehensive admin interface with Supabase authentication
- Mobile-optimized CRUD forms for all data types
- Role-based access control system
- Touch-friendly admin dashboard with quick actions
- Client-side validation with clear error messaging

### Map Integration

- Added venue location maps to venue detail pages
- Implemented client-side, CSS-based map solution
- Zero external dependencies for 100% reliability
- Interactive coordinate display
- "Get Directions" integration with native map applications
- Optimized for mobile with minimal data usage and battery drain

### Authentication Refactor

- Centralized token storage for improved reliability
- Enhanced API client with consistent auth handling
- Simplified Auth Context with improved state management
- Enhanced Protected Routes with better UX
- Global auth event handling for app-wide state consistency

### Branding Updates

- New dark theme with vibrant accent colors
- Updated typography with Poppins and Manrope fonts
- Gradient accent implementation
- Consistent design across all components
- Enhanced readability for outdoor viewing

## Technical Documentation

Detailed technical documentation is available in the `/docs` directory:

- [Project Overview](docs/project/overview.md)
- [Mobile-First Design Mandate](docs/design/mobile-first-mandate.md)
- [API Implementation](docs/api/api-implementation.md)
- [Authentication System](docs/auth/authentication-system.md)
- [Database Schema](docs/database/schema.sql)
- [Implementation Summary](docs/project/implementation-summary.md)
- [Map Integration Guide](docs/design/map-integration.md)
- [Admin Interface Guide](docs/admin/admin-interface-guide.md)
- [Branding Guidelines](docs/design/brand-guidelines.md)
- [Testing Strategy](docs/testing/testing-strategy.md)

## Project Structure

```
src/
├── components/       # React components following atomic design
│   ├── atoms/        # Foundational components
│   ├── molecules/    # Combinations of atoms
│   ├── organisms/    # Complex components
│   ├── templates/    # Page layouts
│   ├── brand/        # Brand-specific components
│   ├── ui/           # Additional UI components
│   ├── layout/       # Layout components
│   └── common/       # Shared components like ProtectedRoute
├── context/          # React context providers
│   ├── AuthContext.jsx  # Authentication context
│   └── FavoritesContext.jsx # User favorites management
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── admin/        # Admin interface pages
│   └── auth/         # Authentication pages
├── services/         # API services
│   └── supabase.js   # Supabase client configuration
├── styles/           # Global styles
├── utils/            # Utility functions
└── assets/           # Static assets
```

## Available Scripts

- `npm start` - Start the development server
- `npm test` - Run the test suite
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier
- `npm run netlify:dev` - Run with Netlify functions
- `npm run download-maps` - Download static maps for development

## Next Steps

Our roadmap includes:
- Enhanced offline capabilities with service workers
- Geolocation features for nearby performances
- Additional performance optimizations
- Advanced search capabilities
- User preference and personalization features

## License

This project is licensed under the MIT License - see the LICENSE file for details.