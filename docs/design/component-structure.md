# EncoreLando React Component Structure

This document outlines the component structure for the EncoreLando web application. The architecture follows a mobile-first approach with component organization that promotes reusability, performance, and maintainability.

## Component Organization Philosophy

Our component architecture follows these key principles:

1. **Mobile-first implementation**: All components are designed for mobile experiences first, then progressively enhanced for larger screens
2. **Atomic design methodology**: Components are categorized as atoms, molecules, organisms, templates, and pages
3. **Performance optimization**: Lazy-loading, code-splitting, and optimized rendering
4. **Reusability**: Components are designed to be reusable across different parts of the application
5. **Accessibility**: WCAG compliance built into component design

## Directory Structure

```
src/
├── components/
│   ├── atoms/           # Smallest building blocks
│   ├── molecules/       # Groups of atoms
│   ├── organisms/       # Groups of molecules
│   ├── templates/       # Page layouts
│   └── pages/           # Complete page components
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── services/            # API and other services
├── utils/               # Utility functions
├── assets/              # Static assets
└── styles/              # Global styles and theme
```

## Component Breakdown

### Atoms (Basic Building Blocks)

These are the smallest, most reusable components that serve as building blocks for the application.

| Component              | Description                                         | Props                                           |
|------------------------|-----------------------------------------------------|------------------------------------------------|
| `Button`               | Reusable button with variants                       | `variant, size, onClick, disabled, children`    |
| `IconButton`           | Button with icon only                               | `icon, onClick, ariaLabel, size, disabled`      |
| `Typography`           | Text component with variants                        | `variant, color, align, children`               |
| `Icon`                 | SVG icon wrapper                                    | `name, size, color`                             |
| `Input`                | Text input field                                    | `type, value, onChange, placeholder, error`     |
| `Card`                 | Basic card container                                | `variant, onClick, children`                    |
| `Badge`                | Small status indicator                              | `variant, text`                                 |
| `Spinner`              | Loading indicator                                   | `size, color`                                   |
| `Divider`              | Horizontal or vertical divider                      | `orientation, margin`                           |
| `Tag`                  | Display label/tag (e.g., genres)                    | `text, onClick`                                 |

### Molecules (Combinations of Atoms)

These components combine multiple atoms to create more complex, reusable UI patterns.

| Component              | Description                                         | Composed of                                     |
|------------------------|-----------------------------------------------------|------------------------------------------------|
| `SearchInput`          | Search field with icon and clear button             | `Input`, `Icon`, `IconButton`                   |
| `NavItem`              | Navigation item with icon and label                 | `Icon`, `Typography`, container                 |
| `FormField`            | Label, input, and error message                     | `Typography`, `Input`, error message            |
| `CardHeader`           | Header section for cards                            | `Typography`, optional `Icon`                   |
| `DatePicker`           | Mobile-friendly date selector                       | Custom implementation with `Button`, `Typography` |
| `FilterChip`           | Selectable filter option                            | `Button` variant with toggle state              |
| `AlertMessage`         | Status/alert message component                      | `Icon`, `Typography`, container                 |
| `ImageThumbnail`       | Image with standardized loading and error states    | `Image`, `Spinner`, fallback                    |
| `ExpandableSection`    | Toggle-able content section                         | `Button`, content container, animation          |

### Organisms (Complex Components)

These larger components compose multiple molecules to create distinct sections of the UI.

| Component              | Description                                         | Composed of                                     |
|------------------------|-----------------------------------------------------|------------------------------------------------|
| `BottomNavigation`     | Mobile bottom navigation bar                        | `NavItem` × multiple                            |
| `PerformanceCard`      | Card displaying concert details                     | `Card`, `Typography`, `Icon`, etc.              |
| `ArtistCard`           | Card displaying artist details                      | `Card`, `ImageThumbnail`, `Typography`, etc.    |
| `FestivalCard`         | Card displaying festival details                    | `Card`, `ImageThumbnail`, `Typography`, etc.    |
| `Calendar`             | Interactive calendar component                      | Custom date grid, `Button`, etc.                |
| `FilterAccordion`      | Expandable filter section                           | `ExpandableSection`, `FilterChip` × multiple    |
| `SearchFilters`        | Collection of search filter controls                | `FilterAccordion` × multiple                    |
| `PerformanceList`      | List of performance cards                           | `PerformanceCard` × multiple                    |
| `HorizontalScroller`   | Horizontally scrollable container                   | Scroll container, `IconButton` navigation       |
| `ImageHeader`          | Header with background image                        | Background image, `Typography`, gradient overlay |

### Templates (Page Layouts)

These components define the layout structure for different page types.

| Component              | Description                                         | Composed of                                     |
|------------------------|-----------------------------------------------------|------------------------------------------------|
| `PageLayout`           | Base page layout with navigation                    | `BottomNavigation`, content container           |
| `DetailPageLayout`     | Layout for detail pages with back button            | `PageLayout` + back navigation                  |
| `SearchPageLayout`     | Layout for search results                           | `PageLayout` + `SearchInput` + results area     |
| `CalendarPageLayout`   | Layout for calendar view                            | `PageLayout` + `Calendar` + results area        |
| `HomePageLayout`       | Layout for the home page                            | `PageLayout` + sections for featured content    |

### Pages (Complete Views)

These components implement complete pages using templates and organisms.

| Component              | Description                                         | Composed of                                     |
|------------------------|-----------------------------------------------------|------------------------------------------------|
| `HomePage`             | Main landing page                                   | `HomePageLayout` + content components           |
| `CalendarPage`         | Calendar view of concerts                           | `CalendarPageLayout` + `PerformanceList`        |
| `SearchPage`           | Search and filters                                  | `SearchPageLayout` + `SearchFilters`            |
| `ConcertDetailPage`    | Concert details                                     | `DetailPageLayout` + concert details components |
| `ArtistDetailPage`     | Artist profile and performances                     | `DetailPageLayout` + artist details components  |
| `FestivalDetailPage`   | Festival details and lineup                         | `DetailPageLayout` + festival details components|
| `VenueDetailPage`      | Venue information and schedule                      | `DetailPageLayout` + venue details components   |
| `ParkDetailPage`       | Park information, venues, festivals                 | `DetailPageLayout` + park details components    |
| `NotFoundPage`         | 404 error page                                      | Custom error message and navigation             |

## Context Providers

Global state and functionality shared across components.

| Provider               | Description                                         | Key Features                                    |
|------------------------|-----------------------------------------------------|------------------------------------------------|
| `ThemeProvider`        | Theme variables and dark/light mode                 | Theme toggling, accessing theme variables       |
| `AuthProvider`         | Authentication state and functions                  | Login, logout, auth state                       |
| `ApiProvider`          | API client and request state                        | API client instance, error handling             |
| `SearchProvider`       | Search parameters and results                       | Search state, filter management                 |
| `NotificationProvider` | App notifications and alerts                        | Show/hide notifications                         |

## Custom Hooks

Reusable logic extracted into custom hooks.

| Hook                   | Description                                         | Returns                                         |
|------------------------|-----------------------------------------------------|------------------------------------------------|
| `useConcerts`          | Fetch and filter concerts                           | `{ concerts, loading, error, fetchConcerts }`   |
| `useArtists`           | Fetch and filter artists                            | `{ artists, loading, error, fetchArtists }`     |
| `useFestivals`         | Fetch and filter festivals                          | `{ festivals, loading, error, fetchFestivals }` |
| `useVenues`            | Fetch and filter venues                             | `{ venues, loading, error, fetchVenues }`       |
| `useParks`             | Fetch and filter parks                              | `{ parks, loading, error, fetchParks }`         |
| `useSearch`            | Search functionality for entities                   | `{ search, results, loading, error }`           |
| `useFilter`            | Filter functionality for entity lists               | `{ filters, setFilters, applyFilters }`         |
| `useMediaQuery`        | Responsive design breakpoint detection              | `{ isMobile, isTablet, isDesktop }`             |
| `useLocalStorage`      | Local storage with React state                      | `[value, setValue]`                             |

## Mobile-First Implementation Details

### Responsive Component Adaptations

Our mobile-first approach means components are designed for mobile first, then adapted for larger screens:

1. **Bottom Navigation → Sidebar Navigation**
   - Mobile: `BottomNavigation` fixed to bottom of screen
   - Tablet/Desktop: Transforms to sidebar or top navigation bar

2. **Card Components**
   - Mobile: Full-width cards in single column
   - Tablet: Two-column grid layout
   - Desktop: Multi-column grid with hover effects

3. **Calendar Component**
   - Mobile: Compact view with limited date range
   - Tablet/Desktop: Expanded view showing more dates

4. **Search and Filters**
   - Mobile: Filters in expandable accordion sections
   - Tablet/Desktop: More filters visible at once in sidebar

5. **Detail Pages**
   - Mobile: Stacked sections for readability
   - Tablet/Desktop: Side-by-side content where appropriate

### Performance Optimizations

1. **Lazy Loading and Code Splitting**
   ```jsx
   // Example of lazy loading pages
   const HomePage = React.lazy(() => import('./pages/HomePage'));
   const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
   
   // With suspense fallback
   <Suspense fallback={<Spinner />}>
     <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/calendar" element={<CalendarPage />} />
     </Routes>
   </Suspense>
   ```

2. **Image Optimization**
   - Responsive image loading via srcset
   - Lazy loading images outside viewport
   - Proper image size optimization for mobile screens

3. **Component Virtualization**
   ```jsx
   // Virtualized lists for long content
   import { FixedSizeList } from 'react-window';
   
   function VirtualizedPerformanceList({ performances }) {
     return (
       <FixedSizeList
         height={500}
         width="100%"
         itemCount={performances.length}
         itemSize={100}
       >
         {({ index, style }) => (
           <div style={style}>
             <PerformanceCard performance={performances[index]} />
           </div>
         )}
       </FixedSizeList>
     );
   }
   ```

## Accessibility Implementations

All components implement these accessibility features:

1. **Semantic HTML**
   ```jsx
   // Example of semantic HTML in navigation
   <nav aria-label="Main navigation">
     <ul>
       <li><NavItem to="/" label="Home" icon="home" /></li>
       <li><NavItem to="/search" label="Search" icon="search" /></li>
     </ul>
   </nav>
   ```

2. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Focus states are clearly visible
   - Logical tab order maintained
   - Keyboard shortcuts for power users

3. **ARIA Attributes**
   ```jsx
   // Example of ARIA in expandable component
   <div>
     <button 
       aria-expanded={isExpanded} 
       aria-controls="filter-content" 
       onClick={toggleExpand}
     >
       {title}
     </button>
     <div 
       id="filter-content" 
       aria-hidden={!isExpanded}
     >
       {children}
     </div>
   </div>
   ```

4. **Screen Reader Considerations**
   - Hidden text for screen readers where needed
   - ARIA live regions for dynamic content
   - Descriptive labels for interactive elements

## Touch Optimizations

1. **Touch Target Sizes**
   ```css
   /* Example CSS for touch-friendly buttons */
   .button {
     min-height: 44px;
     min-width: 44px;
     padding: 12px 16px;
   }
   ```

2. **Gesture Support**
   ```jsx
   // Example of swipe gesture support
   function CalendarMonth({ onPrevMonth, onNextMonth }) {
     const handleSwipe = (direction) => {
       if (direction === 'left') {
         onNextMonth();
       } else if (direction === 'right') {
         onPrevMonth();
       }
     };
     
     return (
       <SwipeDetector onSwipe={handleSwipe}>
         <div className="calendar-month">
           {/* Calendar content */}
         </div>
       </SwipeDetector>
     );
   }
   ```

3. **Bottom Sheet Patterns**
   ```jsx
   // Example of mobile-friendly bottom sheet for filtering
   function MobileFilters({ isOpen, onClose, children }) {
     return (
       <div 
         className={`bottom-sheet ${isOpen ? 'open' : ''}`}
         aria-modal="true"
         role="dialog"
       >
         <div className="bottom-sheet-handle" />
         <div className="bottom-sheet-content">
           {children}
         </div>
         <button 
           className="bottom-sheet-close"
           onClick={onClose}
           aria-label="Close filters"
         >
           Done
         </button>
       </div>
     );
   }
   ```

## Testing Strategy

Each component should be tested for:

1. **Functionality**: Jest unit tests for logic
2. **Rendering**: React Testing Library for component rendering
3. **Accessibility**: Automated a11y testing with jest-axe
4. **Responsiveness**: Visual regression tests at different breakpoints
5. **Performance**: Metrics for initial load and interaction times

Example test setup:

```jsx
// Example component test with accessibility checks
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import Button from './Button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Implementation Examples

### Mobile-First Implementation Example: PerformanceCard

```jsx
// src/components/organisms/PerformanceCard.jsx
import React from 'react';
import Card from '../atoms/Card';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import { formatTime, formatDate } from '../../utils/dateUtils';

const PerformanceCard = ({ performance, onClick }) => {
  const { artist, venue, festival, startTime, endTime } = performance;
  
  return (
    <Card 
      onClick={onClick}
      className="performance-card"
      // Mobile-first styles with CSS utility classes
      variant="interactive"
    >
      <div className="performance-card__content">
        <Typography variant="h3" className="performance-card__artist">
          {artist.name}
        </Typography>
        
        <div className="performance-card__details">
          <div className="performance-card__time">
            <Icon name="clock" size="small" />
            <Typography variant="body2">
              {formatTime(startTime)}
              {endTime && ` - ${formatTime(endTime)}`}
            </Typography>
          </div>
          
          <div className="performance-card__venue">
            <Icon name="map-pin" size="small" />
            <Typography variant="body2">
              {venue.name}
            </Typography>
          </div>
          
          {festival && (
            <div className="performance-card__festival">
              <Icon name="calendar" size="small" />
              <Typography variant="body2">
                {festival.name}
              </Typography>
            </div>
          )}
        </div>
      </div>
      
      <div className="performance-card__chevron">
        <Icon name="chevron-right" />
      </div>
    </Card>
  );
};

export default PerformanceCard;
```

### Responsive CSS Example

```css
/* src/styles/components/_performance-card.scss */

.performance-card {
  width: 100%;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  /* Mobile-first base styles */
  &__content {
    flex: 1;
  }
  
  &__artist {
    margin-bottom: 8px;
    font-size: 18px;
    /* Ensure readability in bright outdoor conditions */
    font-weight: 600;
  }
  
  &__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  &__time,
  &__venue,
  &__festival {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  /* Tablet enhancements */
  @media (min-width: 768px) {
    padding: 20px;
    
    &__artist {
      font-size: 20px;
    }
    
    &__details {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;
    }
  }
  
  /* Desktop enhancements */
  @media (min-width: 1024px) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
```

## Component Development Workflow

1. **Identify requirements**: Determine functional and UX requirements
2. **Mobile wireframe**: Design component for mobile viewport first
3. **Implement base component**: Build core functionality for mobile
4. **Test mobile implementation**: Verify on small screens
5. **Add responsive enhancements**: Progressively enhance for larger screens
6. **Accessibility review**: Test with screen readers and keyboard
7. **Performance optimization**: Measure and optimize as needed
8. **Documentation**: Document props, usage examples, and variations

## Next Steps for Implementation

1. Set up base component library structure
2. Implement core atomic components
3. Create style system with mobile-first principles
4. Build page templates with responsive layouts
5. Implement pages following component hierarchy
6. Connect to API services via custom hooks
7. Test across multiple devices and screen sizes

This component structure provides a solid foundation for building the EncoreLando web application with a strict mobile-first approach, ensuring optimal experiences for users on mobile devices while at theme parks or planning their visits.
