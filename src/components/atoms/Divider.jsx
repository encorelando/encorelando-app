import React from 'react';
import PropTypes from 'prop-types';

/**
 * Divider component for separating content
 * Mobile-friendly spacing options
 */
const Divider = ({
  orientation = 'horizontal',
  margin = 'md',
  color = 'light-gray',
  thickness = 1,
  className = '',
}) => {
  // Base classes
  const baseClasses = 'flex';
  
  // Orientation classes
  const orientationClasses = {
    horizontal: 'w-full',
    vertical: 'h-full',
  };
  
  // Margin classes that work well on mobile screens
  const marginClasses = {
    none: orientation === 'horizontal' ? 'my-0' : 'mx-0',
    xs: orientation === 'horizontal' ? 'my-xs' : 'mx-xs',
    sm: orientation === 'horizontal' ? 'my-sm' : 'mx-sm',
    md: orientation === 'horizontal' ? 'my-md' : 'mx-md',
    lg: orientation === 'horizontal' ? 'my-lg' : 'mx-lg',
    xl: orientation === 'horizontal' ? 'my-xl' : 'mx-xl',
  };
  
  // Color classes
  const colorClasses = {
    'primary': 'bg-primary',
    'secondary': 'bg-secondary',
    'light-gray': 'bg-light-gray',
    'medium-gray': 'bg-medium-gray',
    'dark-gray': 'bg-dark-gray',
  };
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${orientationClasses[orientation]} ${marginClasses[margin]} ${colorClasses[color]} ${className}`;
  
  // Style based on orientation and thickness
  const style = orientation === 'horizontal' 
    ? { height: `${thickness}px` } 
    : { width: `${thickness}px` };

  return (
    <div 
      className={combinedClasses}
      style={style}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  margin: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'light-gray', 'medium-gray', 'dark-gray']),
  thickness: PropTypes.number,
  className: PropTypes.string,
};

export default Divider;