import React from 'react';
import PropTypes from 'prop-types';
import ExpandableSection from '../molecules/ExpandableSection';
import FilterChip from '../molecules/FilterChip';
import Typography from '../atoms/Typography';

/**
 * FilterAccordion component with the new EncoreLando branding
 * Mobile-optimized with touch-friendly targets and dark theme support
 */
const FilterAccordion = ({
  title,
  icon,
  options,
  selectedValues = [],
  onChange,
  showCounts = true,
  initialExpanded = false,
  className = '',
  multiSelect = true,
  darkMode = false,
}) => {
  // Handle chip selection
  const handleChipClick = (value) => {
    if (multiSelect) {
      // For multi-select, toggle the value
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(val => val !== value)
        : [...selectedValues, value];
      onChange(newValues);
    } else {
      // For single-select, just select the new value
      onChange([value]);
    }
  };

  return (
    <ExpandableSection
      title={title}
      icon={icon}
      initialExpanded={initialExpanded}
      className={className}
      darkMode={darkMode}
    >
      {options.length === 0 ? (
        <Typography variant="body2" color="medium-gray">
          No options available
        </Typography>
      ) : (
        <div className="flex flex-wrap gap-sm">
          {options.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              count={showCounts ? option.count : undefined}
              selected={selectedValues.includes(option.value)}
              onClick={() => handleChipClick(option.value)}
              disabled={option.disabled}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </ExpandableSection>
  );
};

// Option shape
const optionShape = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  disabled: PropTypes.bool,
});

FilterAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  options: PropTypes.arrayOf(optionShape).isRequired,
  selectedValues: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  showCounts: PropTypes.bool,
  initialExpanded: PropTypes.bool,
  className: PropTypes.string,
  multiSelect: PropTypes.bool,
  darkMode: PropTypes.bool,
};

export default FilterAccordion;