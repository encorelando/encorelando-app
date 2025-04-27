import React from 'react';
import PropTypes from 'prop-types';
import NavItem from '../molecules/NavItem';

/**
 * BottomNavigation component for primary mobile navigation
 * Mobile-first design with touch-optimized targets
 */
const BottomNavigation = ({ className = '' }) => {
  // Navigation items configuration
  const navItems = [
    { to: '/', label: 'Home', icon: 'home', exact: true },
    { to: '/calendar', label: 'Calendar', icon: 'calendar' },
    { to: '/artists', label: 'Artists', icon: 'music' },
    { to: '/search', label: 'Search', icon: 'search' },
  ];
  
  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-light-gray shadow-nav z-10 ${className}`}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-content mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            exact={item.exact}
            className="flex-1"
          />
        ))}
      </div>
    </nav>
  );
};

BottomNavigation.propTypes = {
  className: PropTypes.string,
};

export default BottomNavigation;