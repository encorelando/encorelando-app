import PropTypes from 'prop-types';

/**
 * ImageThumbnail component for consistent image display
 * Mobile-optimized with appropriate sizing and loading
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} aspectRatio - Aspect ratio (e.g., 'square', '16:9', '4:3')
 * @param {string} rounded - Rounding of corners ('none', 'sm', 'md', 'lg', 'full')
 * @param {boolean} grayscale - Whether to apply grayscale filter
 * @param {string} className - Additional CSS classes
 */
const ImageThumbnail = ({
  src,
  alt,
  aspectRatio = 'square',
  rounded = 'md',
  grayscale = false,
  className = '',
}) => {
  // Determine padding based on aspect ratio
  const getPaddingBottom = () => {
    switch (aspectRatio) {
      case 'square':
        return '100%'; // 1:1
      case '16:9':
        return '56.25%'; // 16:9
      case '4:3':
        return '75%'; // 4:3
      case '3:2':
        return '66.67%'; // 3:2
      case '1:2':
        return '200%'; // 1:2
      default:
        return '100%'; // Default to square
    }
  };

  // Determine corner rounding classes
  const getRoundedClass = () => {
    switch (rounded) {
      case 'none':
        return '';
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-md';
    }
  };

  // Apply grayscale filter if requested
  const getFilterStyle = () => {
    if (grayscale) {
      return {
        filter: 'grayscale(100%) brightness(0.7) contrast(1.3)',
        WebkitFilter: 'grayscale(100%) brightness(0.7) contrast(1.3)',
      };
    }
    return {};
  };

  // Add debug logging to see what image URLs we're getting
  console.log('ImageThumbnail render:', {
    src,
    alt,
    aspectRatio,
    rounded,
    className,
  });

  return (
    <div
      className={`w-full relative overflow-hidden ${getRoundedClass()} ${className}`}
      style={{ paddingBottom: getPaddingBottom() }}
    >
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover`}
        style={getFilterStyle()}
        loading="lazy"
      />
    </div>
  );
};

ImageThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.oneOf(['square', '16:9', '4:3', '3:2', '1:2']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  grayscale: PropTypes.bool,
  className: PropTypes.string,
};

export default ImageThumbnail;
