import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import FilterAccordion from './FilterAccordion';
import Divider from '../atoms/Divider';

/**
 * SearchFilters component for combining multiple filter accordions
 * Mobile-optimized with collapsible sections and dark theme support
 */
const SearchFilters = ({
  filters,
  selectedFilters,
  onFilterChange,
  onReset,
  darkMode = false,
  className = '',
}) => {
  // Check if any filters are selected
  const hasActiveFilters = Object.values(selectedFilters).some(
    values => Array.isArray(values) && values.length > 0
  );

  // Handle filter change for a specific filter group
  const handleFilterChange = (filterKey, values) => {
    onFilterChange({
      ...selectedFilters,
      [filterKey]: values,
    });
  };

  return (
    <div
      className={`${darkMode ? 'bg-background text-white' : 'bg-white'} rounded ${
        darkMode ? 'shadow-lg' : 'shadow-card'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-md">
        <Typography variant="h3" color={darkMode ? 'white' : 'dark-gray'}>
          Filters
        </Typography>

        {hasActiveFilters && (
          <Button variant={darkMode ? 'ghost-light' : 'ghost'} size="sm" onClick={onReset}>
            Reset All
          </Button>
        )}
      </div>

      <Divider margin="none" color={darkMode ? 'white-15' : 'light-gray'} />

      {/* Filter sections */}
      {filters.map((filterGroup, index) => (
        <React.Fragment key={filterGroup.key}>
          <FilterAccordion
            title={filterGroup.title}
            icon={filterGroup.icon}
            options={filterGroup.options}
            selectedValues={selectedFilters[filterGroup.key] || []}
            onChange={values => handleFilterChange(filterGroup.key, values)}
            showCounts={filterGroup.showCounts !== false}
            initialExpanded={index === 0} // First filter expanded by default
            multiSelect={filterGroup.multiSelect !== false}
            darkMode={darkMode}
          />

          {/* No divider after last item */}
          {index < filters.length - 1 && (
            <Divider margin="none" color={darkMode ? 'white-15' : 'light-gray'} />
          )}
        </React.Fragment>
      ))}

      {/* Apply filters button - mobile friendly footer */}
      <div
        className={`sticky bottom-0 p-md ${
          darkMode ? 'bg-background border-white border-opacity-10' : 'bg-white border-light-gray'
        } border-t shadow-lg`}
      >
        <Button
          variant={darkMode ? 'gradient' : 'primary'}
          fullWidth
          onClick={() => {}} // No-op as filters apply automatically
        >
          Show Results
        </Button>
      </div>
    </div>
  );
};

// Filter shape
const filterShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  showCounts: PropTypes.bool,
  multiSelect: PropTypes.bool,
});

SearchFilters.propTypes = {
  filters: PropTypes.arrayOf(filterShape).isRequired,
  selectedFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchFilters;
