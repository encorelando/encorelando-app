import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';
import { useNavigate } from 'react-router-dom';

/**
 * ImageHeader component for headers with background images
 * Mobile-optimized with touch-friendly controls and readable text
 */
const ImageHeader = ({
  title,
  subtitle,
  imageUrl,
  showBackButton = true,
  actions = [],
  textAlign = 'left',
  minHeight = 'md',
  className = '',
}) => {
  const navigate = useNavigate();
  
  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };
  
  // Map of min-height options
  const heightMap = {
    sm: 'min-h-[150px]',
    md: 'min-h-[200px]',
    lg: 'min-h-[250px]',
    xl: 'min-h-[300px]',
  };
  
  // Text alignment classes
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div 
      className={`relative overflow-hidden w-full ${heightMap[minHeight]} ${className}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark gradient overlay for text readability on any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      
      {/* Back button */}
      {showBackButton && (
        <div className="absolute top-md left-md z-10">
          <IconButton
            icon="arrow-left"
            ariaLabel="Go back"
            variant="ghost"
            onClick={handleBack}
            className="text-white hover:bg-black hover:bg-opacity-20"
          />
        </div>
      )}
      
      {/* Action buttons */}
      {actions.length > 0 && (
        <div className="absolute top-md right-md z-10 flex items-center space-x-sm">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
      
      {/* Text content */}
      <div className={`relative z-0 flex flex-col justify-end p-md h-full w-full ${alignClasses[textAlign]}`}>
        {title && (
          <Typography 
            variant="h1" 
            color="white" 
            className="drop-shadow-md"
          >
            {title}
          </Typography>
        )}
        
        {subtitle && (
          <Typography 
            variant="h4" 
            color="white" 
            className="drop-shadow-md mt-xxs"
          >
            {subtitle}
          </Typography>
        )}
      </div>
    </div>
  );
};

ImageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool,
  actions: PropTypes.arrayOf(PropTypes.node),
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  minHeight: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default ImageHeader;