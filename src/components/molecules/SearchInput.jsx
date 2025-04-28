import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';
import IconButton from '../atoms/IconButton';

/**
 * Search input component with the new EncoreLando branding
 * Mobile-optimized with proper touch targets and dark mode support
 */
const SearchInput = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search concerts, artists, venues...',
  disabled = false,
  darkMode = false,
  className = '',
}) => {
  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  // Handle clear button click
  const handleClear = () => {
    if (onClear) onClear();
    else if (onChange) onChange({ target: { value: '' } });
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      {/* Search icon with dark mode support */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-md pointer-events-none z-10">
        <Icon
          name="search"
          size="md"
          color={darkMode ? 'white' : 'medium-gray'}
          className={darkMode ? 'text-opacity-70' : ''}
        />
      </div>

      {/* Search input with dark mode styling and increased padding */}
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full min-h-touch rounded pl-12 pr-xl py-xs focus:outline-none focus:ring-2 
          ${
            darkMode
              ? 'bg-white bg-opacity-5 border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-50 focus:ring-white focus:ring-opacity-30 focus:border-white'
              : 'bg-white border border-light-gray text-dark-gray focus:ring-sunset-orange focus:border-sunset-orange'
          }
        `}
        aria-label="Search"
      />

      {/* Clear button with dark mode support - only shown when there's a value */}
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-xs">
          <IconButton
            icon="x"
            ariaLabel="Clear search"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={
              darkMode ? 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10' : ''
            }
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
  darkMode: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchInput;
