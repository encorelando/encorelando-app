import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';

/**
 * CardHeader component for consistent card header styling
 * Mobile-optimized with appropriate spacing
 */
const CardHeader = ({ title, subtitle, icon, action, className = '' }) => {
  return (
    <div className={`flex items-center p-md ${className}`}>
      {/* Optional icon */}
      {icon && (
        <div className="mr-sm">
          <Icon name={icon} size="md" color="primary" />
        </div>
      )}

      {/* Title and subtitle */}
      <div className="flex-1 min-w-0">
        {title && (
          <Typography variant="h4" className="truncate">
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography variant="body2" color="medium-gray" className="truncate mt-xxs">
            {subtitle}
          </Typography>
        )}
      </div>

      {/* Optional action component (button, link, etc.) */}
      {action && <div className="ml-sm">{action}</div>}
    </div>
  );
};

CardHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default CardHeader;
