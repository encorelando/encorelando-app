import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge component for displaying status indicators
 * Mobile-optimized for visibility on small screens
 */
const Badge = ({
  text,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-dark-gray',
    info: 'bg-info text-white',
    outline: 'bg-transparent border border-medium-gray text-dark-gray',
  };
  
  // Size classes - making sure badges are visible on mobile screens
  const sizeClasses = {
    sm: 'text-xs px-xs py-xxs',
    md: 'text-sm px-sm py-xxs',
    lg: 'text-base px-md py-xs',
  };
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={combinedClasses}>
      {text}
    </span>
  );
};

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Badge;