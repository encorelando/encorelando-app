import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';

/**
 * FilterChip component for selectable filter options
 * Mobile-optimized with touch-friendly targets
 */
const FilterChip = ({
  label,
  selected = false,
  onClick,
  count,
  disabled = false,
  className = '',
  darkMode = false,
}) => {
  // Base classes with min-height for touch targets
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-md py-xs min-h-touch transition-colors';

  // Conditional classes based on state and theme
  const stateClasses = selected
    ? 'bg-primary text-white'
    : darkMode
    ? 'bg-white bg-opacity-10 text-white hover:bg-white hover:bg-opacity-20'
    : 'bg-light-gray text-dark-gray hover:bg-primary-light hover:bg-opacity-20';

  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  // Combined classes
  const combinedClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-pressed={selected}
    >
      <span className="text-sm font-medium">{label}</span>

      {/* Count badge */}
      {count !== undefined && (
        <span
          className={`ml-xs text-xs px-xs py-xxs rounded-full flex items-center justify-center ${
            selected ? 'bg-white bg-opacity-20' : 'bg-medium-gray bg-opacity-20'
          }`}
        >
          {count}
        </span>
      )}

      {/* Selected indicator */}
      {selected && <Icon name="check" size="xs" className="ml-xs" />}
    </button>
  );
};

FilterChip.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  count: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  darkMode: PropTypes.bool,
};

export default FilterChip;
