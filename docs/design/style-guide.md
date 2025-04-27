# EncoreLando Style Guide

This style guide defines the visual design system for the EncoreLando web application. Following our mobile-first mandate, all design decisions prioritize the mobile experience while providing progressive enhancement for larger screens.

## Design Principles

### 1. Mobile-First
- Design for smallest screens first, then progressively enhance
- Prioritize performance and speed for mobile networks
- Create interfaces optimized for touch and one-handed use

### 2. Clarity & Readability
- Optimize for outdoor readability in bright sunlight
- Prioritize information hierarchy for quick scanning
- Use high contrast for text and interactive elements

### 3. Brand Personality
- Vibrant and energetic: Conveys the excitement of live performances
- Trustworthy and informative: Provides accurate, reliable information
- Accessible and inclusive: Usable by all visitors regardless of ability

### 4. Performance
- Minimal design patterns that load quickly
- Visual elements that don't compromise speed
- Graceful loading states and transitions

## Color Palette

### Primary Colors
- **Primary Purple**: `#7E57C2` 
  - Used for primary buttons, active states, and key actions
  - Passes WCAG AA contrast on white backgrounds
  - High visibility in outdoor environments

- **Primary Dark**: `#4D2C91`
  - Used for hover/pressed states and text on light backgrounds
  - Provides sufficient contrast for small text

- **Primary Light**: `#B085F5`
  - Used for backgrounds, borders, and secondary elements
  - Accessible when used with dark text

### Secondary Colors
- **Secondary Teal**: `#26A69A`
  - Used for call-to-action elements and highlights
  - Provides visual contrast to primary purple

- **Secondary Dark**: `#00766C`
  - Used for hover/pressed states on secondary elements
  - High contrast against white

- **Secondary Light**: `#64D8CB`
  - Used for backgrounds and subtle highlights
  - Pairs well with dark text

### Neutral Colors
- **Dark Gray**: `#333333`
  - Primary text color
  - Strong contrast against light backgrounds

- **Medium Gray**: `#757575`
  - Secondary text and icons
  - Used for less prominent information

- **Light Gray**: `#E0E0E0`
  - Borders, dividers, and subtle backgrounds
  - Provides visual separation without strong contrast

- **Off-White**: `#F5F5F5`
  - Page backgrounds
  - Reduces eye strain compared to pure white

### Semantic Colors
- **Success**: `#66BB6A`
  - Confirmation messages and success states

- **Error**: `#E53935`
  - Error messages and destructive actions
  - High visibility for important alerts

- **Warning**: `#FFA726`
  - Warning messages and cautionary information
  - Stands out against both light and dark backgrounds

- **Info**: `#29B6F6`
  - Informational messages and neutral notifications

## Typography

### Font Family
- **Primary Font**: `Inter`
  - Clean, modern sans-serif font with excellent readability
  - Good performance on mobile devices
  - Available via Google Fonts

- **Fallback System**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
  - Ensures consistent rendering across platforms

### Font Sizes (Mobile-First)

| Style | Size (Mobile) | Weight | Line Height | Usage |
|-------|---------------|--------|-------------|-------|
| h1    | 24px          | 700    | 1.2         | Main page titles |
| h2    | 20px          | 700    | 1.3         | Section headers |
| h3    | 18px          | 600    | 1.4         | Card titles, major content headers |
| h4    | 16px          | 600    | 1.4         | Minor section headers |
| body1 | 16px          | 400    | 1.5         | Primary body text |
| body2 | 14px          | 400    | 1.5         | Secondary body text |
| caption | 12px        | 400    | 1.4         | Supporting text, timestamps |
| button | 16px         | 500    | 1           | Button text |

### Font Sizes (Tablet/Desktop Enhancements)

| Style | Size (Tablet) | Size (Desktop) | Weight | Line Height | Usage |
|-------|---------------|----------------|--------|-------------|-------|
| h1    | 28px          | 32px           | 700    | 1.2         | Main page titles |
| h2    | 24px          | 28px           | 700    | 1.2         | Section headers |
| h3    | 20px          | 24px           | 600    | 1.3         | Card titles, major content headers |
| h4    | 18px          | 20px           | 600    | 1.3         | Minor section headers |
| body1 | 16px          | 16px           | 400    | 1.5         | Primary body text |
| body2 | 14px          | 14px           | 400    | 1.5         | Secondary body text |
| caption | 12px        | 12px           | 400    | 1.4         | Supporting text, timestamps |
| button | 16px         | 16px           | 500    | 1           | Button text |

### Text Contrast & Readability
- Minimum contrast ratio of 4.5:1 for all body text (WCAG AA)
- Minimum contrast ratio of 3:1 for large text (WCAG AA)
- No center-aligned paragraphs (improves readability)
- Maximum text width of 66 characters for optimal reading

## Spacing System

A consistent 4px-based spacing system provides rhythm and alignment throughout the application.

| Token | Size | Usage |
|-------|------|-------|
| space-xxs | 4px | Minimal separation |
| space-xs | 8px | Tight spacing between related elements |
| space-sm | 12px | Default spacing for related elements |
| space-md | 16px | Standard component padding |
| space-lg | 24px | Section spacing |
| space-xl | 32px | Major section divisions |
| space-xxl | 48px | Page-level spacing |

### Mobile-Specific Spacing
- Reduced margin at screen edges (16px vs 24px+ on larger screens)
- Tighter spacing between elements to maximize screen real estate
- Touch targets spaced sufficiently to prevent accidental taps

## Layout

### Grid System
- Mobile: 4-column grid with 16px gutters
- Tablet: 8-column grid with 24px gutters
- Desktop: 12-column grid with 24px gutters

### Containers & Margins
- Mobile: 16px side margins
- Tablet: 24px side margins
- Desktop: 32px side margins, maximum content width of 1200px

### Vertical Rhythm
- Consistent spacing between page sections
- Predictable hierarchy through standardized spacing

## Components

### Buttons

#### Primary Button
- Height: 48px (mobile), 48px (desktop)
- Background: Primary Purple
- Text: White, Button typography
- Border Radius: 8px
- States:
  - Default: Primary Purple
  - Hover: Primary Dark (desktop only)
  - Active/Pressed: Primary Dark - 10% darker
  - Disabled: 40% opacity

#### Secondary Button
- Height: 48px (mobile), 48px (desktop)
- Background: White
- Text: Primary Purple, Button typography
- Border: 1px solid Primary Purple
- Border Radius: 8px
- States:
  - Default: White background, Primary Purple text/border
  - Hover: Light Purple 10% background (desktop only)
  - Active/Pressed: Light Purple 15% background
  - Disabled: 40% opacity

#### Text Button
- Height: 48px (mobile), 40px (desktop)
- Background: Transparent
- Text: Primary Purple, Button typography
- Border Radius: 4px
- States:
  - Default: Transparent background, Primary Purple text
  - Hover: Light Purple 5% background (desktop only)
  - Active/Pressed: Light Purple 10% background
  - Disabled: 40% opacity

#### Button Sizes
- Standard: 48px height (touch-friendly)
- Small: 36px height (for secondary actions where space is limited)
- Icon-only: 48px × 48px (minimum touch target size)

### Cards

#### Standard Card
- Background: White
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Padding: 16px (mobile), 20px (tablet/desktop)
- Border: None or 1px solid Light Gray for subtle definition

#### Interactive Card
- Same as Standard Card, plus:
- Hover effect: Slight elevation increase (desktop only)
- Active state: Slight depression effect
- Includes visual indicator for interaction (chevron, etc.)

#### Content Card Layout
- Clear visual hierarchy with consistent spacing
- Title at top (h3 style)
- Supporting content below with appropriate spacing
- Action buttons or links at bottom if needed

### Navigation

#### Bottom Navigation (Mobile)
- Height: 56px
- Background: White
- Shadow: 0 -2px 4px rgba(0,0,0,0.1)
- Icons: 24px, centered
- Labels: Caption typography, centered below icons
- Active state: Primary Purple for icon and text
- Inactive state: Medium Gray for icon and text

#### Top/Side Navigation (Desktop Enhancement)
- Height: 64px (top), or full-height (side)
- Background: White
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Active state: Primary Purple for icon and text
- Inactive state: Medium Gray for icon and text
- Hover state: Light purple background (desktop only)

### Forms

#### Text Inputs
- Height: 48px (touch-friendly)
- Border: 1px solid Light Gray
- Border Radius: 8px
- Padding: 12px 16px
- Typography: Body1
- States:
  - Default: Light Gray border
  - Focus: Primary Purple border, subtle highlight
  - Error: Error Red border, error message below
  - Disabled: Light Gray background, 40% opacity text

#### Select Inputs
- Same styling as text inputs
- Custom dropdown icon
- Mobile-friendly dropdown that uses native controls

#### Checkboxes & Radio Buttons
- Minimum size: 24px × 24px
- Custom styling with brand colors
- Clear active states
- Touch-friendly hit areas (minimum 44px × 44px)

### Lists

#### Standard List
- Clear item separation with 12px spacing or dividers
- Touch-friendly item height (minimum 44px)
- Visual feedback for interactive items
- Consistent padding and alignment

#### Interactive List Items
- Minimum height: 48px (touch-friendly)
- Visual feedback on tap/click
- Clear affordance for interaction (chevron, etc.)
- Consistent tap target across entire row

### Calendar

#### Date Selector
- Day size: 44px × 44px minimum (touch-friendly)
- Clear current date indicator
- High contrast for selected date
- Visual indicators for dates with events
- Swipe gestures for month navigation

#### Date Display
- Consistent date formatting throughout app
- Clear visual hierarchy for date components
- Abbreviated where space is limited, but still understandable

## Icons

### Icon System
- Primary set: [Phosphor Icons](https://phosphoricons.com/) 
  - Clean, modern style
  - Consistent 24px baseline size
  - Good readability at small sizes
  - Available as React components

### Icon Sizes
- Small: 16px (used sparingly, only for inline or dense UIs)
- Medium: 24px (standard size for most UI contexts)
- Large: 32px (used for emphasis or primary navigation)

### Icon Colors
- Default: Medium Gray
- Active/Selected: Primary Purple
- Interactive: Same states as buttons
- Contextual: Uses semantic colors for status indicators

## Images

### Image Treatment
- Border Radius: 8px for consistency with cards
- Aspect Ratios: Standardized ratios (16:9, 4:3, 1:1)
- Loading: Low-resolution placeholders while loading
- Errors: Consistent placeholder for failed images

### Image Optimization
- Responsive images using srcset
- WebP format with appropriate fallbacks
- Optimized file sizes for mobile data connections
- Lazy loading for images below the viewport

## Animation & Transitions

### Principles
- Subtle and purposeful, never distracting
- Performance-focused, avoid heavy animations on mobile
- Provide feedback and enhance usability
- Respect user preferences for reduced motion

### Timing
- **Quick**: 100-150ms (micro-interactions, button states)
- **Standard**: 200-300ms (panel transitions, reveal animations)
- **Deliberate**: 400-500ms (page transitions, important reveals)

### Common Animations
- **Button feedback**: Subtle scale/color change on tap/click
- **Page transitions**: Fade or slide transitions between pages
- **Loading states**: Spinner or skeleton screens for content loading
- **Expansion**: Smooth expansion/collapse for accordions and expandable content

### Reduced Motion
- Alternative animations for users with motion sensitivity preferences
- Fade transitions instead of movement-based transitions
- Instant state changes for micro-interactions

## Mobile-Specific Considerations

### Touch Targets
- Minimum size: 44px × 44px for all interactive elements
- Adequate spacing between touch targets (minimum 8px)
- Full-width tap targets for list items and cards

### One-Handed Operation
- Critical actions in thumb-friendly zones
- Bottom navigation for primary actions
- Avoid requiring precise taps in hard-to-reach areas

### Outdoor Visibility
- High contrast for text and UI elements
- Sufficient text size for legibility in sunlight
- Color choices that maintain distinction in bright light

### Network Considerations
- Graceful loading states for slow connections
- Minimal initial payload size
- Offline-first approach where possible

## Responsive Design Approach

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

### Mobile-First Methodology
1. Design and develop for mobile viewport first
2. Use min-width media queries to enhance for larger screens
3. Test each component at all breakpoints
4. Ensure consistent experience across devices

### Progressive Enhancement Examples

#### Navigation
- Mobile: Bottom navigation bar with icons and labels
- Tablet: Same bottom navigation, but with more space
- Desktop: Side navigation or top navigation with additional options

#### Content Layout
- Mobile: Single column, full-width cards
- Tablet: Two-column grid for cards and lists
- Desktop: Multi-column layout with sidebar content

#### Calendar View
- Mobile: Compact weekly view with condensed information
- Tablet: Full month view with more detail
- Desktop: Month view with expanded event information

## Accessibility Guidelines

### Color & Contrast
- All text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have 3:1 minimum contrast
- No information conveyed by color alone
- Alternative high-contrast theme available

### Keyboard Navigation
- All interactive elements accessible via keyboard
- Visible focus states for all interactive elements
- Logical tab order matching visual layout
- Skip links for navigation

### Screen Readers
- Semantic HTML for proper structure
- ARIA labels where appropriate
- Alt text for all images
- Live regions for dynamic content

### Touch & Pointer
- Large touch targets for all interactive elements
- Touch events and mouse events for all interactions
- No reliance on hover for critical information

## Implementation with Tailwind CSS

This style guide will be implemented using Tailwind CSS with a custom configuration to match our design system.

### Custom Theme Configuration

```js
// tailwind.config.js example (partial)
module.exports = {
  theme: {
    colors: {
      // Primary colors
      'primary': '#7E57C2',
      'primary-dark': '#4D2C91',
      'primary-light': '#B085F5',
      
      // Secondary colors
      'secondary': '#26A69A',
      'secondary-dark': '#00766C',
      'secondary-light': '#64D8CB',
      
      // Neutral colors
      'dark-gray': '#333333',
      'medium-gray': '#757575',
      'light-gray': '#E0E0E0',
      'off-white': '#F5F5F5',
      'white': '#FFFFFF',
      
      // Semantic colors
      'success': '#66BB6A',
      'error': '#E53935',
      'warning': '#FFA726',
      'info': '#29B6F6',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
    fontSize: {
      'xs': '12px',    // caption
      'sm': '14px',    // body2
      'base': '16px',  // body1, button
      'lg': '18px',    // h4 (mobile), h3 (mobile)
      'xl': '20px',    // h2 (mobile), h4 (tablet)
      '2xl': '24px',   // h1 (mobile), h3 (desktop)
      '3xl': '28px',   // h2 (tablet), h1 (tablet)
      '4xl': '32px',   // h1 (desktop)
    },
    spacing: {
      'xxs': '4px',
      'xs': '8px',
      'sm': '12px',
      'md': '16px',
      'lg': '24px',
      'xl': '32px',
      'xxl': '48px',
    },
    borderRadius: {
      'none': '0',
      'sm': '4px',
      'DEFAULT': '8px',
      'lg': '12px',
    },
    extend: {
      // Custom height for touch targets
      height: {
        'touch': '48px',
        'nav': '56px',
      },
      // Custom width for containers
      maxWidth: {
        'content': '1200px',
      },
      // Custom box shadows
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)',
        'nav': '0 -2px 4px rgba(0,0,0,0.1)',
      },
    },
  },
  // Custom variants for mobile-first approach
  variants: {
    extend: {
      // Enable hover only for non-touch devices
      backgroundColor: ['responsive', 'hover', 'focus', 'active'],
      transform: ['responsive', 'hover', 'focus', 'active'],
    },
  },
  plugins: [
    // Custom plugins for specific utility needs
    require('@tailwindcss/forms'),
  ],
};
```

### Utility Class Examples

#### Button Component

```jsx
// Primary Button
<button className="h-touch px-md py-xs rounded bg-primary text-white font-medium text-base transition-colors hover:bg-primary-dark active:bg-primary-dark disabled:opacity-40">
  Button Text
</button>

// Secondary Button
<button className="h-touch px-md py-xs rounded bg-white text-primary border border-primary font-medium text-base transition-colors hover:bg-primary-light/10 active:bg-primary-light/15 disabled:opacity-40">
  Button Text
</button>
```

#### Card Component

```jsx
// Standard Card
<div className="bg-white rounded shadow-card p-md sm:p-lg">
  <h3 className="text-lg font-semibold mb-xs">Card Title</h3>
  <p className="text-base text-dark-gray mb-sm">Card content goes here with adequate spacing for readability.</p>
</div>

// Interactive Card
<div className="bg-white rounded shadow-card p-md sm:p-lg cursor-pointer transition-shadow hover:shadow-lg active:shadow-sm flex justify-between items-center">
  <div>
    <h3 className="text-lg font-semibold mb-xs">Interactive Card</h3>
    <p className="text-base text-dark-gray">Tap for more details</p>
  </div>
  <svg className="w-6 h-6 text-medium-gray" /* Chevron icon */ />
</div>
```

#### Bottom Navigation

```jsx
// Bottom Navigation Bar
<nav className="fixed bottom-0 left-0 right-0 h-nav bg-white shadow-nav flex justify-around items-center">
  <a href="/" className="flex flex-col items-center pt-xs">
    <svg className="w-6 h-6 text-primary" /* Home icon */ />
    <span className="text-xs font-medium text-primary mt-xxs">Home</span>
  </a>
  <a href="/search" className="flex flex-col items-center pt-xs">
    <svg className="w-6 h-6 text-medium-gray" /* Search icon */ />
    <span className="text-xs font-medium text-medium-gray mt-xxs">Search</span>
  </a>
  <a href="/calendar" className="flex flex-col items-center pt-xs">
    <svg className="w-6 h-6 text-medium-gray" /* Calendar icon */ />
    <span className="text-xs font-medium text-medium-gray mt-xxs">Calendar</span>
  </a>
</nav>
```

## Design Token Implementation

To maintain consistency across the application, these design tokens will be available as CSS custom properties and through the Tailwind configuration.

### CSS Custom Properties Example

```css
:root {
  /* Colors */
  --color-primary: #7E57C2;
  --color-primary-dark: #4D2C91;
  --color-primary-light: #B085F5;
  
  /* (additional colors...) */
  
  /* Typography */
  --font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  
  /* (additional typography...) */
  
  /* Spacing */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  
  /* (additional spacing...) */
  
  /* Component-specific */
  --touch-target-size: 48px;
  --border-radius: 8px;
  --transition-duration: 200ms;
}

/* Media query example for responsive tokens */
@media (min-width: 768px) {
  :root {
    --container-margin: 24px;
    --card-padding: 20px;
  }
}
```

## Design Review Checklist

When reviewing designs and implementations, verify that they adhere to this style guide with special attention to:

1. **Mobile-First Implementation**
   - Designed for smallest screens first
   - Progressive enhancement for larger screens
   - Touch-optimized interfaces
   - Performance considerations

2. **Accessibility**
   - Color contrast compliance
   - Touch target sizes
   - Keyboard accessibility
   - Screen reader support

3. **Consistency**
   - Typography follows the defined scale
   - Colors from the approved palette
   - Spacing according to the spacing system
   - Components follow established patterns

4. **Brand Identity**
   - Visual design reflects the brand personality
   - Consistent voice and tone in text elements
   - Proper use of brand colors

5. **Performance**
   - Optimized assets and resources
   - Efficient loading patterns
   - Mobile network considerations

## Future Enhancements

As the application evolves, this style guide will be expanded to include:

1. **Dark Mode**
   - Alternate color palette for low-light environments
   - Automatic switching based on user preferences
   - Manual toggle for user control

2. **Additional Components**
   - Charts and data visualizations
   - Maps and location interfaces
   - Image galleries
   - Video players

3. **Animation Library**
   - Standardized animation presets
   - Interactive prototypes
   - Motion guidelines

4. **Brand Voice Guidelines**
   - Content style guide
   - Writing tone and principles
   - Text formatting and standards

This style guide serves as a living document and will evolve alongside the EncoreLando application to maintain a consistent, high-quality user experience on mobile devices first, with appropriate enhancements for larger screens.
