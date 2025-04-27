# EncoreLando Technical Architecture

## System Architecture Overview

EncoreLando employs a modern, serverless architecture leveraging free-tier cloud services to minimize costs while maintaining scalability and performance. The system follows a JAMstack approach (JavaScript, APIs, Markup) with statically generated content where possible.

### High-Level Architecture Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│                 │     │                  │     │                    │
│  React Frontend ├────►│ Netlify Functions├────►│ Supabase Database  │
│  (Netlify Host) │     │ (Serverless API) │     │ (PostgreSQL)       │
│                 │◄────┤                  │◄────┤                    │
└─────────────────┘     └──────────────────┘     └────────────────────┘
        ▲                        ▲                          ▲
        │                        │                          │
        │                        │                          │
┌───────▼────────┐     ┌────────▼───────┐        ┌─────────▼──────────┐
│                │     │                │        │                     │
│   End Users    │     │  Admin Users   │        │  Data Collection    │
│                │     │                │        │  Scripts/Process    │
└────────────────┘     └────────────────┘        └─────────────────────┘
```

### Component Interaction Flow

1. **User Requests:** Browser requests are served by Netlify's global CDN
2. **Dynamic Data:** API calls are handled by Netlify Functions (serverless)
3. **Data Storage:** All persistent data stored in Supabase PostgreSQL
4. **Authentication:** Handled by Supabase Auth integrated with database
5. **Data Updates:** Admin interface and automated scripts update database

## Technology Stack Details

### Frontend
- **Framework:** React
- **State Management:** React Context API + Custom Hooks
- **Styling:** Tailwind CSS
- **UI Components:** Custom component library following atomic design
- **Routing:** React Router
- **Build System:** Create React App (with potential migration to Vite)
- **Package Manager:** npm

### Backend
- **API:** Netlify Functions (serverless)
- **Runtime:** Node.js
- **Authentication:** Supabase Auth
- **Function Deployment:** Automated via Netlify CI/CD

### Database
- **Platform:** Supabase (PostgreSQL)
- **Schema:** Relational with defined constraints
- **Access Pattern:** Supabase client SDK + custom service layer
- **Authentication:** Row-level security through Supabase

### DevOps
- **Version Control:** GitHub
- **CI/CD:** Netlify integrated CI/CD + GitHub Actions
- **Environment Management:** Netlify Deploy Contexts
- **Monitoring:** Netlify Analytics + Custom Logging

## Database Schema

### Core Tables

#### concerts
```sql
CREATE TABLE concerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id),
  venue_id UUID REFERENCES venues(id),
  festival_id UUID REFERENCES festivals(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### artists
```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  genres TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### venues
```sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  park_id UUID REFERENCES parks(id),
  description TEXT,
  location_details TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### parks
```sql
CREATE TABLE parks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### festivals
```sql
CREATE TABLE festivals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  park_id UUID REFERENCES parks(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  website_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### user_profiles (future implementation)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### favorites (future implementation)
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  concert_id UUID REFERENCES concerts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, concert_id)
);
```

### Indexes and Constraints
```sql
-- Fast lookups for concerts by date
CREATE INDEX idx_concerts_start_time ON concerts (start_time);

-- Fast lookups for concerts by festival
CREATE INDEX idx_concerts_festival_id ON concerts (festival_id);

-- Fast lookups for venues by park
CREATE INDEX idx_venues_park_id ON venues (park_id);

-- Fast lookups for festivals by park
CREATE INDEX idx_festivals_park_id ON festivals (park_id);

-- Ensure festival dates are valid
ALTER TABLE festivals ADD CONSTRAINT valid_festival_dates 
CHECK (end_date >= start_date);
```

## API Implementation

### Services Layer

We've implemented a service-oriented architecture with:

- **Supabase Client**: Centralized client instance for all database operations
- **Entity Services**: Separate service modules for each entity (concerts, artists, venues, festivals, parks)
- **Custom Hooks**: React hooks that encapsulate data fetching and state management

#### Service Layer Example
```javascript
// concerts service
import supabase from './supabase';

const concertService = {
  async getConcerts({ startDate, endDate, artistId, ... } = {}) {
    // Build query with filters
    let query = supabase
      .from('concerts')
      .select(`
        id, 
        start_time,
        artists:artist_id (id, name),
        venues:venue_id (id, name)
      `);
      
    // Apply filters
    if (startDate) query = query.gte('start_time', startDate);
    
    // Execute and return
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  // Additional methods...
};

export default concertService;
```

### Custom Hooks

Our custom hooks implement mobile-optimized patterns:

```javascript
// useConcerts hook
import { useState, useEffect, useCallback } from 'react';
import concertService from '../services/concertService';

const useConcerts = (initialFilters = {}) => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  
  // Fetch concerts based on filters
  const fetchConcerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await concertService.getConcerts(filters);
      setConcerts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  // Additional methods for pagination, refreshing, etc.
  
  return {
    concerts,
    loading,
    error,
    filters,
    updateFilters,
    // Additional properties and methods
  };
};

export default useConcerts;
```

## API Endpoints

### Public API Endpoints

#### Concerts
- `GET /api/concerts` - List concerts with filtering options
- `GET /api/concerts/:id` - Get concert details
- `GET /api/concerts/upcoming` - Get upcoming concerts
- `GET /api/concerts/by-date/:date` - Get concerts on a specific date
- `GET /api/concerts/by-artist/:artistId` - Get concerts by a specific artist
- `GET /api/concerts/by-festival/:festivalId` - Get concerts in a specific festival

#### Artists
- `GET /api/artists` - List all artists with filtering options
- `GET /api/artists/:id` - Get artist details with upcoming performances
- `GET /api/artists/search/:query` - Search artists by name

#### Venues
- `GET /api/venues` - List all venues
- `GET /api/venues/:id` - Get venue details with upcoming performances
- `GET /api/venues/by-park/:parkId` - Get venues in a specific park

#### Parks
- `GET /api/parks` - List all parks
- `GET /api/parks/:id` - Get park details with venues and festivals

#### Festivals
- `GET /api/festivals` - List all festivals
- `GET /api/festivals/:id` - Get festival details with concert lineup
- `GET /api/festivals/current` - Get currently running festivals
- `GET /api/festivals/upcoming` - Get upcoming festivals

### Administrative API Endpoints (Authenticated)

#### Content Management
- `POST /api/admin/concerts` - Create new concert
- `PUT /api/admin/concerts/:id` - Update concert
- `DELETE /api/admin/concerts/:id` - Delete concert

- `POST /api/admin/artists` - Create new artist
- `PUT /api/admin/artists/:id` - Update artist
- `DELETE /api/admin/artists/:id` - Delete artist

- `POST /api/admin/venues` - Create new venue
- `PUT /api/admin/venues/:id` - Update venue
- `DELETE /api/admin/venues/:id` - Delete venue

- `POST /api/admin/festivals` - Create new festival
- `PUT /api/admin/festivals/:id` - Update festival
- `DELETE /api/admin/festivals/:id` - Delete festival

- `POST /api/admin/parks` - Create new park
- `PUT /api/admin/parks/:id` - Update park
- `DELETE /api/admin/parks/:id` - Delete park

#### Data Operations
- `POST /api/admin/import` - Bulk import data
- `GET /api/admin/stats` - Get system statistics

## Authentication & Authorization

### Authentication Methods
- **Public API Access**: Anonymous/Unauthenticated
- **Admin Interface**: JWT-based authentication through Supabase Auth
- **Future User Accounts**: JWT-based authentication with social login options

### Authorization Rules

#### Row-Level Security Policies
```sql
-- Example RLS policy for concerts
CREATE POLICY "Anyone can view concerts"
  ON concerts FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert concerts"
  ON concerts FOR INSERT
  WITH CHECK (auth.jwt() -> 'role' = 'admin');
  
CREATE POLICY "Only admins can update concerts"
  ON concerts FOR UPDATE
  USING (auth.jwt() -> 'role' = 'admin');
```

## Mobile-First Optimization

### Data Fetching Optimizations
- Selective field fetching to minimize payload sizes
- Pagination with infinite scrolling support
- Optimized queries for common mobile use cases

### Performance Considerations
- Minimal initial payload size
- Lazy loading of non-critical content
- Optimized image loading strategies
- Caching for frequently accessed data

### Offline Support
- State persistence for offline viewing
- Queuing updates for when connectivity is restored
- Clear indicators for offline mode

## Data Collection & Management

### Data Sources
1. Official theme park websites
2. Official social media accounts
3. Artist websites and announcements
4. Press releases

### Collection Methods
1. Initial manual data entry through admin interface
2. Future: Automated web scraping scripts for structured sources
3. Future: Potential API integrations if available

### Data Verification
1. Regular manual verification against sources
2. Automated consistency checks
3. User feedback mechanism for error reporting

## Technical Debt Considerations

1. **Migration from CRA to Vite**: Planned for improved build performance
2. **Typescript Implementation**: Gradual migration to TypeScript
3. **Testing Coverage**: Expand testing beyond critical paths
4. **Performance Optimization**: Implement more aggressive caching
5. **Mobile App Preparation**: Structure API endpoints for mobile consumption

## Technical Constraints & Limitations

### Netlify Free Tier Limits
- 100GB bandwidth per month
- 300 build minutes per month
- 125k function invocations per month
- 1,000 form submissions per month

### Supabase Free Tier Limits
- 500MB database storage
- 1GB file storage
- 50MB of file uploads per month
- 2GB egress per month
- 100 concurrent connections
- Daily backups retained for 7 days

### Performance Constraints
- Function cold start times (serverless limitation)
- API rate limiting considerations
- Database query performance optimization needs

## Security Considerations

1. **API Security**:
   - Input validation on all endpoints
   - Rate limiting to prevent abuse
   - CORS restrictions to authorized domains only

2. **Data Security**:
   - Row-level security for all database tables
   - No sensitive user data stored (minimal data collection)
   - Regular security audits

3. **Authentication Security**:
   - JWT best practices followed
   - Token expiration and refresh flow
   - Proper permission scoping

## Monitoring & Analytics

1. **Application Monitoring**:
   - Custom logging for key operations
   - Error tracking and reporting
   - Performance metrics collection

2. **User Analytics**:
   - Pageview and feature usage tracking
   - User flow analysis
   - Search term tracking

3. **System Health**:
   - Function execution metrics
   - Database performance monitoring
   - API response time tracking

## Implementation Progress

### Completed
- Database schema design and implementation
- Supabase setup with RLS policies
- Initial API service layer for concerts
- Custom hooks for data fetching
- Authentication setup for admin access

### In Progress
- Implementation of remaining service modules
- UI component library development
- Admin interface for data entry

### Up Next
- Complete API implementation for all entities
- Develop core UI screens
- Implement mobile-optimized user flows

This technical architecture document provides a comprehensive overview of the EncoreLando system design and will serve as a guide for implementation. It will be regularly updated as the system evolves.