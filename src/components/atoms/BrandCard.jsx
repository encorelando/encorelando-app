import PropTypes from 'prop-types';

/**
 * BrandCard component following the updated EncoreLando branding
 * Mobile-optimized with dark background and appropriate styling
 */
const BrandCard = ({
  children,
  variant = 'default',
  onClick,
  featured = false,
  className = '',
}) => {
  // Base classes
  const baseClasses = 'rounded overflow-hidden relative';

  // Variant-specific classes based on new branding
  const variantClasses = {
    default: 'bg-white bg-opacity-10',
    interactive:
      'bg-white bg-opacity-10 cursor-pointer transition-all hover:bg-opacity-15 active:bg-opacity-20',
    elevated: 'bg-white bg-opacity-15',
  };

  // Featured card gets a gradient border
  const featuredClasses = featured ? 'p-[1px] bg-brand-gradient' : '';

  // Content wrapper classes
  const contentClasses = 'p-md' + (featured ? ' bg-background rounded' : '');

  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${featuredClasses} ${className}`;

  // Interactive props
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

  return (
    <div className={combinedClasses} {...interactiveProps}>
      <div className={contentClasses}>{children}</div>
    </div>
  );
};

BrandCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'interactive', 'elevated']),
  onClick: PropTypes.func,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default BrandCard;
