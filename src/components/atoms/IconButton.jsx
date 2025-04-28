import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * IconButton component for mobile-friendly icon-only buttons
 * Ensures proper touch target size for mobile devices
 */
const IconButton = ({
  icon,
  ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}) => {
  // Base classes ensuring minimum touch target size (44x44px)
  const baseClasses = 'inline-flex items-center justify-center rounded-full min-h-touch min-w-touch focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  // Variant-specific classes updated for dark theme
  const variantClasses = {
    primary: 'bg-sunset-orange text-white hover:bg-magenta-pink focus:ring-white',
    secondary: 'bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-15 focus:ring-white',
    ghost: 'text-white hover:bg-white hover:bg-opacity-10 focus:ring-white',
    gradient: 'bg-brand-gradient text-white hover:brightness-110 focus:ring-white',
    danger: 'text-error hover:bg-error hover:text-white focus:ring-error',
  };
  
  // Size classes - ensuring proper touch area
  const sizeClasses = {
    sm: 'p-xxs',
    md: 'p-xs',
    lg: 'p-sm',
  };
  
  // Icon sizes mapped to button sizes
  const iconSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  };
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <button
      type="button"
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <Icon name={icon} size={iconSizes[size]} />
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'gradient', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default IconButton;