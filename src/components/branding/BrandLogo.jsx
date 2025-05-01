import PropTypes from 'prop-types';
import BrandName from './BrandName';

/**
 * BrandLogo component for displaying the EncoreLando logo
 * Following the updated branding guidelines with support for different formats and sizes
 */
const BrandLogo = ({
  variant = 'white',
  size = 'md',
  showTypography = false,
  typographyVariant = 'default',
  typographySize = 'md',
  typographyClassName = 'mt-xs',
  className = '',
}) => {
  // Size mapping in pixels
  const sizeMap = {
    xs: 32, // Smallest usable size
    sm: 64, // Small for nav headers
    md: 128, // Standard size
    lg: 256, // Large for headers
    xl: 512, // Extra large for splash screens
  };

  // Height in pixels for the image attributes
  const pixelSize = typeof size === 'string' ? sizeMap[size] : size;
  const aspectRatio = 0.3; // Approximate aspect ratio of the logo

  // Size classes for responsive styling
  const sizeClasses = {
    xs: 'h-6 w-auto',
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto',
  };

  // First try to use SVG for best quality
  let logoPath = `/logo/encorelando-logo-${variant}.svg`;

  // Fallback to WebP/PNG with size-specific versions if needed
  const logoPathWebP = `/logo/encorelando-logo-${variant}-${pixelSize}px.webp`;
  const logoPathPng = `/logo/encorelando-logo-${variant}-${pixelSize}px.png`;

  // Base classes
  const baseClasses = 'inline-block';

  // Combined classes
  const combinedClasses = `${baseClasses} ${
    typeof size === 'string' ? sizeClasses[size] : ''
  } ${className}`;

  return (
    <div className={showTypography ? 'flex flex-col items-center' : ''}>
      <picture>
        <source srcSet={logoPath} type="image/svg+xml" />
        <source srcSet={logoPathWebP} type="image/webp" />
        <img
          src={logoPathPng}
          alt="EncoreLando"
          width={pixelSize}
          height={pixelSize * aspectRatio}
          className={combinedClasses}
        />
      </picture>

      {/* Optional typography brand name */}
      {showTypography && (
        <BrandName
          variant={typographyVariant}
          size={typographySize}
          className={typographyClassName}
        />
      )}
    </div>
  );
};

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['white', 'black', 'gradient']),
  size: PropTypes.oneOfType([PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']), PropTypes.number]),
  showTypography: PropTypes.bool,
  typographyVariant: PropTypes.oneOf(['default', 'gradient', 'dark']),
  typographySize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  typographyClassName: PropTypes.string,
  className: PropTypes.string,
};

export default BrandLogo;
