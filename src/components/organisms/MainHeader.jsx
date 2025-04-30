import { useState } from 'react';
import PropTypes from 'prop-types';
import BrandLogo from '../atoms/BrandLogo';
import IconButton from '../atoms/IconButton';
import UserNavigation from '../molecules/UserNavigation';
import HamburgerMenu from '../molecules/HamburgerMenu';
import { Link, useNavigate } from 'react-router-dom';

/**
 * MainHeader component with the new EncoreLando branding
 * Mobile-optimized with dark background and gradient accent
 */
const MainHeader = ({ showSearchButton = true, className = '' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle search button click
  const handleSearchClick = () => {
    navigate('/search');
  };

  // Toggle menu open/closed
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`bg-background px-md py-sm flex items-center justify-between relative ${className}`}
      >
        {/* Brand logo - using the white version on dark background */}
        <Link
          to="/"
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
        >
          <BrandLogo variant="white" size="sm" />
        </Link>

        {/* Action buttons */}
        <div className="flex items-center space-x-xs">
          {/* User profile/login */}
          <UserNavigation />

          {/* Search button */}
          {showSearchButton && (
            <IconButton
              icon="search"
              ariaLabel="Search"
              variant="ghost"
              onClick={handleSearchClick}
            />
          )}

          {/* Menu button */}
          <IconButton
            icon="menu"
            ariaLabel={menuOpen ? 'Close menu' : 'Open menu'}
            variant="ghost"
            onClick={toggleMenu}
          />
        </div>

        {/* Gradient line at the bottom of the header */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-gradient" />
      </header>

      {/* Hamburger menu */}
      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
};

MainHeader.propTypes = {
  showSearchButton: PropTypes.bool,
  className: PropTypes.string,
};

export default MainHeader;
