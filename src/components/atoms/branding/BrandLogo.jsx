import React from 'react';
import PropTypes from 'prop-types';

/**
 * BrandLogo component for displaying the EncoreLando logo
 * Updated to match new branding guidelines
 */
const BrandLogo = ({
  variant = 'white',
  size = 'md',
  className = '',
}) => {
  // Size mapping in pixels
  const sizeMap = {
    'xs': 32,   // Smallest usable size
    'sm': 48,   // Small for nav headers
    'md': 64,   // Standard size
    'lg': 128,  // Large for headers
    'xl': 256,  // Extra large for splash screens
  };

  // Height in pixels
  const height = typeof size === 'string' ? sizeMap[size] : size;
  
  // Logo file paths - using new logo assets
  const logoFiles = {
    'white': '/logo/encorelando-logo-white.svg',    // Default (preferred) version
    'black': '/logo/encorelando-logo-black.svg',    // For light backgrounds
    'gradient': '/logo/encorelando-logo-gradient.svg', // Special emphasis version
  };

  // Get correct logo path
  const logoSrc = logoFiles[variant] || logoFiles.white;

  return (
    <img
      src={logoSrc}
      alt="EncoreLando"
      height={height}
      width="auto"
      className={className}
    />
  );
};

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['white', 'black', 'gradient']),
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.number
  ]),
  className: PropTypes.string,
};

export default BrandLogo;