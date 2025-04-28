import PropTypes from 'prop-types';

/**
 * BrandLogo component for displaying the EncoreLando logo
 * Following the updated branding guidelines
 */
const BrandLogo = ({ variant = 'white', size = 'md', className = '' }) => {
  // Base classes
  const baseClasses = 'inline-block';

  // Size mapping for different logo sizes (in pixels)
  const sizeMap = {
    xs: 32,
    sm: 64,
    md: 128,
    lg: 256,
    xl: 512,
  };

  // Calculate image size
  const pixelSize = typeof size === 'string' ? sizeMap[size] : size;

  // Determine logo path based on variant
  let logoPath;
  switch (variant) {
    case 'gradient':
      logoPath = `/logo/encorelando-logo-gradient-${pixelSize}px.webp`;
      break;
    case 'black':
      logoPath = `/logo/encorelando-logo-black-${pixelSize}px.webp`;
      break;
    case 'white':
    default:
      logoPath = `/logo/encorelando-logo-white-${pixelSize}px.webp`;
      break;
  }

  // Fallback to PNG if WebP not supported (handled via CSS)
  const logoPathPng = logoPath.replace('.webp', '.png');

  // Combined classes
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <picture>
      <source srcSet={logoPath} type="image/webp" />
      <img
        src={logoPathPng}
        alt="EncoreLando"
        width={pixelSize}
        height={pixelSize * 0.3} // Approximate aspect ratio of the logo
        className={combinedClasses}
      />
    </picture>
  );
};

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['white', 'black', 'gradient']),
  size: PropTypes.oneOfType([PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']), PropTypes.number]),
  className: PropTypes.string,
};

export default BrandLogo;
