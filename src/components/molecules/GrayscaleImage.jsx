import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * GrayscaleImage component using direct CSS filter for desaturation
 * Ensures consistent image styling with the app's dark theme
 * Mobile-optimized with proper handling of loading states
 */
const GrayscaleImage = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  brightness = '0.7',
  contrast = '1.3',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle image load error
  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageSource = imageError || !src ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-sunset-orange rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* 
        Image with desaturation filter 
        Using CSS classes for filter and inline styles as a fallback
        For maximum compatibility and to ensure filters are applied
      */}
      <img
        src={imageSource}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`object-cover w-full h-full transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } grayscale`}
        style={{
          // CSS filters: saturation at 0 makes a pure grayscale image
          filter: `saturate(0) brightness(${brightness}) contrast(${contrast})`,
          WebkitFilter: `saturate(0) brightness(${brightness}) contrast(${contrast})`,
          MozFilter: `saturate(0) brightness(${brightness}) contrast(${contrast})`,
          msFilter: `saturate(0) brightness(${brightness}) contrast(${contrast})`,
          // Position the image from the top to ensure faces are visible
          objectPosition: 'top center',
        }}
      />
    </div>
  );
};

GrayscaleImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  brightness: PropTypes.string,
  contrast: PropTypes.string,
};

export default GrayscaleImage;
