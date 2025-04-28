import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';

/**
 * BottomNavigation component with the new EncoreLando branding
 * Mobile-first design with dark background and gradient highlights
 * Optimized for touch interaction with proper spacing and feedback
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
      className={`fixed bottom-0 left-0 right-0 bg-background bg-opacity-95 z-10 ${className}`}
      aria-label="Main navigation"
    >
      {/* Gradient line at the top of the navigation */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-brand-gradient" />
      
      <div className="flex items-center justify-around max-w-content mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `
              flex-1 py-xs flex flex-col items-center justify-center min-h-touch 
              focus:outline-none focus:bg-white focus:bg-opacity-10
              ${isActive ? 'active-nav-item' : ''}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Icon with gradient background when active */}
                <div className={`${isActive ? 'p-[2px] bg-brand-gradient rounded-full' : ''}`}>
                  <div className={`rounded-full ${isActive ? 'bg-background p-[2px]' : ''}`}>
                    <Icon 
                      name={item.icon} 
                      size="md" 
                      color={isActive ? 'white' : 'medium-gray'} 
                    />
                  </div>
                </div>
                
                {/* Label */}
                <Typography 
                  variant="caption" 
                  color={isActive ? 'white' : 'medium-gray'} 
                  align="center"
                  className="mt-xxs"
                >
                  {item.label}
                </Typography>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

BottomNavigation.propTypes = {
  className: PropTypes.string,
};

export default BottomNavigation;