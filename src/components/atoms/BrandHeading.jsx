import React from 'react';
import PropTypes from 'prop-types';

/**
 * BrandHeading component for displaying headings with updated EncoreLando branding
 * Supports gradient text and follows the Poppins font guidelines
 */
const BrandHeading = ({
  children,
  level = 2,
  gradient = false,
  align = 'left',
  className = '',
}) => {
  // Determine heading level (h1-h6)
  const HeadingTag = `h${level}`;
  
  // Base classes - using Poppins font for headings per brand guidelines
  const baseClasses = 'font-poppins font-semibold';
  
  // Size classes based on heading level
  const sizeClasses = {
    1: 'text-2xl sm:text-3xl lg:text-4xl',
    2: 'text-xl sm:text-2xl lg:text-3xl',
    3: 'text-lg sm:text-xl lg:text-2xl',
    4: 'text-base sm:text-lg lg:text-xl',
    5: 'text-sm sm:text-base lg:text-lg',
    6: 'text-xs sm:text-sm lg:text-base',
  };
  
  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  // Gradient text effect
  const gradientClasses = gradient ? 'brand-gradient-text' : 'text-white';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${sizeClasses[level]} ${alignClasses[align]} ${gradientClasses} ${className}`;

  return (
    <HeadingTag className={combinedClasses}>
      {children}
    </HeadingTag>
  );
};

BrandHeading.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  gradient: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
};

export default BrandHeading;