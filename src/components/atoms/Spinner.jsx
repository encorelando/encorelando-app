import React from 'react';
import PropTypes from 'prop-types';

/**
 * Spinner component for loading states
 * Mobile-optimized with appropriate sizes
 */
const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  // Size classes in pixels
  const sizeMapping = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-medium-gray',
  };
  
  // Calculate dimensions
  const dimensions = sizeMapping[size];
  
  // Combined classes
  const combinedClasses = `animate-spin ${colorClasses[color]} ${className}`;

  return (
    <svg
      className={combinedClasses}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={dimensions}
      height={dimensions}
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'gray']),
  className: PropTypes.string,
};

export default Spinner;