import PropTypes from 'prop-types';

/**
 * BrandName component for displaying the EncoreLando name with the typography split
 * Following new branding guidelines with Poppins for "enc" and "e", Manrope for "or" and "lando"
 */
const BrandName = ({ variant = 'default', size = 'md', className = '' }) => {
  // Font size mapping
  const sizeMap = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  };

  // Variant styling
  const variantClasses = {
    default: 'text-white',
    gradient: 'brand-gradient-text',
    dark: 'text-black',
  };

  // Combined classes
  const combinedClasses = `typography-split ${sizeMap[size]} ${variantClasses[variant]} ${className}`;

  return (
    <span className={combinedClasses} aria-label="EncoreLando">
      <span className="enc font-poppins">enc</span>
      <span className="or font-manrope">or</span>
      <span className="e font-poppins">e</span>
      <span className="lando font-manrope">lando</span>
    </span>
  );
};

BrandName.propTypes = {
  variant: PropTypes.oneOf(['default', 'gradient', 'dark']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
};

export default BrandName;
