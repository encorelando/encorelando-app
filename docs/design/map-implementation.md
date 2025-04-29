# EncoreLando Map Implementation

This document outlines the static map implementation for the EncoreLando application, which follows our mobile-first design principles and optimizes for API usage efficiency.

## Overview

Our map implementation uses a multi-tiered approach to display venue locations:

1. **Pre-generated static maps** stored in the project for commonly accessed venues
2. **Local caching** using localStorage to avoid redundant API calls
3. **Geoapify API** as a fallback for any venues not in our pre-generated set

This approach ensures:
- Maps work reliably on all devices
- API usage stays within our free tier limits
- Mobile users get a fast, consistent experience

## Implementation Details

### Pre-generating Static Maps

We use a Node.js script to pre-generate static maps for all known venues:

```bash
# Run manually to update maps
npm run download-maps

# Also runs automatically during build
npm run build
```

The script `/scripts/download-static-maps.js`:
1. Downloads static maps for all venues in our database
2. Generates multiple sizes for each venue (800x400, 600x300, 400x250)
3. Creates a JSON index file mapping coordinates to image paths

### Caching Strategy

The `mapCache.js` utility implements a three-tier caching strategy:

1. First check localStorage for a previously cached map
2. Next check for a pre-downloaded static map matching the coordinates
3. As a last resort, generate a new URL from the Geoapify API

This ensures minimal API usage while providing a consistent user experience.

### Map Component

The `StaticMap` component in `src/components/molecules/StaticMap.jsx` handles:
- Displaying the appropriate map based on venue coordinates
- Adapting to container width to ensure proper display on all devices
- Loading states and error handling
- "Get Directions" integration with Google Maps

## API Limitations and Solutions

With Geoapify's free tier limit of 3,000 requests per day, we've implemented:

1. **Shared caching**: The same map image can be reused for multiple components
2. **Pre-downloaded maps**: Most common venues never need to make an API call
3. **Expiration time**: Cache entries persist for 7 days before refreshing

For production, the build process ensures all static maps are downloaded ahead of time, greatly reducing the need for API calls during normal operation.

## Directory Structure

```
public/
├── images/
│   └── maps/                   # Pre-generated map images
│       ├── mapIndex.json       # Map coordinates to file paths
│       ├── venue1_800x400.png  # Static map for venue 1
│       └── ...
src/
├── components/
│   └── molecules/
│       ├── StaticMap.jsx       # Map component
│       └── StaticMap.css       # Map styling
└── utils/
    └── mapCache.js            # Caching utility
scripts/
└── download-static-maps.js    # Map pre-generation script
```

## Mobile-First Considerations

In accordance with our [Mobile-First Design Mandate](./wireframes.md), the map implementation:

1. **Optimizes for mobile data usage**:
   - Uses caching to reduce data consumption
   - Loads appropriately sized images based on screen width

2. **Ensures fast loading**:
   - Avoids large map libraries
   - Uses static images that load quickly

3. **Provides touch-friendly UI**:
   - Large "Get Directions" button (min. 44px height)
   - Decorative zoom controls match UI design

4. **Works reliably across devices**:
   - Responsive design adapts to all screen sizes
   - Handles offline/poor connectivity gracefully

## Venue Coordinates

Our database includes these venue coordinates:

| Venue Name | Park | Latitude | Longitude |
|------------|------|----------|-----------|
| America Gardens Theatre | EPCOT | 28.373058 | -81.549795 |
| Cinderella Castle Forecourt | Magic Kingdom | 28.418723 | -81.583067 |
| Theater of the Stars | Hollywood Studios | 28.358889 | -81.558611 |
| Harambe Theatre | Animal Kingdom | 28.355278 | -81.590278 |
| Music Plaza Stage | Universal Studios | 28.475556 | -81.468056 |
| Mythos Amphitheater | Islands of Adventure | 28.471667 | -81.472500 |

All these venues have pre-generated static maps, which means the application should rarely need to make API calls for maps during normal operation.

## Testing the Map Component

When testing the map component, consider these scenarios:

1. **First-time load**: Should show loading state then display the map
2. **Repeat visit**: Should load instantly from cache
3. **Unknown coordinates**: Should fall back to API
4. **Missing coordinates**: Should show a fallback UI
5. **Network failure**: Should display error state with appropriate message

## Development vs. Production

During development, maps may be fetched from the API more frequently. In production:

1. The build process runs `npm run download-maps` automatically
2. All maps are pre-generated and included in the deployment
3. API calls should only occur for newly added venues or custom coordinates

## Future Enhancements

Potential improvements to consider:

1. **Vector maps**: If API limits become a concern, consider using lightweight vector map rendering
2. **Server-side caching**: Add server-side caching of map images for even more efficient delivery
3. **Responsive image srcsets**: Further optimize by serving different sized images based on screen/device

## Troubleshooting

If maps aren't displaying correctly:

1. Check the browser console for errors
2. Verify that the map index file exists at `/images/maps/mapIndex.json`
3. Clear localStorage cache with `localStorage.clear()` in the browser console
4. Run `npm run download-maps` to refresh the static map images
