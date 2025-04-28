import PropTypes from 'prop-types';
import BottomNavigation from '../organisms/BottomNavigation';

/**
 * PageLayout component with the new EncoreLando branding
 * Mobile-first with dark theme background and proper spacing for bottom navigation
 */
const PageLayout = ({ children, showNavigation = true, className = '' }) => {
  return (
    <div className={`min-h-screen bg-background text-white ${className}`}>
      {/* Main content with bottom padding for navigation */}
      <main className={`${showNavigation ? 'pb-16' : ''}`}>{children}</main>

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
