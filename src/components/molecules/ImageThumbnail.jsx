import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../atoms/Spinner';
import Icon from '../atoms/Icon';

/**
 * ImageThumbnail component with loading and error states
 * Mobile-optimized with responsive sizing
 */
const ImageThumbnail = ({
  src,
  alt,
  aspectRatio = 'square',
  rounded = 'md',
  objectFit = 'cover',
  fallbackIcon = 'image',
  className = '',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Base container classes
  const containerBaseClasses = 'relative overflow-hidden bg-light-gray';
  
  // Aspect ratio classes
  const aspectRatioClasses = {
    'square': 'aspect-w-1 aspect-h-1',
    '4:3': 'aspect-w-4 aspect-h-3',
    '16:9': 'aspect-w-16 aspect-h-9',
    'portrait': 'aspect-w-3 aspect-h-4',
    'custom': '', // No aspect ratio constraint
  };
  
  // Rounded corner classes
  const roundedClasses = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded',
    'lg': 'rounded-lg',
    'full': 'rounded-full',
  };
  
  // Object fit classes
  const objectFitClasses = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
  };
  
  // Combined container classes
  const containerClasses = `${containerBaseClasses} ${aspectRatioClasses[aspectRatio]} ${roundedClasses[rounded]} ${className}`;
  
  // Image classes
  const imageClasses = `w-full h-full ${objectFitClasses[objectFit]}`;
  
  // Handle image load
  const handleLoad = () => {
    setLoading(false);
  };
  
  // Handle image error
  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={containerClasses}>
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="md" color="primary" />
        </div>
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-medium-gray">
          <Icon name={fallbackIcon} size="lg" />
        </div>
      )}
      
      {/* Image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          style={{ opacity: loading ? 0 : 1 }}
          loading="lazy"
        />
      )}
    </div>
  );
};

ImageThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.oneOf(['square', '4:3', '16:9', 'portrait', 'custom']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill']),
  fallbackIcon: PropTypes.string,
  className: PropTypes.string,
};

export default ImageThumbnail;