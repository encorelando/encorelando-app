# EncoreLando Updated Style Guide

This updated style guide integrates the new EncoreLando branding while maintaining our mobile-first approach. The design system has been refreshed with new colors, typography, and visual elements that better represent the energy of live music at Orlando theme parks.

## Core Branding Elements

### Brand Colors

The brand now features a vibrant color palette set against a dark background:

| Color | HEX | Usage |
|-------|-----|-------|
| **Background Dark** | `#0D0D0D` | Default background color |
| **Sunset Orange** | `#FF6A00` | Primary accent color |
| **Magenta Pink** | `#FF3CAC` | Secondary accent color |
| **Deep Orchid** | `#7B2FF7` | Accent color |
| **Neon Blue** | `#00C3FF` | Accent color |
| **White** | `#FFFFFF` | Text and UI elements on dark backgrounds |

### Brand Gradient

The signature gradient flows from left to right:

```css
background: linear-gradient(90deg, #FF6A00 0%, #FF3CAC 35%, #7B2FF7 65%, #00C3FF 100%);
```

### Typography

The brand uses a combination of two typefaces:

- **Poppins**: For "enc" and "e" portions of the logo, headings, and important UI elements
- **Manrope**: For "or" and "lando" portions of the logo and body text

## Design Principles

### 1. Dark Mode by Default
- Design interfaces with dark backgrounds (#0D0D0D)
- Use vibrant accent colors and white text for contrast
- Create a dramatic, stage-like setting for content

### 2. Mobile-First
- Design for smallest screens first, then progressively enhance
- Prioritize performance and speed for mobile networks
- Create interfaces optimized for touch and one-handed use

### 3. Vibrant & Bold
- Use accent colors strategically to highlight important elements
- Apply gradients for special UI components that need emphasis
- Create visual hierarchy through selective use of color

### 4. Accessibility & Readability
- Ensure high contrast between text and backgrounds
- Maintain font sizes optimized for mobile reading
- Provide proper touch targets for all interactive elements

## Typography System

### Font Imports

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
```

### Font Styles

| Element | Font | Weight | Size (Mobile) | Size (Desktop) |
|---------|------|--------|---------------|----------------|
| Headings (h1-h3) | Poppins | 600 | 18px-24px | 24px-32px |
| Subheadings (h4-h6) | Poppins | 500 | 16px-18px | 18px-24px |
| Body Text | Manrope | 400 | 14px-16px | 16px |
| Buttons | Poppins | 500 | 16px | 16px |
| Captions | Manrope | 400 | 12px | 12px |

### Typography Usage

- Use Poppins for elements that need emphasis and hierarchy
- Use Manrope for longer text content and supporting information
- When displaying the brand name "EncoreLando", apply the typography split:
  ```html
  <span class="typography-split">
    <span class="enc">enc</span><span class="or">or</span><span class="e">e</span><span class="lando">lando</span>
  </span>
  ```

## Color System

### Primary Application

- **Dark Background** (#0D0D0D): Main application background
- **White** (#FFFFFF): Primary text color and UI elements
- **Accent Colors**: Used selectively for:
  - Buttons and interactive elements
  - Icons and visual indicators
  - Section dividers
  - Highlighting important information

### Gradient Usage

The brand gradient should be applied to:
- Special UI elements that need emphasis
- Section dividers or borders
- Featured content backgrounds
- Logo display in special contexts

### Color Contrast

- Maintain WCAG AA contrast ratio (4.5:1) for all text
- Use white text on dark backgrounds for optimal readability
- Apply accent colors selectively to maintain visual hierarchy

## Component Updates

### Buttons

#### Primary Button
- Background: Sunset Orange (#FF6A00)
- Text: White
- Font: Poppins, 500 weight
- Height: 48px (touch-friendly)
- Border Radius: 8px
- Hover: Shift to Magenta Pink (#FF3CAC)

#### Secondary Button
- Background: Transparent
- Border: 1px solid White
- Text: White
- Font: Poppins, 500 weight
- Height: 48px
- Border Radius: 8px
- Hover: 15% white overlay

#### Gradient Button (Special)
- Background: Brand Gradient
- Text: White
- Font: Poppins, 600 weight
- Height: 48px
- Border Radius: 8px
- Hover: Slight brightness increase

### Cards

#### Standard Card
- Background: Semi-transparent white (10-15% opacity)
- Border Radius: 8px
- Text: White
- Padding: 16px (mobile), 20px (desktop)

#### Featured Card
- Background: Dark with gradient border or accent
- Border Radius: 8px
- Text: White with gradient accents for titles
- Padding: 16px (mobile), 20px (desktop)

### Navigation

#### Bottom Navigation (Mobile)
- Background: Dark (#0D0D0D with 95% opacity)
- Border Top: Subtle gradient line
- Icons: White, 24px
- Active State: Gradient highlight
- Inactive State: White at 70% opacity

### Typography Components

#### Headings
- Color: White
- Font: Poppins
- Special Headings: Apply gradient text effect

#### Body Text
- Color: White (90% opacity for secondary text)
- Font: Manrope
- Links: Accent color with underline

## Logo Usage

### Default Presentation
- **Preferred**: White monochrome logo on dark background
- **Alternative**: Gradient logo for special emphasis
- **Optional**: Black monochrome logo on light backgrounds (when necessary)

### Logo Placement
- Maintain clear space around logo (minimum 10% of logo height)
- Position prominently in headers and key touchpoints
- Use appropriate size for context (minimum 32px height)

## Layout Considerations

### Dark Background Application
- Use the dark background (#0D0D0D) as the default for all screens
- Create depth with subtle transparency levels
- Apply gradient accents strategically

### Mobile-First Grid
- Maintain 4-column grid on mobile
- Expand to 8-column on tablet and 12-column on desktop
- Use consistent margins and padding based on the spacing system

## Accessibility Considerations

- Ensure all text has sufficient contrast against backgrounds
- Provide :focus states for keyboard navigation
- Maintain minimum touch target size of 44×44px
- Test color choices with vision simulators

## Implementation with Tailwind CSS

### Custom Theme Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      'background': '#0D0D0D',
      'sunset-orange': '#FF6A00',
      'magenta-pink': '#FF3CAC',
      'deep-orchid': '#7B2FF7',
      'neon-blue': '#00C3FF',
      'white': '#FFFFFF',
      // ...other colors
    },
    fontFamily: {
      'poppins': ['Poppins', 'system-ui', 'sans-serif'],
      'manrope': ['Manrope', 'system-ui', 'sans-serif'],
      // ...other font configurations
    },
    extend: {
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #FF6A00 0%, #FF3CAC 35%, #7B2FF7 65%, #00C3FF 100%)',
      },
      // ...other extensions
    },
  },
  // ...other configurations
};
```

### Utility Class Examples

#### Brand Typography

```jsx
// Brand name with typography split
<h1 className="typography-split">
  <span className="enc">enc</span>
  <span className="or">or</span>
  <span className="e">e</span>
  <span className="lando">lando</span>
</h1>

// Gradient heading
<h2 className="font-poppins font-semibold text-2xl brand-gradient-text">
  Today's Performances
</h2>
```

#### Brand Buttons

```jsx
// Primary Button (Sunset Orange)
<button className="bg-sunset-orange hover:bg-magenta-pink text-white font-poppins font-medium px-md py-xs rounded h-touch transition-colors">
  Find Concerts
</button>

// Secondary Button (Outlined)
<button className="bg-transparent border border-white text-white font-poppins font-medium px-md py-xs rounded h-touch hover:bg-white hover:bg-opacity-15 transition-colors">
  View All
</button>

// Gradient Button (Special)
<button className="bg-brand-gradient text-white font-poppins font-semibold px-md py-xs rounded h-touch hover:brightness-110 transition-all">
  Get Started
</button>
```

#### Brand Cards

```jsx
// Standard Card
<div className="bg-white bg-opacity-10 rounded p-md">
  <h3 className="font-poppins font-semibold text-white mb-xs">Card Title</h3>
  <p className="font-manrope text-white text-opacity-90">
    Card content with appropriate contrast and readability.
  </p>
</div>

// Featured Card
<div className="bg-background rounded p-md border border-transparent relative overflow-hidden">
  {/* Gradient border effect */}
  <div className="absolute inset-0 bg-brand-gradient p-[1px] -z-10 rounded"></div>
  
  <h3 className="font-poppins font-semibold brand-gradient-text mb-xs">Featured Content</h3>
  <p className="font-manrope text-white">
    Special content highlighted with brand elements.
  </p>
</div>
```

#### Navigation

```jsx
// Mobile Bottom Navigation
<nav className="fixed bottom-0 left-0 right-0 h-nav bg-background bg-opacity-95 border-t border-white border-opacity-10 flex justify-around items-center z-10">
  {/* Active item */}
  <a href="/" className="flex flex-col items-center pt-xs">
    <div className="bg-brand-gradient p-[2px] rounded-full">
      <svg className="w-6 h-6 text-white" />
    </div>
    <span className="text-xs font-manrope font-medium text-white mt-xxs">Home</span>
  </a>
  
  {/* Inactive item */}
  <a href="/search" className="flex flex-col items-center pt-xs">
    <svg className="w-6 h-6 text-white text-opacity-70" />
    <span className="text-xs font-manrope font-medium text-white text-opacity-70 mt-xxs">Search</span>
  </a>
</nav>
```

## Examples of UI Components with Updated Branding

### Loading Screen / Splash Screen

```jsx
<div className="bg-background min-h-screen flex flex-col items-center justify-center p-md">
  {/* Gradient logo */}
  <img 
    src="/logo/encorelando-logo-gradient.svg" 
    alt="EncoreLando" 
    className="w-64 h-auto mb-lg"
  />
  
  {/* Typography split brand name */}
  <div className="typography-split text-white text-2xl mb-xl">
    <span className="enc">enc</span>
    <span className="or">or</span>
    <span className="e">e</span>
    <span className="lando">lando</span>
  </div>
  
  {/* Loading indicator with gradient */}
  <div className="relative w-48 h-1 bg-white bg-opacity-10 rounded-full overflow-hidden">
    <div className="absolute inset-y-0 left-0 w-1/2 bg-brand-gradient animate-pulse rounded-full"></div>
  </div>
</div>
```

### Header with Logo

```jsx
<header className="bg-background p-md flex items-center justify-between">
  {/* White logo (preferred on dark) */}
  <div className="flex items-center">
    <img 
      src="/logo/encorelando-logo-white.svg" 
      alt="EncoreLando" 
      className="h-8 w-auto"
    />
  </div>
  
  {/* Navigation icons in white */}
  <div className="flex items-center space-x-sm">
    <button className="text-white p-xs rounded-full hover:bg-white hover:bg-opacity-10">
      <svg className="w-6 h-6" />
    </button>
    <button className="text-white p-xs rounded-full hover:bg-white hover:bg-opacity-10">
      <svg className="w-6 h-6" />
    </button>
  </div>
</header>
```

## Visual Design Review Checklist

When implementing the updated branding, verify the following:

1. **Dark Background Implementation**
   - Default to dark background (#0D0D0D) for all screens
   - Ensure proper contrast with text and UI elements
   - Apply subtle gradients and accents as highlights

2. **Typography Application**
   - Use Poppins for headings and emphasis
   - Use Manrope for body text and longer content
   - Apply typography split on brand name when displayed

3. **Color Usage**
   - Apply accent colors purposefully and sparingly
   - Use gradient for special emphasis and featured elements
   - Maintain sufficient contrast for accessibility

4. **Consistent Logo Usage**
   - Default to white monochrome logo on dark backgrounds
   - Apply gradient logo only for special emphasis
   - Maintain proper clear space around logo

5. **UI Component Updates**
   - Update buttons to use new color palette
   - Refresh card designs with dark background and appropriate accents
   - Update navigation with new active/inactive states

6. **Animation & Transitions**
   - Apply subtle animations that reflect the energy of live music
   - Use gradient animations for loading states
   - Implement smooth transitions between UI states

By following this updated style guide, the EncoreLando application will maintain a consistent, branded experience that conveys the excitement of live music at Orlando theme parks while providing an accessible, usable interface for all users.
