import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Tag component for displaying labels and categories
 * Mobile-optimized for touch interaction
 */
const Tag = ({
  text,
  color = 'primary',
  onClick,
  closable = false,
  onClose,
  className = '',
}) => {
  // Base classes ensuring touch-friendly size
  const baseClasses = 'inline-flex items-center rounded-full py-xs px-sm text-sm';
  
  // Color classes
  const colorClasses = {
    primary: 'bg-primary-light bg-opacity-20 text-primary',
    secondary: 'bg-secondary-light bg-opacity-20 text-secondary',
    success: 'bg-success bg-opacity-20 text-success',
    error: 'bg-error bg-opacity-20 text-error',
    warning: 'bg-warning bg-opacity-20 text-dark-gray',
    info: 'bg-info bg-opacity-20 text-info',
    gray: 'bg-light-gray text-medium-gray',
  };
  
  // Interactive classes
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-opacity-30' : '';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${colorClasses[color]} ${interactiveClasses} ${className}`;
  
  // Handle click event
  const handleClick = (e) => {
    if (onClick) onClick(e);
  };
  
  // Handle close button click
  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) onClose(e);
  };

  return (
    <div
      className={combinedClasses}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span>{text}</span>
      
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          className="ml-xs flex items-center justify-center focus:outline-none"
          aria-label={`Remove ${text}`}
        >
          <Icon name="x" size="xs" />
        </button>
      )}
    </div>
  );
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info', 'gray']),
  onClick: PropTypes.func,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Tag;