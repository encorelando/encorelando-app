import React from 'react';
import PropTypes from 'prop-types';
import BrandLogo from '../atoms/BrandLogo';
import IconButton from '../atoms/IconButton';
import { Link } from 'react-router-dom';

/**
 * MainHeader component with the new EncoreLando branding
 * Mobile-optimized with dark background and gradient accent
 */
const MainHeader = ({
  showSearchButton = true,
  showMenuButton = true,
  onSearchClick,
  onMenuClick,
  className = '',
}) => {
  return (
    <header className={`bg-background px-md py-sm flex items-center justify-between relative ${className}`}>
      {/* Brand logo - using the white version on dark background */}
      <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded">
        <BrandLogo variant="white" size="sm" />
      </Link>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-xs">
        {/* Search button */}
        {showSearchButton && (
          <IconButton
            icon="search"
            ariaLabel="Search"
            variant="ghost"
            onClick={onSearchClick}
          />
        )}
        
        {/* Menu button */}
        {showMenuButton && (
          <IconButton
            icon="menu"
            ariaLabel="Menu"
            variant="ghost"
            onClick={onMenuClick}
          />
        )}
      </div>
      
      {/* Gradient line at the bottom of the header */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-gradient" />
    </header>
  );
};

MainHeader.propTypes = {
  showSearchButton: PropTypes.bool,
  showMenuButton: PropTypes.bool,
  onSearchClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  className: PropTypes.string,
};

export default MainHeader;