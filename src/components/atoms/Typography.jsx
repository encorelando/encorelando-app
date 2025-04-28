import React from 'react';
import PropTypes from 'prop-types';

/**
 * Typography component implementing the new EncoreLando branding
 * Using Poppins for headings and Manrope for body text
 * Mobile-optimized with responsive font sizes
 */
const Typography = ({
  variant = 'body1',
  color = 'white',
  align = 'left',
  gradient = false,
  className = '',
  element,
  children,
}) => {
  // Map of variants to element types (default HTML elements)
  const variantMapping = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    button: 'span',
  };

  // Determine which HTML element to use
  const Element = element || variantMapping[variant];

  // Font family based on variant (Poppins for headings, Manrope for body text)
  const fontClasses = {
    h1: 'font-poppins',
    h2: 'font-poppins',
    h3: 'font-poppins',
    h4: 'font-poppins',
    body1: 'font-manrope',
    body2: 'font-manrope',
    caption: 'font-manrope',
    button: 'font-poppins',
  };

  // Variant-specific classes with mobile-first responsive sizes
  const variantClasses = {
    h1: 'text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight',
    h2: 'text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight',
    h3: 'text-lg sm:text-xl lg:text-2xl font-semibold leading-snug',
    h4: 'text-base sm:text-lg lg:text-xl font-medium leading-snug',
    body1: 'text-base leading-normal',
    body2: 'text-sm leading-normal',
    caption: 'text-xs leading-normal',
    button: 'text-base font-medium',
  };

  // Color classes updated for dark theme
  const colorClasses = {
    'primary': 'text-sunset-orange',
    'secondary': 'text-magenta-pink',
    'accent': 'text-deep-orchid',
    'accent-alt': 'text-neon-blue',
    'white': 'text-white',
    'medium-gray': 'text-white text-opacity-70',
    'light-gray': 'text-white text-opacity-50',
    'error': 'text-error',
    'success': 'text-success',
    'warning': 'text-warning',
    'info': 'text-info',
  };

  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  // Gradient text effect
  const gradientClass = gradient ? 'brand-gradient-text' : '';

  // Combined classes
  const combinedClasses = `${fontClasses[variant]} ${variantClasses[variant]} ${gradient ? '' : colorClasses[color]} ${alignClasses[align]} ${gradientClass} ${className}`;

  return (
    <Element className={combinedClasses}>
      {children}
    </Element>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption', 'button']),
  color: PropTypes.oneOf([
    'primary', 'secondary', 'accent', 'accent-alt', 'white', 
    'medium-gray', 'light-gray', 'error', 'success', 'warning', 'info'
  ]),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  gradient: PropTypes.bool,
  className: PropTypes.string,
  element: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Typography;