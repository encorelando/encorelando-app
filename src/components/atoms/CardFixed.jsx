import PropTypes from 'prop-types';

/**
 * Unified Card component for EncoreLando implementing dark theme branding
 * Mobile-optimized with appropriate styling for dark backgrounds
 * Fixed to properly handle gradient borders with images
 */
const Card = ({
  children,
  variant = 'default',
  onClick,
  featured = false,
  className = '',
  padding = true,
  contentClassName = '',
}) => {
  // Base classes for all cards - mobile-first with appropriate sizing
  const baseClasses = 'rounded overflow-hidden relative';

  // Variant-specific classes using the dark theme branding
  const variantClasses = {
    // Standard card with semi-transparent white background
    default: 'bg-white bg-opacity-10',
    // Interactive card with touch-friendly hover effects
    interactive:
      'bg-white bg-opacity-10 cursor-pointer transition-all hover:bg-opacity-15 active:bg-opacity-20',
    // Elevated card with slightly higher opacity
    elevated: 'bg-white bg-opacity-15',
    // Outlined card for subdued content
    outlined: 'border border-white border-opacity-20 bg-background',
  };

  // Interactive props for clickable cards
  const interactiveProps =
    variant === 'interactive'
      ? {
          onClick,
          role: 'button',
          tabIndex: 0,
          onKeyDown: e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick && onClick(e);
            }
          },
        }
      : {};

  // For featured cards with gradient borders
  if (featured) {
    return (
      <div className={`rounded overflow-hidden ${className}`}>
        {/* Outer wrapper with gradient background */}
        <div className="p-[1px] bg-brand-gradient rounded overflow-hidden">
          {/* Inner card with dark background */}
          <div
            className={`${baseClasses} ${variantClasses[variant]} h-full w-full bg-background`}
            {...interactiveProps}
          >
            {/* Content with optional padding */}
            <div className={`${padding ? 'p-md' : ''} ${contentClassName}`}>{children}</div>
          </div>
        </div>
      </div>
    );
  }

  // Regular non-featured card
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...interactiveProps}>
      <div className={`${padding ? 'p-md' : ''} ${contentClassName}`}>{children}</div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'interactive', 'outlined', 'elevated']),
  onClick: PropTypes.func,
  featured: PropTypes.bool,
  className: PropTypes.string,
  padding: PropTypes.bool,
  contentClassName: PropTypes.string,
};

export default Card;
