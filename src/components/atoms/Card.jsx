import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for displaying content in a contained area
 * Mobile-first responsive design
 */
const Card = ({
  children,
  variant = 'default',
  onClick,
  className = '',
}) => {
  // Base classes
  const baseClasses = 'rounded shadow-card bg-white overflow-hidden';
  
  // Variant-specific classes
  const variantClasses = {
    default: '',
    interactive: 'cursor-pointer transition-transform hover:shadow-lg',
    outlined: 'border border-light-gray shadow-none',
    elevated: 'shadow-lg',
  };
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  // Interactive props
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
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'interactive', 'outlined', 'elevated']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;