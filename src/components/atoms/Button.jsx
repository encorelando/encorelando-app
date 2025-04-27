import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component with mobile-first design
 * Follows atomic design principles as a core atom component
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  ariaLabel,
  type = 'button',
  onClick,
  className = '',
}) => {
  // Base classes that ensure proper touch target size for mobile
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors min-h-touch';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary-light',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-light',
    ghost: 'text-primary hover:bg-primary-light hover:bg-opacity-10 focus:ring-primary-light',
    danger: 'bg-error text-white hover:opacity-90 focus:ring-error',
  };
  
  // Size classes - ensuring at least 44px height/width for touch targets on mobile
  const sizeClasses = {
    sm: 'text-sm px-xs py-xxs',
    md: 'text-base px-md py-xs',
    lg: 'text-lg px-lg py-sm',
  };
  
  // Disable styles
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className}`;
  
  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;