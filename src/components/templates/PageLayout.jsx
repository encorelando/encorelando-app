import PropTypes from 'prop-types';
import BottomNavigation from '../organisms/BottomNavigation';
import HamburgerMenu from '../molecules/HamburgerMenu';
import { BrandLogo, BrandName } from '../branding';
import Icon from '../atoms/Icon';
import { useState } from 'react';

/**
 * PageLayout component with the new EncoreLando branding
 * Mobile-first with dark theme background and proper spacing for bottom navigation
 */
const PageLayout = ({ children, showNavigation = true, className = '' }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle the menu open/closed
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close the menu
  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <>
      <div className="relative bg-background text-white pl-md pr-md pb-sm">
        <div className="pt-md pb-lg">
          {/* Logo instead of text title */}
          <div className="flex items-center justify-between w-full">
            {/* Left: Logo Container */}
            <div className="w-16 flex items-center justify-start">
              <BrandLogo variant="gradient" size="sm" className="h-12" />
            </div>

            {/* Center: Brand Name */}
            <div className="flex-1 text-center">
              <BrandName variant="gradient" size="2xl" className="inline-block" />
            </div>

            {/* Right: Menu Icon with matching width */}
            <div className="w-16 flex items-center justify-end">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20 transition"
              >
                <Icon name="menu" size="md" color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
      <div className={`min-h-screen bg-background text-white ${className}`}>
        {/* Main content with bottom padding for navigation */}
        <main className={`${showNavigation ? 'pb-16' : ''}`}>{children}</main>

        {/* Bottom navigation */}
        {showNavigation && <BottomNavigation />}
      </div>
    </>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  className: PropTypes.string,
};

export default PageLayout;
