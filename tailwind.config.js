// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    colors: {
      // Brand colors - UPDATED for new branding
      'background': '#0D0D0D', // New dark background
      'sunset-orange': '#FF6A00', // New primary accent
      'magenta-pink': '#FF3CAC', // New secondary accent
      'deep-orchid': '#7B2FF7', // New accent
      'neon-blue': '#00C3FF', // New accent
      
      // Legacy colors maintained for backward compatibility
      'primary': '#7E57C2',
      'primary-dark': '#4D2C91',
      'primary-light': '#B085F5',
      'secondary': '#26A69A',
      'secondary-dark': '#00766C',
      'secondary-light': '#64D8CB',
      
      // Neutral colors
      'dark-gray': '#333333',
      'medium-gray': '#757575',
      'light-gray': '#E0E0E0',
      'off-white': '#F5F5F5',
      'white': '#FFFFFF',
      'black': '#000000',
      
      // Semantic colors
      'success': '#66BB6A',
      'error': '#E53935',
      'warning': '#FFA726',
      'info': '#29B6F6',
      
      // Transparent
      'transparent': 'transparent',
    },
    fontFamily: {
      // UPDATED font families
      'poppins': ['Poppins', 'system-ui', 'sans-serif'],
      'manrope': ['Manrope', 'system-ui', 'sans-serif'],
      'sans': ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      'heading': ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
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
    extend: {
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
      height: {
        'touch': '48px',
        'nav': '56px',
      },
      maxWidth: {
        'content': '1200px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)',
        'nav': '0 -2px 4px rgba(0,0,0,0.1)',
      },
      gridTemplateColumns: {
        'mobile': 'repeat(4, minmax(0, 1fr))',
        'tablet': 'repeat(8, minmax(0, 1fr))',
        'desktop': 'repeat(12, minmax(0, 1fr))',
      },
      // Add gradient backgrounds
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #FF6A00 0%, #FF3CAC 35%, #7B2FF7 65%, #00C3FF 100%)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  variants: {
    extend: {
      // Enable hover only for non-touch devices
      backgroundColor: ['responsive', 'hover', 'focus', 'active'],
      transform: ['responsive', 'hover', 'focus', 'active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Function to add base styles for touch targets
    function ({ addBase }) {
      addBase({
        'button, [role="button"], a, input, select': {
          'min-height': '44px',
          'min-width': '44px',
        },
      });
    },
  ],
  // Mobile-first breakpoints
  screens: {
    'sm': '640px',    // Small tablets and large phones
    'md': '768px',    // Tablets
    'lg': '1024px',   // Desktops
    'xl': '1280px',   // Large desktops
  },
};