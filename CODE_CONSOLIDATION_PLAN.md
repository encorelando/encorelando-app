# EncoreLando Code Consolidation Plan

## Summary of Changes

We've identified several duplicative components in the EncoreLando codebase, particularly card components used for artists, venues, festivals, and performances. Our consolidation plan addresses these redundancies while maintaining the mobile-first design mandate and all existing functionality.

### Components to Consolidate

1. **Base Card Components**
   - `Card.jsx` and `BrandCard.jsx` will be unified into a single enhanced `Card.jsx`

2. **Performance Card Components**
   - `PerformanceCard.jsx`
   - `ArtistPerformanceCard.jsx`
   - `VenuePerformanceCard.jsx`
   - Will be consolidated into a single `PerformanceCard.jsx` with context awareness

3. **Entity Card Components**
   - `ArtistCard.jsx`
   - `FestivalCard.jsx`
   - Will be consolidated into a unified `EntityCard.jsx` with type-based rendering

## Implementation Plan

### Phase 1: Component Creation (Completed)

1. ✅ Create unified `Card.jsx` with enhanced props
2. ✅ Create unified `PerformanceCard.jsx` with context prop
3. ✅ Create `EntityCard.jsx` with type prop
4. ✅ Enhance `ImageThumbnail.jsx` with better aspect ratio handling and grayscale option
5. ✅ Create update script for automated reference updates
6. ✅ Document the consolidation approach

### Phase 2: Migration (To Execute)

1. Run the update script to automatically replace imports and component usage throughout the codebase:
   ```
   node scripts/update-card-references.js
   ```

2. Manually verify key pages to ensure components are displaying correctly:
   - Artist Directory Page
   - Artist Detail Page
   - Festival Directory Page
   - Festival Detail Page
   - Performance List Views
   - Venue Detail Page

3. Run ESLint to check for any syntax issues:
   ```
   npm run lint
   ```

4. Fix any remaining issues in files that might not have been fully updated by the script

### Phase 3: Testing (To Execute)

1. Run comprehensive test suite:
   ```
   npm test
   ```

2. Manually test on mobile devices to ensure proper display and interaction
3. Validate responsive behavior across different screen sizes
4. Check for any performance regressions

### Phase 4: Cleanup (To Execute)

1. Remove obsolete component files:
   - `src/components/atoms/BrandCard.jsx`
   - `src/components/organisms/ArtistCard.jsx`
   - `src/components/organisms/ArtistPerformanceCard.jsx`
   - `src/components/organisms/FestivalCard.jsx`
   - `src/components/organisms/VenuePerformanceCard.jsx`

2. Update documentation to reflect the new component structure
3. Commit changes with detailed explanation of consolidation

## Benefits

1. **Reduced Code Size**
   - Eliminating 5 redundant components
   - Removing duplicate logic and styling
   - Smaller bundle size for faster mobile loading

2. **Improved Maintainability**
   - Single source of truth for each component type
   - Consistent interfaces across related components
   - Enhanced documentation

3. **Enhanced Flexibility**
   - Better handling of various data structures
   - Easy extension for new entity types
   - More consistent error handling

4. **Better Mobile Performance**
   - Optimized component rendering
   - Improved loading states
   - Touch-optimized interactive elements

## Execution Steps

Run the following commands in order:

```bash
# 1. Backup the current state
git add .
git commit -m "Snapshot before code consolidation"

# 2. Run the update script
node scripts/update-card-references.js

# 3. Fix any linting issues
npm run lint -- --fix

# 4. Run tests
npm test

# 5. Start dev server to test manually
npm start

# 6. After verification, commit changes
git add .
git commit -m "Complete card component consolidation"
```

## Risk Mitigation

1. **References Not Updated**
   - After running the script, use search to locate any remaining references:
     ```
     grep -r "BrandCard\|ArtistCard\|FestivalCard\|ArtistPerformanceCard\|VenuePerformanceCard" src
     ```

2. **Styling Inconsistencies**
   - Verify appearance on key pages
   - Compare with screenshots taken before consolidation

3. **Data Handling Issues**
   - Test with different API response formats
   - Verify loading states and error handling

4. **Rollback Plan**
   - If major issues are discovered, use the initial commit to restore the previous state:
     ```
     git checkout [snapshot-commit-hash]
     ```

## Documentation

Comprehensive documentation has been created in:
- `/docs/code-consolidation.md`

This includes:
- Detailed explanation of the consolidation approach
- Component usage examples
- Mobile-first design considerations
- Future recommendations