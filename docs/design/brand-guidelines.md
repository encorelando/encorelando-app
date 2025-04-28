# EncoreLando Brand Guidelines

## Brand Overview

EncoreLando is designed to evoke the excitement and energy of live music events set against the magical backdrop of Orlando's theme parks. Our branding reflects this unique combination through our color choices, typography, and logo design.

## Logo

Our logo symbolizes the fusion of music and the magic of Orlando's theme parks with a clean, modern design that incorporates musical elements.

### Logo Versions

| Version | Usage |
|---------|-------|
| **Full Color Gradient** | Primary version for marketing materials, splash screens, and featured sections |
| **Monochrome White** | Default version for use on dark backgrounds (recommended) |
| **Monochrome Black** | For use on light backgrounds when necessary |

### Logo Files

Logo files are available in multiple formats and sizes in the `/public/logo` directory:
- SVG (vector) for scalable use
- PNG at various resolutions (32px to 1024px)
- WebP for web optimization
- Favicon versions for browser tabs

### Logo Usage Guidelines

- **Clear Space**: Maintain minimum clear space around the logo equal to 10% of the logo height
- **Minimum Size**: Do not use the logo smaller than 32px in height to maintain legibility
- **Background**: Default to dark background (#0D0D0D) for best presentation
- **Modifications**: Do not stretch, distort, recolor, or alter the logo
- **Placement**: Position logo prominently and away from page edges

## Color Palette

### Primary Colors

| Color | HEX | Usage |
|-------|-----|-------|
| **Background Dark** | `#0D0D0D` | Default background color |
| **Sunset Orange** | `#FF6A00` | Primary accent color |
| **Magenta Pink** | `#FF3CAC` | Secondary accent color |
| **Deep Orchid** | `#7B2FF7` | Accent color |
| **Neon Blue** | `#00C3FF` | Accent color |
| **White** | `#FFFFFF` | Text and UI elements on dark backgrounds |

### Gradient

The brand gradient flows from Sunset Orange to Magenta Pink to Deep Orchid to Neon Blue:

```css
background: linear-gradient(90deg, #FF6A00 0%, #FF3CAC 35%, #7B2FF7 65%, #00C3FF 100%);
```

Use the gradient for:
- Special UI elements that need emphasis
- Section dividers
- Marketing materials
- Featured content backgrounds

### Color Usage Guidelines

- **Dark Background**: Default to the dark background color (#0D0D0D) for main interfaces
- **Contrast**: Ensure text maintains high contrast against backgrounds for readability
- **Accent Colors**: Use accent colors deliberately to highlight important elements
- **Gradients**: Maintain consistent gradient flow direction

## Typography

### Font Families

| Font | Usage |
|------|-------|
| **Poppins** | Used for "enc" and "e" in the brand name and primary headings |
| **Manrope** | Used for "or" and "lando" in the brand name and body text |

### Font Imports

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
```

### Typography Guidelines

- **Brand Name Split**: Typography in the EncoreLando name should follow:
  - "enc" in Poppins
  - "or" in Manrope
  - "e" in Poppins
  - "lando" in Manrope

- **Headings**: Use Poppins for headings with appropriate weight (500 or 600)
- **Body Copy**: Use Manrope for body text (400 weight)
- **Buttons and CTAs**: Use Poppins (500 weight) for buttons and calls to action
- **Line Height**: Set appropriate line heights for readability (1.4 for headings, 1.6 for body text)

## Logo on Different Backgrounds

While the preferred presentation is the white monochrome logo on the dark background (#0D0D0D), here are guidelines for different scenarios:

| Background | Logo Version | Notes |
|------------|--------------|-------|
| **Dark Background** (Preferred) | White Monochrome | Default and recommended usage |
| **Light Background** | Black Monochrome | Use only when dark background is not possible |
| **Gradient Background** | White Monochrome | For special promotional materials |
| **Photographic Background** | White Monochrome with 10% opacity black overlay | Ensure proper contrast with the background |

## Design Philosophy

The EncoreLando brand balances the following attributes:

- **Bold & Vibrant**: Representing the energy of live music events
- **Modern & Clean**: Easy to recognize and read on mobile devices
- **Approachable & Inviting**: Welcoming to all audiences
- **Trustworthy & Reliable**: Providing accurate information for planning

## Digital Applications

### Mobile-First Approach

- **Dark Mode by Default**: Use dark background for primary interfaces
- **High Contrast**: Ensure text and UI elements stand out clearly
- **Touch-Friendly**: Design UI elements with appropriate sizing for touch
- **Accessibility**: Maintain proper contrast ratios for all text (4.5:1 minimum)

### Web & App Interface

- Default to dark background (#0D0D0D)
- Use vibrant accent colors sparingly for emphasis
- Apply gradient to special UI elements for visual interest
- Ensure proper typography hierarchy using Poppins and Manrope

## Examples

### Logo on Dark Background
![EncoreLando Logo on Dark Background](/public/logo/encorelando-logo-white.svg)

### Logo with Gradient
![EncoreLando Gradient Logo](/public/logo/encorelando-logo-gradient.svg)

### Typography Split Example
enc**or**e**lando**
(Poppins-Manrope-Poppins-Manrope)

## Brand Voice

Our communication style should reflect our brand attributes:

- **Enthusiastic**: Conveying excitement about live music events
- **Clear & Direct**: Easy to understand and navigate
- **Helpful**: Providing valuable information for decision-making
- **Inclusive**: Welcoming to all audiences and accessibility needs

## Misuse Examples

Avoid these common mistakes:

- Using the logo on backgrounds without sufficient contrast
- Altering the logo colors outside of the approved versions
- Stretching or distorting the logo
- Using alternate fonts in place of Poppins and Manrope
- Using light backgrounds when dark backgrounds are possible
- Applying accent colors too heavily throughout the interface

By following these guidelines, we ensure a consistent, recognizable brand experience across all EncoreLando touchpoints.