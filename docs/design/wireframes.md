# EncoreLando Mobile-First Wireframes

This document outlines the key screens of the EncoreLando application with a strict mobile-first approach. These wireframes serve as a foundation for the UI development, focusing on the primary use cases for our target audience: theme park visitors using mobile devices while at parks, standing in lines, or planning from hotel rooms.

## Design Principles

Based on our mobile-first mandate, these wireframes adhere to the following principles:

1. **Touch-optimized interfaces**: All interactive elements have a minimum touch target size of 44×44 pixels
2. **Bottom navigation**: Key actions are placed within thumb reach
3. **Swipe-friendly navigation**: Horizontal swiping for related content (dates, venues)
4. **Performance optimization**: Simple UI elements that load quickly
5. **Context-aware content**: Time-based highlighting of today's performances
6. **High contrast**: Readability in outdoor environments

## Key Screens

### 1. Home Screen

```
┌─────────── Mobile (375px) ───────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │          EncoreLando         │    │ Header
│  └──────────────────────────────┘    │
│                                      │
│  TODAY'S PERFORMANCES                │
│  ┌──────────────────────────────┐    │
│  │ Artist Name @ Venue          │    │
│  │ 2:00 PM - 3:00 PM            │    │
│  │ Festival: Food & Wine         >   │ Card with right chevron
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Artist Name @ Venue          │    │
│  │ 4:30 PM - 5:30 PM            │    │
│  │ Festival: Mardi Gras          >   │
│  └──────────────────────────────┘    │
│                                      │
│  UPCOMING FESTIVALS                  │
│  ┌────────┐ ┌────────┐ ┌────────┐    │
│  │Festival│ │Festival│ │Festival│    │ Horizontal scrollable
│  │   1    │ │   2    │ │   3    │    │
│  └────────┘ └────────┘ └────────┘    │
│  < - - - - - - - - - - - - - - >     │
│                                      │
│  FEATURED ARTISTS                    │
│  ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Artist │ │ Artist │ │ Artist │    │ Horizontal scrollable
│  │    1   │ │    2   │ │    3   │    │
│  └────────┘ └────────┘ └────────┘    │
│  < - - - - - - - - - - - - - - >     │
│                                      │
│                                      │
│  ┌─────┐     ┌─────┐     ┌─────┐     │
│  │ HOME│     │SEARCH│     │ MORE │    │ Bottom navigation
│  └─────┘     └─────┘     └─────┘     │
└──────────────────────────────────────┘
```

**Mobile-First Considerations:**
- Cards have sufficient touch targets (entire card is tappable)
- Horizontal scrolling for browsing related content
- Limited content per screen to reduce cognitive load
- Today's performances at the top for instant relevance
- Bottom navigation bar for core actions

### 2. Calendar View

```
┌─────────── Mobile (375px) ───────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │     Concerts Calendar        │    │ Header
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Apr 2025   <   Today   >     │    │ Month selector
│  └──────────────────────────────┘    │
│                                      │
│  ┌──┬──┬──┬──┬──┬──┬──┐              │
│  │Su│Mo│Tu│We│Th│Fr│Sa│              │ Calendar day headers
│  ├──┼──┼──┼──┼──┼──┼──┤              │
│  │  │  │  │1 │2 │3 │4 │              │
│  ├──┼──┼──┼──┼──┼──┼──┤              │
│  │5 │6 │7 │8 │9 │10│11│              │ Calendar grid
│  ├──┼──┼──┼──┼──┼──┼──┤              │ (Number indicates date)
│  │12│13│14│15│16│17│18│              │
│  ├──┼──┼──┼──┼──┼──┼──┤              │
│  │19│20│21│22│23│24│25│              │
│  ├──┼──┼──┼──┼──┼──┼──┤              │
│  │26│27│28│29│30│  │  │              │
│  └──┴──┴──┴──┴──┴──┴──┘              │
│                                      │
│  APRIL 27, 2025                      │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Artist Name @ Venue          │    │
│  │ 2:00 PM - 3:00 PM            │    │
│  │ Festival: Food & Wine         >   │ Performances for
│  └──────────────────────────────┘    │ selected date
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Artist Name @ Venue          │    │
│  │ 4:30 PM - 5:30 PM            │    │
│  │ Festival: Mardi Gras          >   │
│  └──────────────────────────────┘    │
│                                      │
│  ┌─────┐     ┌─────┐     ┌─────┐     │
│  │ HOME│     │SEARCH│     │ MORE │    │ Bottom navigation
│  └─────┘     └─────┘     └─────┘     │
└──────────────────────────────────────┘
```

**Mobile-First Considerations:**
- Calendar days have minimum 44×44px touch targets
- Selected date highlighted with high contrast
- Performances appear below calendar for the selected date
- Dates with events visually indicated (could use dot indicators)
- Swipe gestures supported for moving between months

### 3. Concert Detail View

```
┌─────────── Mobile (375px) ───────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │ < Back    Concert Details    │    │ Header with back button
│  └──���───────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │                              │    │
│  │          Artist Image        │    │ Artist image
│  │                              │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ARTIST NAME                         │ Artist name
│                                      │
│  Sunday, April 27, 2025              │
│  2:00 PM - 3:00 PM                   │ Date and time
│                                      │
│  EPCOT America Gardens Theatre       │ Venue
│  EPCOT International Food & Wine     │ Festival
│                                      │
│  ABOUT THIS PERFORMANCE              │
│  Lorem ipsum dolor sit amet,         │
│  consectetur adipiscing elit. Sed    │ Performance details
│  do eiusmod tempor incididunt ut     │
│  labore et dolore magna aliqua.      │
│                                      │
│  GENRES                              │
│  ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Rock   │ │ Pop    │ │ Folk   │    │ Genre tags
│  └────────┘ └────────┘ └────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │    View Artist Profile       │    │ CTA Button
│  └──────────────────────────────┘    │
│                                      │
│  ┌─────┐     ┌─────┐     ┌─────┐     │
│  │ HOME│     │SEARCH│     │ MORE │    │ Bottom navigation
│  └─────┘     └─────┘     └─────┘     │
└──────────────────────────────────────┘
```

**Mobile-First Considerations:**
- Back button in top left for easy navigation
- Critical information (date, time, venue) prominently displayed
- Images optimized for mobile loading
- Content prioritized by importance (top to bottom)
- Single column layout for easy scrolling

### 4. Search & Filter Screen

```
┌─────────── Mobile (375px) ───────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │           Search             │    │ Header
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 🔍 Search concerts & artists │    │ Search input
│  └──────────────────────────────┘    │
│                                      │
│  FILTERS                             │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Date Range          ▼        │    │ Filter accordions
│  └──────────────────────────────┘    │ (expandable)
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Parks                ▼        │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Festivals            ▼        │    │
│  └──────────────────────────────┘    │
│                                      │
│  RECENT SEARCHES                     │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ "Rock bands"                 │    │
│  └──────────────────────────────┘    │ Recent searches
│                                      │
│  ┌──────────────────────────────┐    │
│  │ "EPCOT festivals"            │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │       Apply Filters          │    │ CTA Button
│  └──────────────────────────────┘    │
│                                      │
│  ┌─────┐     ┌─────┐     ┌─────┐     │
│  │ HOME│     │SEARCH│     │ MORE │    │ Bottom navigation
│  └─────┘     └─────┘     └─────┘     │
└──────────────────────────────────────┘
```

**Mobile-First Considerations:**
- Large search input for easy touch interaction
- Expandable filter sections to save vertical space
- Recent searches for quick access to common queries
- Clear call-to-action button for applying filters
- Filter options have sufficient touch targets

### 5. Artist Profile View

```
┌─────────── Mobile (375px) ───────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │ < Back    Artist Profile     │    │ Header with back button
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │                              │    │
│  │          Artist Image        │    │ Artist image
│  │                              │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ARTIST NAME                         │ Artist name
│                                      │
│  ABOUT THE ARTIST                    │
│  Lorem ipsum dolor sit amet,         │
│  consectetur adipiscing elit. Sed    │ Artist bio
│  do eiusmod tempor incididunt ut     │
│  labore et dolore magna aliqua.      │
│                                      │
│  GENRES                              │
│  ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Rock   │ │ Pop    │ │ Folk   │    │ Genre tags
│  └────────┘ └────────┘ └────────┘    │
│                                      │
│  UPCOMING PERFORMANCES               │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Sunday, April 27, 2025       │    │
│  │ 2:00 PM @ America Gardens    │    │ Performance card
│  │ Festival: Food & Wine         >   │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Monday, April 28, 2025       │    │
│  │ 4:30 PM @ America Gardens    │    │ Performance card
│  │ Festival: Food & Wine         >   │
│  └──────────────────────────────┘    │
│                                      │
│  ┌─────┐     ┌─────┐     ┌─────┐     │
│  │ HOME│     │SEARCH│     │ MORE │    │ Bottom navigation
│  └─────┘     └─────┘     └─────┘     │
└──────────────────────────────────────┘
```

**Mobile-First Considerations:**
- Back button for easy navigation
- Single column layout for scrollable content
- Upcoming performances cards are fully tappable
- Genre tags for quick visual identification
- Image optimized for mobile loading

### 6. Festival Detail View

```
┌─────────── Mobile (375px) ───────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │ < Back   Festival Details    │    │ Header with back button
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │                              │    │
│  │        Festival Image        │    │ Festival image
│  │                              │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  FESTIVAL NAME                       │ Festival name
│                                      │
│  April 15 - May 30, 2025             │ Festival dates
│  EPCOT                               │ Park name
│                                      │
│  ABOUT THIS FESTIVAL                 │
│  Lorem ipsum dolor sit amet,         │
│  consectetur adipiscing elit. Sed    │ Festival description
│  do eiusmod tempor incididunt ut     │
│  labore et dolore magna aliqua.      │
│                                      │
│  LINEUP                              │
│                                      │
│  Date: ┌─────────────────────┐       │
│        │ Apr 27 ▼            │       │ Date selector dropdown
│        └─────────────────────┘       │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Artist Name                  │    │
│  │ 2:00 PM @ America Gardens   >│    │ Performance card
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Artist Name                  │    │
│  │ 4:30 PM @ America Gardens   >│    │ Performance card
│  └──────────────────────────────┘    │
│                                      │
│  ┌─────┐     ┌─────┐     ┌─────┐     │
│  │ HOME│     │SEARCH│     │ MORE │    │ Bottom navigation
│  └─────┘     └─────┘     └─────┘     │
└──────────────────────────────────────┘
```

**Mobile-First Considerations:**
- Date selector for quickly viewing different days of the festival
- Performance cards are fully tappable with sufficient size
- Festival information prioritized from most to least important
- Single column layout for scrollable content
- Back button positioned for easy thumb access

## Tablet & Desktop Enhancements (Progressive Enhancement)

While maintaining our mobile-first approach, these wireframes can be progressively enhanced for larger screens:

1. **Multi-column layouts** for desktop views (2+ columns where appropriate)
2. **Persistent sidebar navigation** to replace bottom navigation on larger screens
3. **Expanded calendar view** showing more weeks at once
4. **Side-by-side details** for concert/artist information and related content
5. **Hover states** for interactive elements on desktop

These enhancements should be implemented only after the mobile experience is fully optimized and tested.

## Implementation Notes

1. All touch targets should maintain minimum size of 44×44 pixels
2. Font sizes should be minimum 16px for body text, with headings proportionally larger
3. High contrast color combinations should be used for text and backgrounds
4. Loading states should be implemented for all data-fetching operations
5. Error states should be user-friendly and provide clear recovery paths
6. All interactive elements should have clear visual affordances
7. Images should be lazy-loaded and use responsive image techniques
8. Critical content should be visible without scrolling on initial load

## Accessibility Considerations

1. **Color contrast**: Maintain WCAG AA minimum contrast ratios (4.5:1 for normal text)
2. **Text alternatives**: All images must have appropriate alt text
3. **Keyboard navigation**: All interactive elements must be keyboard accessible
4. **Screen reader compatibility**: Proper ARIA labels and semantic HTML
5. **Touch targets**: Large enough for users with motor impairments
6. **Text resizing**: Design should accommodate text resizing up to 200%
7. **Reduced motion**: Provide options for users who prefer reduced motion

## Next Steps

1. Create high-fidelity mockups for key screens
2. Develop UI component library based on these wireframes
3. Implement responsive breakpoints for tablet and desktop views
4. Create interactive prototypes for user testing
5. Refine designs based on feedback before development

These wireframes provide the foundation for implementing the EncoreLando UI with a strict mobile-first approach, ensuring the application meets the needs of users accessing it primarily through mobile devices while at theme parks or planning their visits.
