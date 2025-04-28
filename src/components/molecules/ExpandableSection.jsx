import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';

/**
 * ExpandableSection component with the new EncoreLando branding
 * Mobile-optimized with touch-friendly headers and dark theme support
 */
const ExpandableSection = ({
  title,
  children,
  initialExpanded = false,
  className = '',
  titleVariant = 'h4',
  icon,
  darkMode = false,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  
  // Handle toggle
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Generate unique ID for accessibility
  const headerId = `header-${title?.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `content-${title?.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`border-b border-light-gray ${className}`}>
      {/* Header - made touch-friendly with min-height */}
      <button
        type="button"
        className="flex items-center justify-between w-full py-md px-md min-h-touch text-left focus:outline-none focus:bg-light-gray"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        aria-controls={contentId}
        id={headerId}
      >
        <div className="flex items-center">
          {icon && (
            <Icon name={icon} size="md" className="mr-sm" />
          )}
          
          <Typography variant={titleVariant}>
            {title}
          </Typography>
        </div>
        
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size="md"
          className="ml-sm transition-transform duration-200"
        />
      </button>
      
      {/* Content */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-md pb-md">
          {children}
        </div>
      </div>
    </div>
  );
};

ExpandableSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  initialExpanded: PropTypes.bool,
  className: PropTypes.string,
  titleVariant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'body1', 'body2']),
  icon: PropTypes.string,
};

export default ExpandableSection;