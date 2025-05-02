# EntityCard Component Fixes

## Overview

We've fixed component prop references across the EncoreLando application to ensure proper usage of the consolidated card components. The main issue was that the new `EntityCard` component expects an `entity` prop, but was being used with `artist` and `festival` props in various component files.

## Fixed Files

1. `src/pages/HomePage.jsx`
   - Changed `artist={artist}` to `entity={artist}`
   - Changed `festival={festival}` to `entity={festival}`

2. `src/pages/FestivalsPage.jsx`
   - Changed `festival={festival}` to `entity={festival}`

3. `src/pages/ArtistDirectoryPage.jsx`
   - Changed `artist={artist}` to `entity={artist}`

4. `src/pages/ParkDetailPage.jsx`
   - Changed `festival={festival}` to `entity={festival}`

5. `src/pages/SearchPage.jsx`
   - Changed `artist={formattedArtist}` to `entity={formattedArtist}`
   - Changed `festival={formattedFestival}` to `entity={formattedFestival}`

## Verification

All component props now match the expected interface defined in the consolidated components:

1. `EntityCard` accepts:
   - `entity` prop (required)
   - `type` prop with values 'artist', 'festival', or 'venue'
   - `featured` prop (optional, boolean)
   - `className` prop (optional, string)

2. `PerformanceCard` accepts:
   - `performance` prop (required)
   - `context` prop with values 'default', 'artist', or 'venue'
   - `showDate` prop (optional, boolean)
   - `featured` prop (optional, boolean)
   - `className` prop (optional, string)

## Next Steps

1. Verify that all components render correctly after these fixes
2. Confirm that the prop type warning no longer appears in the console
3. Ensure that all entity types (artists, festivals, venues) are displayed properly
4. Consider running the component consolidation script to clean up the old component files
5. Add comprehensive tests for the new unified components

## Benefits

By fixing these prop references, we've ensured that:

1. The application uses the consolidated components correctly
2. PropType warnings are eliminated
3. The code is more maintainable and consistent
4. The unified components provide better flexibility and reuse