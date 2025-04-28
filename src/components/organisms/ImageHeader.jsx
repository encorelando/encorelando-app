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
    full: 'min-h-screen',
  };

  // Text alignment classes
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const isArtistImage = imageUrl && (imageUrl.includes('artist') || imageUrl.includes('artists'));

  return (
    <div
      className={`relative overflow-hidden w-full ${
        isArtistImage ? 'h-[30vh]' : heightMap[minHeight]
      } ${className}`}
    >
      {/* Image container */}
      <div className="absolute inset-0">
        {isArtistImage ? (
          // Artist image with forced grayscale
          <img
            src={imageUrl || '/images/placeholder-artist.jpg'}
            alt={title || 'Artist image'}
            className="w-full h-full object-cover object-top saturate-0"
            style={{
              filter: 'saturate(0) brightness(0.7) contrast(1.3)',
              WebkitFilter: 'saturate(0) brightness(0.7) contrast(1.3)',
              MozFilter: 'saturate(0) brightness(0.7) contrast(1.3)',
              msFilter: 'saturate(0) brightness(0.7) contrast(1.3)',
            }}
          />
        ) : (
          // Regular background image
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
            }}
          />
        )}
      </div>

      {/* Dark gradient overlay for text readability on any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      {/* Back button */}
      {showBackButton && (
        <div className="absolute top-md left-md z-20">
          <IconButton
            icon="arrow-left"
            ariaLabel="Go back"
            variant="ghost"
            onClick={handleBack}
            className="text-white hover:bg-black hover:bg-opacity-20"
          />
        </div>
      )}

      {/* Artist name placed in top left corner next to back button */}
      {isArtistImage && title && (
        <div className="absolute top-md left-[68px] z-20">
          <div className="inline-block bg-black bg-opacity-60 backdrop-blur-sm px-3 py-1 rounded-md">
            <Typography variant="h2" color="white" className="drop-shadow-md">
              {title}
            </Typography>
          </div>
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

      {/* Text content - only show title here if not artist image */}
      <div
        className={`relative z-0 flex flex-col justify-end p-md h-full w-full ${alignClasses[textAlign]}`}
      >
        {title && !isArtistImage && (
          <div className="inline-block bg-black bg-opacity-30 backdrop-blur-sm px-3 py-1 rounded-md">
            <Typography variant="h1" color="white" className="drop-shadow-md">
              {title}
            </Typography>
          </div>
        )}

        {subtitle && (
          <Typography variant="h4" color="white" className="drop-shadow-md mt-xxs">
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
  minHeight: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.string,
};

export default ImageHeader;
