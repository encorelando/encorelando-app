import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component fully implementing the new EncoreLando branding
 * Mobile-optimized with touch-friendly targets and consistent styling
 * 
 * This component is the main button component that follows the updated design guidelines.
 * It supports various variants, sizes, and states to maintain consistency across the application.
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
  // Base classes that ensure proper touch target size for mobile users
  const baseClasses = 'inline-flex items-center justify-center font-poppins font-medium rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all min-h-touch';
  
  // Variant-specific classes implementing new brand colors
  const variantClasses = {
    // Primary uses Sunset Orange with hover to Magenta Pink
    primary: 'bg-sunset-orange text-white hover:bg-magenta-pink',
    // Secondary is transparent with white border for dark backgrounds
    secondary: 'bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-15',
    // Gradient button for special emphasis using the brand gradient
    gradient: 'bg-brand-gradient text-white hover:brightness-110',
    // Ghost button for less emphasis, white text on transparent background
    ghost: 'text-white hover:bg-white hover:bg-opacity-10',
    // Danger button for destructive actions
    danger: 'bg-error text-white hover:opacity-90',
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
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'gradient']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;