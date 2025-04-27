# EncoreLando Custom Hooks

This directory contains custom React hooks for the EncoreLando application. These hooks implement mobile-optimized data fetching patterns and provide a clean interface for components to access data.

## Available Hooks

### `useConcerts`

A hook for accessing and filtering concert data.

```javascript
import useConcerts from '../hooks/useConcerts';

function ConcertsPage() {
  const { 
    concerts, 
    loading, 
    error, 
    pagination,
    filters,
    updateFilters,
    loadMore,
    refresh
  } = useConcerts({
    // Initial filters
    startDate: new Date(),
    parkId: 'some-park-id'
  });

  // Update filters example
  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  // Load more example for infinite scrolling
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMore();
    }
  };

  if (loading && concerts.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div onScroll={handleScroll}>
      {concerts.map(concert => (
        <ConcertCard key={concert.id} concert={concert} />
      ))}
      {loading && <p>Loading more...</p>}
    </div>
  );
}
```

## Mobile-First Hook Patterns

Our custom hooks implement these mobile-first patterns:

### 1. Optimized Data Fetching

- Fetch only necessary fields to minimize payload size
- Implement pagination to limit initial load
- Support infinite scrolling patterns for mobile

### 2. Offline Support

- Cache results in state for offline viewing
- Provide refresh mechanism to update data when connection is available

### 3. Optimized Loading States

- Maintain existing data while loading more
- Show loading indicators only when appropriate
- Preserve scroll position during pagination

### 4. Error Handling

- Graceful error handling with user-friendly messages
- Automatic retry mechanisms (where appropriate)
- Detailed error logging for debugging

## Creating New Hooks

When creating new hooks for EncoreLando, follow these guidelines:

1. **Mobile-Optimized**: Prioritize patterns that work well on mobile devices
2. **Consistent Interface**: Follow similar patterns to existing hooks
3. **Error Handling**: Always include comprehensive error handling
4. **Loading States**: Provide clear loading states
5. **Caching**: Consider caching strategies for frequently accessed data
6. **Documentation**: Include JSDoc comments for all functions and parameters

## Upcoming Hooks

The following hooks are planned for implementation:

- `useArtists` - For artist data and filtering
- `useVenues` - For venue data and filtering
- `useFestivals` - For festival data and filtering
- `useParks` - For park data
- `useSearch` - For search functionality across entities
