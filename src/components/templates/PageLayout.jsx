import React from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '../organisms/BottomNavigation';

/**
 * PageLayout component as base layout for all pages
 * Mobile-first with proper spacing for bottom navigation
 */
const PageLayout = ({
  children,
  showNavigation = true,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-off-white ${className}`}>
      {/* Main content with bottom padding for navigation */}
      <main className={`pb-nav ${showNavigation ? 'pb-nav' : ''}`}>
        {children}
      </main>
      
      {/* Bottom navigation */}
      {showNavigation && <BottomNavigation />}
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  className: PropTypes.string,
};

export default PageLayout;