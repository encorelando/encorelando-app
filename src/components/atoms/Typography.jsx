import React from 'react';
import PropTypes from 'prop-types';

/**
 * Typography component for consistent text styling
 * Mobile-optimized with responsive font sizes
 */
const Typography = ({
  variant = 'body1',
  color = 'dark-gray',
  align = 'left',
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

  // Base classes for all typography
  const baseClasses = 'font-sans';

  // Variant-specific classes with mobile-first responsive sizes
  const variantClasses = {
    h1: 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight',
    h2: 'text-xl sm:text-2xl lg:text-3xl font-bold leading-tight',
    h3: 'text-lg sm:text-xl lg:text-2xl font-semibold leading-snug',
    h4: 'text-base sm:text-lg lg:text-xl font-semibold leading-snug',
    body1: 'text-base leading-normal',
    body2: 'text-sm leading-normal',
    caption: 'text-xs leading-normal',
    button: 'text-base font-medium',
  };

  // Color classes
  const colorClasses = {
    'primary': 'text-primary',
    'secondary': 'text-secondary',
    'dark-gray': 'text-dark-gray',
    'medium-gray': 'text-medium-gray',
    'light-gray': 'text-light-gray',
    'white': 'text-white',
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

  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${colorClasses[color]} ${alignClasses[align]} ${className}`;

  return (
    <Element className={combinedClasses}>
      {children}
    </Element>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption', 'button']),
  color: PropTypes.oneOf([
    'primary', 'secondary', 'dark-gray', 'medium-gray', 
    'light-gray', 'white', 'error', 'success', 'warning', 'info'
  ]),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
  element: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Typography;