# Consolidated Components Quick Reference

This guide provides a quick reference for using the new consolidated components in the EncoreLando application.

## Card Component

```jsx
import Card from '../components/atoms/Card';

// Basic usage
<Card>Card content</Card>

// Interactive variant
<Card variant="interactive" onClick={handleClick}>
  Interactive card
</Card>

// Featured card with gradient border
<Card featured>
  Featured content
</Card>

// Custom padding
<Card padding={false}>
  <div className="custom-padding">Custom padding content</div>
</Card>

// All available props
<Card
  variant="default" // Options: 'default', 'interactive', 'elevated', 'outlined'
  onClick={handleClick} // Only used with 'interactive' variant
  featured={false} // Whether to show gradient border
  className="" // Additional classes
  padding={true} // Whether to apply default padding
  contentClassName="" // Classes for the content container
>
  Card content
</Card>
```

## PerformanceCard Component

The unified `PerformanceCard` replaces `PerformanceCard`, `ArtistPerformanceCard`, and `VenuePerformanceCard`.

```jsx
import PerformanceCard from '../components/organisms/PerformanceCard';

// Default context (shows artist name, venue, and time)
<PerformanceCard performance={performanceData} />

// Artist context - used on artist detail pages
// (shows venue name and time, omits artist name)
<PerformanceCard 
  performance={performanceData} 
  context="artist"
  showDate={true} 
/>

// Venue context - used on venue detail pages
// (shows artist name and time, omits venue name)
<PerformanceCard 
  performance={performanceData} 
  context="venue"
  showDate={true} 
/>

// All available props
<PerformanceCard
  performance={performanceData} // Performance data object
  context="default" // Options: 'default', 'artist', 'venue'
  showDate={false} // Whether to show the date
  featured={false} // Whether to show gradient styling
  className="" // Additional classes
/>
```

## EntityCard Component

The unified `EntityCard` replaces `ArtistCard`, `FestivalCard`, and supports venues.

```jsx
import EntityCard from '../components/organisms/EntityCard';

// Artist card
<EntityCard 
  entity={artistData} 
  type="artist" 
/>

// Festival card
<EntityCard 
  entity={festivalData} 
  type="festival" 
/>

// Venue card
<EntityCard 
  entity={venueData} 
  type="venue" 
/>

// All available props
<EntityCard
  entity={entityData} // Entity data object
  type="artist" // Options: 'artist', 'festival', 'venue'
  featured={false} // Whether to show gradient styling
  className="" // Additional classes
/>
```

## Data Shape Requirements

### Performance Object

The `PerformanceCard` component supports various data structures and field naming conventions:

```javascript
// Example performance object (showing minimum required fields)
const performance = {
  id: "perf-123", // Required
  
  // Time fields - supports both camelCase and snake_case
  startTime: "2023-05-15T19:30:00Z", // or start_time
  endTime: "2023-05-15T21:00:00Z",   // or end_time (optional)
  
  // Artist info - supports various structures
  artist: {  // or artists
    id: "artist-123",
    name: "Artist Name",
    image_url: "path/to/image.jpg" // optional
  },
  // OR just the ID
  artist_id: "artist-123",
  // OR just the name
  artist_name: "Artist Name",
  
  // Venue info - supports various structures
  venue: {  // or venues
    id: "venue-123",
    name: "Venue Name",
    park: {
      id: "park-123",
      name: "Theme Park Name"
    }
  },
  // OR just the ID
  venue_id: "venue-123",
  
  // Festival info - if part of a festival
  festival: {  // or festivals
    id: "festival-123",
    name: "Festival Name"
  },
  // OR just the ID
  festival_id: "festival-123",
  
  // Multiple performance times (optional)
  performanceTimes: [
    {
      id: "time-1",
      startTime: "2023-05-15T19:30:00Z", // or start_time
      endTime: "2023-05-15T21:00:00Z"    // or end_time (optional)
    }
  ]
};
```

### Entity Objects

The `EntityCard` component expects different data shapes based on the entity type:

```javascript
// Artist entity
const artist = {
  id: "artist-123", // Required
  name: "Artist Name", // Required
  image_url: "path/to/image.jpg", // Optional
  genres: ["Rock", "Alternative", "Pop"], // Optional
  upcoming_performances_count: 5 // Optional
};

// Festival entity
const festival = {
  id: "festival-123", // Required
  name: "Festival Name", // Required
  image_url: "path/to/image.jpg", // Optional
  start_date: "2023-05-15T00:00:00Z", // Optional
  end_date: "2023-05-17T00:00:00Z", // Optional
  park: { // Optional
    id: "park-123",
    name: "Theme Park Name"
  },
  performances_count: 25, // Optional
  is_active: true // Optional
};

// Venue entity
const venue = {
  id: "venue-123", // Required
  name: "Venue Name", // Required
  image_url: "path/to/image.jpg", // Optional
  capacity: 5000, // Optional
  park: { // Optional
    id: "park-123",
    name: "Theme Park Name"
  },
  performances_count: 15 // Optional
};
```

## Mobile-First Best Practices

When using these components, follow these mobile-first practices:

1. Use single-column layouts on mobile
2. Implement horizontal scrollers for grouped cards
3. Ensure touch targets are at least 44×44px
4. Test all interactive elements on actual mobile devices
5. Ensure text remains readable without zooming
6. Verify loading and error states are mobile-friendly