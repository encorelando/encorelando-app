import PropTypes from 'prop-types';

/**
 * BrandButton component following the updated EncoreLando branding
 * Mobile-optimized with appropriate touch targets and visual styling
 */
const BrandButton = ({
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
  const baseClasses =
    'inline-flex items-center justify-center transition-all min-h-touch rounded font-poppins font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50';

  // Variant-specific classes based on new branding
  const variantClasses = {
    primary: 'bg-sunset-orange text-white hover:bg-magenta-pink',
    secondary: 'bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-15',
    gradient: 'bg-brand-gradient text-white hover:brightness-110',
    ghost: 'text-white hover:bg-white hover:bg-opacity-10',
    danger: 'bg-error text-white hover:opacity-90',
  };

  // Size classes - ensuring at least 44px height for touch targets on mobile
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

BrandButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'gradient', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default BrandButton;
