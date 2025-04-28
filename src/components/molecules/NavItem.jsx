import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';

/**
 * Navigation item component for bottom navigation
 * Mobile-optimized with appropriate touch target sizes
 */
const NavItem = ({ to, icon, label, exact = false, onClick, className = '' }) => {
  // Base classes ensuring touch-friendly targets for mobile
  const baseClasses = 'flex flex-col items-center justify-center min-h-touch px-sm py-xs';

  // Active and inactive classes for mobile visibility
  const activeClass = 'text-primary';

  // Combined classes
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <NavLink
      to={to}
      exact={exact}
      className={combinedClasses}
      activeClassName={activeClass}
      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          <Icon
            name={icon}
            size="md"
            color={isActive ? 'primary' : 'medium-gray'}
            className="mb-xxs"
          />
          <Typography variant="caption" color={isActive ? 'primary' : 'medium-gray'} align="center">
            {label}
          </Typography>
        </>
      )}
    </NavLink>
  );
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default NavItem;
