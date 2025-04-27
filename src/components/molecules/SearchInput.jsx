import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';
import IconButton from '../atoms/IconButton';

/**
 * Search input component for global search functionality
 * Mobile-optimized with proper touch targets
 */
const SearchInput = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search concerts, artists, venues...',
  disabled = false,
  className = '',
}) => {
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  // Handle clear button click
  const handleClear = () => {
    if (onClear) onClear();
    else if (onChange) onChange({ target: { value: '' } });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${className}`}
    >
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-sm pointer-events-none">
        <Icon name="search" size="md" color="medium-gray" />
      </div>
      
      {/* Search input */}
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-touch bg-white rounded-lg border border-light-gray pl-xl pr-xl py-xs focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light"
        aria-label="Search"
      />
      
      {/* Clear button - only shown when there's a value */}
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-xs">
          <IconButton
            icon="x"
            ariaLabel="Clear search"
            variant="ghost"
            size="sm"
            onClick={handleClear}
          />
        </div>
      )}
    </form>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchInput;