import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component implementing the new EncoreLando dark theme branding
 * Mobile-optimized with appropriate styling for dark backgrounds
 * 
 * This component has been updated to match the BrandCard styling while
 * maintaining all the previous functionality and variants.
 */
const Card = ({
  children,
  variant = 'default',
  onClick,
  featured = false,
  className = '',
}) => {
  // Base classes for all cards
  const baseClasses = 'rounded overflow-hidden relative';
  
  // Variant-specific classes using the new dark theme branding
  const variantClasses = {
    // Standard card with semi-transparent white background
    default: 'bg-white bg-opacity-10',
    // Interactive card with hover effects
    interactive: 'bg-white bg-opacity-10 cursor-pointer transition-all hover:bg-opacity-15 active:bg-opacity-20',
    // Elevated card with slightly higher opacity
    elevated: 'bg-white bg-opacity-15',
    // Outlined card for subdued content
    outlined: 'border border-white border-opacity-20 bg-background',
  };
  
  // Featured cards get a gradient border using the brand gradient
  const featuredClasses = featured ? 'p-[1px] bg-brand-gradient' : '';
  
  // Content wrapper classes
  const contentClasses = 'p-md' + (featured ? ' bg-background rounded' : '');
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${featuredClasses} ${className}`;
  
  // Interactive props for clickable cards
  const interactiveProps = variant === 'interactive' ? {
    onClick,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick && onClick(e);
      }
    },
  } : {};

  return (
    <div 
      className={combinedClasses}
      {...interactiveProps}
    >
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'interactive', 'outlined', 'elevated']),
  onClick: PropTypes.func,
  featured: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;