import React from 'react';
import PropTypes from 'prop-types';

/**
 * Divider component using the new EncoreLando branding
 * Mobile-friendly with support for brand gradient
 */
const Divider = ({
  orientation = 'horizontal',
  margin = 'md',
  color = 'white',
  gradient = false,
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
  
  // Color classes updated for dark theme
  const colorClasses = {
    'sunset-orange': 'bg-sunset-orange',
    'magenta-pink': 'bg-magenta-pink',
    'deep-orchid': 'bg-deep-orchid',
    'neon-blue': 'bg-neon-blue',
    'white': 'bg-white bg-opacity-20',
    'medium-gray': 'bg-white bg-opacity-10',
  };
  
  // Choose between gradient or solid color
  const backgroundClass = gradient ? 'bg-brand-gradient' : colorClasses[color];
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${orientationClasses[orientation]} ${marginClasses[margin]} ${backgroundClass} ${className}`;
  
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
  color: PropTypes.oneOf(['sunset-orange', 'magenta-pink', 'deep-orchid', 'neon-blue', 'white', 'medium-gray']),
  gradient: PropTypes.bool,
  thickness: PropTypes.number,
  className: PropTypes.string,
};

export default Divider;