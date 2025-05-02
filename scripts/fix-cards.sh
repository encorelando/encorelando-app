#!/bin/bash

# Fix script for EncoreLando card issues
# This script will replace the problematic files with fixed versions

echo "Starting to fix card component issues..."

# Back up original files
echo "Creating backups of original files..."
cp src/components/organisms/PerformanceCard.jsx src/components/organisms/PerformanceCard.jsx.bak
cp src/components/atoms/Card.jsx src/components/atoms/Card.jsx.bak

# Check if the backup succeeded
if [ -f src/components/organisms/PerformanceCard.jsx.bak ] && [ -f src/components/atoms/Card.jsx.bak ]; then
  echo "✅ Backups created successfully."
else
  echo "❌ Failed to create backups. Aborting."
  exit 1
fi

# Replace with fixed versions
echo "Replacing files with fixed versions..."
cp src/components/organisms/PerformanceCardFixed.jsx src/components/organisms/PerformanceCard.jsx
cp src/components/atoms/CardFixed.jsx src/components/atoms/Card.jsx

# Check if the replacement succeeded
if [ -f src/components/organisms/PerformanceCard.jsx ] && [ -f src/components/atoms/Card.jsx ]; then
  echo "✅ Files replaced successfully."
else
  echo "❌ Failed to replace files. Restoring from backups."
  cp src/components/organisms/PerformanceCard.jsx.bak src/components/organisms/PerformanceCard.jsx
  cp src/components/atoms/Card.jsx.bak src/components/atoms/Card.jsx
  exit 1
fi

echo "📝 Creating report of what was fixed..."

cat > CARD_FIXES.md << 'EOL'
# Card Component Fixes

## Issues Fixed

1. **Artist Images Not Displaying in Performance Cards**
   - Fixed image loading in PerformanceCard by using direct `img` tag instead of ImageThumbnail component
   - Added better handling of image sources with proper fallbacks
   - Improved logging to debug image URL issues

2. **Gradient Border Overlapping Images**
   - Restructured Card component to correctly handle gradient borders
   - Fixed nested components to ensure gradient borders don't overlap with content
   - Properly handled padding to ensure consistent spacing

3. **Naming Convention Issues**
   - Added support for both 'artist' and 'artists' naming conventions to match API structure
   - Added comprehensive logging to help debug data structure issues
   - Improved data normalization to handle various response formats

## Technical Details

### PerformanceCard Improvements
- Added direct image element rendering with proper styling
- Fixed padding and spacing issues
- Added comprehensive logging for debugging
- Enhanced image source resolution with better fallbacks

### Card Component Improvements
- Completely restructured gradient border handling for featured cards
- Added proper nesting to avoid content overlap
- Improved accessibility with proper ARIA roles

## Testing Notes
- Images should now display properly on the home page
- Gradient borders should appear correctly and not overlap with images
- All cards should maintain consistent spacing and alignment

## Future Recommendations
- Consider a more consistent API response format to avoid naming inconsistencies
- Add default image placeholders directly in the component
- Add unit tests to verify correct rendering of images in various contexts
EOL

echo "✅ Fix report created successfully."
echo "Done! All card component issues should be fixed."
echo "If you need to restore the original files, use the .bak files."
