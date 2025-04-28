import React from 'react';
import PropTypes from 'prop-types';

/**
 * BrandLogo component showcasing the updated EncoreLando branding
 * Supports different logo variants (white, black, gradient)
 */
const BrandLogo = ({
  variant = 'white',
  size = 'md',
  showTypography = false,
  className = '',
}) => {
  // Determine logo path based on variant
  const logoPath = `/logo/encorelando-logo-${variant}${getSizeSuffix(size)}.${variant === 'gradient' ? 'webp' : 'svg'}`;
  
  // Determine logo size based on size prop
  const logoSizes = {
    'xs': 'h-6 w-auto',
    'sm': 'h-8 w-auto',
    'md': 'h-10 w-auto',
    'lg': 'h-12 w-auto',
    'xl': 'h-16 w-auto',
  };
  
  // Get appropriate size suffix for the logo file
  function getSizeSuffix(size) {
    if (size === 'xs') return '-32px';
    if (size === 'sm') return '-64px';
    if (size === 'md') return '-128px';
    if (size === 'lg') return '-256px';
    if (size === 'xl') return '-512px';
    return '';
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo image */}
      <img 
        src={logoPath} 
        alt="EncoreLando" 
        className={`${logoSizes[size]}`}
      />
      
      {/* Optional typography split brand name */}
      {showTypography && (
        <div className="typography-split text-white mt-xs">
          <span className="enc font-poppins">enc</span>
          <span className="or font-manrope">or</span>
          <span className="e font-poppins">e</span>
          <span className="lando font-manrope">lando</span>
        </div>
      )}
    </div>
  );
};

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['white', 'black', 'gradient']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  showTypography: PropTypes.bool,
  className: PropTypes.string,
};

export default BrandLogo;