import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';

/**
 * AlertMessage component for displaying status messages
 * Mobile-optimized with clear visibility
 */
const AlertMessage = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
  icon,
}) => {
  // Base classes
  const baseClasses = 'flex items-start p-md rounded';

  // Type-specific classes
  const typeClasses = {
    info: 'bg-info bg-opacity-10 border-l-4 border-info',
    success: 'bg-success bg-opacity-10 border-l-4 border-success',
    warning: 'bg-warning bg-opacity-10 border-l-4 border-warning',
    error: 'bg-error bg-opacity-10 border-l-4 border-error',
  };

  // Type-specific icons
  const typeIcons = {
    info: 'info',
    success: 'check',
    warning: 'alert',
    error: 'alert',
  };

  // Type-specific colors
  const typeColors = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
  };

  // Combined classes
  const combinedClasses = `${baseClasses} ${typeClasses[type]} ${className}`;

  // Determine icon
  const iconName = icon || typeIcons[type];

  // Determine color
  const color = typeColors[type];

  return (
    <div className={combinedClasses} role="alert">
      {/* Icon */}
      <div className="flex-shrink-0 mr-sm">
        <Icon name={iconName} size="md" color={color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <Typography variant="h4" color={color} className="mb-xxs">
            {title}
          </Typography>
        )}

        {message && <Typography variant="body2">{message}</Typography>}
      </div>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <div className="ml-sm mt-xxs">
          <IconButton
            icon="x"
            ariaLabel="Dismiss alert"
            variant="ghost"
            size="sm"
            onClick={onDismiss}
          />
        </div>
      )}
    </div>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.string,
};

export default AlertMessage;
