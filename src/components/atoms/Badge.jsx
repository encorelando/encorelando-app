import PropTypes from 'prop-types';

/**
 * Badge component implementing the new EncoreLando branding
 * Mobile-optimized for visibility against dark backgrounds
 */
const Badge = ({ text, variant = 'primary', size = 'md', gradient = false, className = '' }) => {
  // Base classes - updated to use Poppins font for consistency
  const baseClasses =
    'inline-flex items-center justify-center font-poppins font-medium rounded-full';

  // Variant-specific classes updated for dark theme
  const variantClasses = {
    primary: 'bg-sunset-orange text-white',
    secondary: 'bg-magenta-pink text-white',
    accent: 'bg-deep-orchid text-white',
    accent2: 'bg-neon-blue text-black',
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-black',
    info: 'bg-info text-white',
    outline: 'bg-transparent border border-white text-white',
  };

  // Size classes - ensuring proper visibility on mobile screens
  const sizeClasses = {
    sm: 'text-xs px-xs py-xxs',
    md: 'text-sm px-sm py-xxs',
    lg: 'text-base px-md py-xs',
  };

  // Apply gradient background if specified
  const gradientClass = gradient ? 'bg-brand-gradient' : '';

  // Combined classes
  const combinedClasses = `${baseClasses} ${gradient ? '' : variantClasses[variant]} ${
    sizeClasses[size]
  } ${gradientClass} ${className}`;

  return <span className={combinedClasses}>{text}</span>;
};

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'accent2',
    'success',
    'error',
    'warning',
    'info',
    'outline',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  gradient: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
