import React from 'react';
import PropTypes from 'prop-types';

/**
 * BrandName component for displaying the EncoreLando name with the proper typography split
 * Following the updated branding guidelines
 */
const BrandName = ({
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  // Font size mapping
  const sizeClasses = {
    'xs': 'text-sm',
    'sm': 'text-base',
    'md': 'text-lg',
    'lg': 'text-xl',
    'xl': 'text-2xl',
    '2xl': 'text-3xl',
  };
  
  // Variant-specific classes
  const variantClasses = {
    'default': 'text-white',
    'gradient': 'brand-gradient-text',
    'dark': 'text-black',
  };
  
  // Combined classes
  const combinedClasses = `typography-split ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <span className={combinedClasses}>
      <span className="enc">enc</span>
      <span className="or">or</span>
      <span className="e">e</span>
      <span className="lando">lando</span>
    </span>
  );
};

BrandName.propTypes = {
  variant: PropTypes.oneOf(['default', 'gradient', 'dark']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
};

export default BrandName;