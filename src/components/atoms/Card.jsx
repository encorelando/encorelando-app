import PropTypes from 'prop-types';

/**
 * Unified Card component for EncoreLando implementing dark theme branding
 * Mobile-optimized with appropriate styling for dark backgrounds
 *
 * This component combines the functionality of both Card and BrandCard
 * components with consistent styling across the application.
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

  // Featured cards get a gradient border using the brand gradient
  // But we add this to the parent div to ensure the border is outside the content
  const featuredClasses = featured ? 'p-[1px]' : '';

  // Add the gradient background to the parent container, not the classes
  const gradientBackground = featured ? 'bg-brand-gradient' : '';

  // Content wrapper classes with optional padding
  const contentClasses = `${padding ? 'p-md' : ''} ${
    featured ? 'bg-background rounded' : ''
  } ${contentClassName}`;

  // Combined classes (without the gradient that goes on the parent)
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

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

  // If featured, add an outer wrapper div with the gradient background
  return featured ? (
    <div className={`rounded overflow-hidden ${gradientBackground} ${featuredClasses}`}>
      <div
        className={`${baseClasses} ${variantClasses[variant]} w-full h-full`}
        {...interactiveProps}
      >
        <div className={contentClasses}>{children}</div>
      </div>
    </div>
  ) : (
    <div className={combinedClasses} {...interactiveProps}>
      <div className={contentClasses}>{children}</div>
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
