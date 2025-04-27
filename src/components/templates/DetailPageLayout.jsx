import React from 'react';
import PropTypes from 'prop-types';
import PageLayout from './PageLayout';
import ImageHeader from '../organisms/ImageHeader';

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
  return (
    <PageLayout showNavigation={showNavigation} className={className}>
      {/* Header with image */}
      <ImageHeader
        title={title}
        subtitle={subtitle}
        imageUrl={imageUrl}
        showBackButton={true}
        actions={actions}
        minHeight="lg"
      />
      
      {/* Content area */}
      <div className="px-md py-lg">
        {children}
      </div>
    </PageLayout>
  );
};

DetailPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.node),
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  className: PropTypes.string,
};

export default DetailPageLayout;