# EncoreLando API Services

This directory contains service modules that handle data fetching and API interactions for the EncoreLando application.

## Supabase Client

`supabase.js` initializes and exports the Supabase client that will be used throughout the application. This ensures we're using a single instance of the client across the app.

### Usage Example

```javascript
import supabase from '../services/supabase';

// Example function to get all parks
async function getParks() {
  try {
    const { data, error } = await supabase
      .from('parks')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching parks:', error);
    throw error;
  }
}
```

## API Services

It's recommended to create separate service modules for each entity (concerts, artists, venues, etc.) to keep your code organized. For example:

- `concertService.js` - For concert-related API calls
- `artistService.js` - For artist-related API calls
- `venueService.js` - For venue-related API calls
- `festivalService.js` - For festival-related API calls
- `parkService.js` - For park-related API calls

## Mobile-First API Considerations

When implementing API services, keep these mobile-first practices in mind:

1. **Minimize payload size**: Only request the fields you need using Supabase's `.select()` method
2. **Implement caching**: Cache frequently accessed data to reduce network requests
3. **Handle offline scenarios**: Implement offline fallbacks where appropriate
4. **Optimize batch operations**: Use Supabase's batch operations to reduce API calls
5. **Monitor performance**: Track API call performance for mobile optimizations

## Environment Setup

The Supabase client requires two environment variables:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous (public) API key

These should be set in your `.env` file, which should not be committed to version control.
