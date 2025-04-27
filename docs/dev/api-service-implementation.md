# EncoreLando API Service Layer Implementation

This document details the API service layer implementation for the EncoreLando project, outlining the service modules, custom hooks, and their usage patterns with a focus on the mobile-first approach.

## Overview

The EncoreLando API service layer provides a clean abstraction over the Supabase database operations, following a consistent pattern across all entity types. This service-oriented architecture enables components to access data through custom React hooks that handle state management, loading states, and error handling.

## Service Modules

All service modules follow a consistent pattern:
- Direct interaction with Supabase client
- Optimized queries with selective field fetching
- Filter support for mobile-friendly data access
- Proper error handling with descriptive error messages
- Mobile-optimized payload sizes
- Consistent method naming and parameters

### Available Service Modules

1. **concertService.js**
2. **artistService.js**
3. **venueService.js**
4. **parkService.js**
5. **festivalService.js**
6. **searchService.js**

## Custom Hooks

Custom hooks encapsulate the service module interactions and provide React components with:
- State management with useState
- Async data fetching with loading indicators
- Comprehensive error handling
- Pagination with loadMore functionality
- Filter management
- Refresh capabilities

### Available Custom Hooks

1. **useConcerts.js**
2. **useArtists.js**
3. **useVenues.js**
4. **useParks.js**
5. **useFestivals.js**
6. **useSearch.js**

## Mobile-First Implementation Details

All API services and hooks are optimized for mobile usage with:

### Payload Optimization
- Selective field fetching to minimize data transfer
- Only retrieving essential fields for list views
- Optional field filtering through parameters
- Lazy loading of related entity details

### Performance Considerations
- Pagination to limit initial data load
- Query optimizations for common mobile use cases
- Caching considerations for frequently accessed data
- Optimized JSON structures for minimal processing

### Service Module Implementation Example

```javascript
// Example of mobile-optimized query in artistService.js
async getArtists({
  name,
  genre,
  festivalId,
  limit = 20,
  offset = 0,
  sort = 'name',
  order = 'asc'
} = {}) {
  let query = supabase
    .from('artists')
    .select(`
      id,
      name,
      image_url,
      genres`, // Only select fields needed for list view
      { count: 'exact' }
    )
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1); // Pagination for performance
  
  // Apply filters if provided
  if (name) {
    query = query.ilike('name', `%${name}%`);
  }
  
  if (genre) {
    query = query.contains('genres', [genre]);
  }
  
  if (festivalId) {
    // Complex query optimized for performance
    query = query.in('id', 
      supabase
        .from('concerts')
        .select('artist_id')
        .eq('festival_id', festivalId)
    );
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
  
  return {
    data,
    pagination: {
      total: count,
      limit,
      offset
    }
  };
}
```

### Custom Hook Implementation Example

```javascript
// Example of mobile-optimized hook (useArtists.js)
const useArtists = (initialFilters = {}) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0
  });
  const [filters, setFilters] = useState(initialFilters);
  
  // Fetch artists with current filters
  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, pagination: paginationData } = await artistService.getArtists({
        ...filters,
        limit: pagination.limit,
        offset: pagination.offset
      });
      
      setArtists(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err.message || 'Failed to fetch artists');
      console.error('Error in useArtists hook:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.offset]);
  
  // Fetch on mount and filter changes
  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);
  
  // Load next page for infinite scrolling
  const loadMore = useCallback(() => {
    if (loading || artists.length >= pagination.total) return;
    
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  }, [loading, artists.length, pagination.total, pagination.limit]);
  
  // Other functionality...
  
  return {
    artists,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refresh,
    // Additional methods...
  };
};
```

## Usage Examples

### Basic Data Fetching

```jsx
// Example component using the useConcerts hook
function ConcertListScreen() {
  const { concerts, loading, error, loadMore } = useConcerts({
    startDate: new Date(),
    limit: 10
  });
  
  if (loading && !concerts.length) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return (
    <div>
      <h1>Upcoming Concerts</h1>
      
      <ConcertList concerts={concerts} />
      
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Button onClick={loadMore}>Load More</Button>
      )}
    </div>
  );
}
```

### Filtering Data

```jsx
// Example component with filtering
function ArtistDirectory() {
  const { artists, loading, error, filters, updateFilters } = useArtists();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    updateFilters({ name: searchTerm });
  };
  
  return (
    <div>
      <h1>Artist Directory</h1>
      
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search artists"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <ArtistGrid artists={artists} />
      )}
    </div>
  );
}
```

### Global Search

```jsx
// Example search component
function SearchScreen() {
  const { results, loading, error, globalSearch } = useSearch();
  const [query, setQuery] = useState('');
  
  const handleSearch = () => {
    globalSearch(query);
  };
  
  return (
    <div>
      <h1>Search</h1>
      
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search concerts, artists, venues..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div>
          {results.artists.length > 0 && (
            <div>
              <h2>Artists</h2>
              <ArtistList artists={results.artists} />
            </div>
          )}
          
          {results.concerts.length > 0 && (
            <div>
              <h2>Concerts</h2>
              <ConcertList concerts={results.concerts} />
            </div>
          )}
          
          {/* Additional result sections */}
        </div>
      )}
    </div>
  );
}
```

## Error Handling

All service modules and hooks implement consistent error handling:

1. Service modules:
   - Log detailed errors to console
   - Throw errors with descriptive messages
   - Include context like entity IDs in error messages

2. Custom hooks:
   - Capture and store errors in state
   - Provide error state to components
   - Clear errors when operations are retried
   - Show appropriate error handling in UI

## Mobile-First Best Practices

When implementing UI components that use these services and hooks, follow these mobile-first best practices:

1. **Infinite Scrolling**: Use the `loadMore` function for implementing infinite scrolling rather than traditional pagination for mobile interfaces

2. **Optimistic Updates**: When possible, update the UI optimistically before API calls complete to improve perceived performance

3. **Skeleton Loading**: Show skeleton loading states that match the expected content layout

4. **Search Debouncing**: Implement debouncing for search inputs to minimize API calls during typing

5. **Filter Persistence**: Remember user filter preferences in localStorage to improve the user experience

6. **Network Status Awareness**: Add network status detection to show appropriate offline indicators

7. **Fetch on Visibility**: For background tabs, delay fetching until the tab becomes visible again

## Extending the Service Layer

When adding new functionality to the service layer:

1. Follow the established patterns in existing service modules
2. Keep mobile optimization as a primary concern
3. Implement both the service module and corresponding custom hook
4. Add comprehensive error handling
5. Document the new functionality
6. Optimize queries for minimal payload size

## Next Steps

The service layer implementation provides a solid foundation for building the UI components. Next development steps include:

1. Implementing UI components that leverage these services
2. Adding offline support with service workers
3. Implementing caching strategies for frequently accessed data
4. Creating admin interfaces for data management
5. Implementing user authentication and favorites functionality