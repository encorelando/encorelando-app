import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';

/**
 * Tabs component for mobile-first navigation between content sections
 * Optimized for touch interaction with large touch targets and visual feedback
 */
const Tabs = ({ tabs, activeTab, onChange, variant = 'underline', className = '' }) => {
  // Tab styles for different variants
  const getTabStyles = tabId => {
    const isActive = activeTab === tabId;

    const baseStyles =
      'flex items-center justify-center flex-1 min-h-touch py-sm px-xs relative transition-all';

    // Define variant-specific styles
    const variantStyles = {
      underline: `
        ${baseStyles}
        border-b-2 border-${isActive ? 'deep-orchid' : 'transparent'}
        ${isActive ? 'text-deep-orchid' : 'text-medium-gray'}
        hover:text-${isActive ? 'deep-orchid' : 'white'}
      `,
      pill: `
        ${baseStyles}
        rounded-full mx-1
        ${isActive ? 'bg-primary text-white' : 'bg-background-secondary text-medium-gray'}
        hover:bg-opacity-90
      `,
      button: `
        ${baseStyles}
        rounded-md mx-1 border
        ${
          isActive
            ? 'bg-primary border-primary text-white'
            : 'bg-transparent border-outline text-medium-gray'
        }
        hover:bg-opacity-90
      `,
    };

    return variantStyles[variant] || variantStyles.underline;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`flex ${variant === 'underline' ? 'border-b border-outline' : ''}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={getTabStyles(tab.id)}
            onClick={() => onChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.icon && (
              <Icon
                name={tab.icon}
                size="sm"
                className={`mr-xs ${activeTab === tab.id ? 'text-current' : 'text-medium-gray'}`}
              />
            )}
            <Typography variant="button" className="whitespace-nowrap">
              {tab.label}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  /**
   * Array of tab objects with id, label, and optional icon
   */
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  /**
   * Currently active tab ID
   */
  activeTab: PropTypes.string.isRequired,
  /**
   * Function called when tab changes
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Visual style variant for tabs
   */
  variant: PropTypes.oneOf(['underline', 'pill', 'button']),
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default Tabs;
