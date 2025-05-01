import PropTypes from 'prop-types';
import PageLayout from './PageLayout';
import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';
import { useNavigate } from 'react-router-dom';

/**
 * DetailPageLayout component for detail pages with header image
 * Mobile-optimized with back navigation
 */
const DetailPageLayout = ({
  title,
  subtitle,
  imageUrl,
  actions,
  children,
  showNavigation = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const isArtistImage = imageUrl && (imageUrl.includes('artist') || imageUrl.includes('artists'));

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PageLayout showNavigation={showNavigation} className={className}>
      {/* Header with image */}
      <div className={`relative overflow-hidden w-full h-[30vh] ${className}`}>
        {/* Artist image with forced grayscale */}
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={title || 'Header image'}
            className="w-full h-full object-cover object-top"
            style={{
              filter: 'grayscale(100%) brightness(0.7) contrast(1.3)',
              WebkitFilter: 'grayscale(100%) brightness(0.7) contrast(1.3)',
              objectPosition: 'top center',
            }}
          />

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        {/* Back button */}
        <div className="absolute top-md left-md z-20 flex items-center">
          <IconButton
            icon="arrow-left"
            ariaLabel="Go back"
            variant="ghost"
            onClick={handleBack}
            className="text-white hover:bg-black hover:bg-opacity-20"
          />

          {/* Action buttons slot - displayed to the right of back button */}
          {actions && <div className="ml-2 flex items-center space-x-2">{actions}</div>}
        </div>

        {/* Artist name positioned next to back button */}
        {isArtistImage && title && (
          <div className="absolute top-md left-[70px] z-20">
            <div className="inline-block bg-black bg-opacity-50 backdrop-blur-sm px-3 py-2 rounded-md">
              <Typography variant="h3" color="white" className="drop-shadow-md">
                {title}
              </Typography>
            </div>
          </div>
        )}
        {/* Regular title if not artist image */}
        {!isArtistImage && title && (
          <div className="absolute bottom-md left-md z-10 flex flex-col space-y-1">
            <div className="inline-block bg-black bg-opacity-30 backdrop-blur-sm px-3 py-1 rounded-md">
              <Typography variant="h1" color="white" className="drop-shadow-md">
                {title}
              </Typography>
            </div>

            {subtitle && (
              <div className="inline-block bg-black bg-opacity-30 backdrop-blur-sm px-3 py-1 rounded-md">
                <Typography variant="h4" color="white" className="drop-shadow-md">
                  {subtitle}
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Content area */}
      <div className="px-md py-lg">{children}</div>
    </PageLayout>
  );
};

DetailPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  className: PropTypes.string,
};

export default DetailPageLayout;
