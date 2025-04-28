import { useState } from 'react';
import PropTypes from 'prop-types';
import PageLayout from './PageLayout';
import SearchInput from '../molecules/SearchInput';
import IconButton from '../atoms/IconButton';
import Typography from '../atoms/Typography';

/**
 * SearchPageLayout component with the new EncoreLando branding
 * Mobile-optimized with dark theme, fixed search header and filter accessibility
 */
const SearchPageLayout = ({
  initialSearchValue = '',
  onSearch,
  onFilterToggle,
  showFilters = false,
  resultsCount,
  children,
  className = '',
}) => {
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  // Handle search input changes
  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  // Handle search clear
  const handleClear = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <PageLayout className={className}>
      {/* Fixed search header with dark theme */}
      <div className="sticky top-0 bg-background z-10 shadow-md border-b border-white border-opacity-10">
        <div className="p-md">
          <div className="flex items-center">
            <div className="flex-1">
              <SearchInput
                value={searchValue}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                onClear={handleClear}
                placeholder="Search concerts, artists, venues..."
                darkMode={true}
              />
            </div>

            {/* Filter toggle button with updated styling */}
            {onFilterToggle && (
              <div className="ml-sm">
                <IconButton
                  icon="filter"
                  ariaLabel={showFilters ? 'Hide filters' : 'Show filters'}
                  onClick={onFilterToggle}
                  variant={showFilters ? 'primary' : 'ghost'}
                />
              </div>
            )}
          </div>

          {/* Results count with updated styling */}
          {resultsCount !== undefined && (
            <div className="mt-xs">
              <Typography variant="body2" color="medium-gray">
                {resultsCount} {resultsCount === 1 ? 'result' : 'results'} found
              </Typography>
            </div>
          )}
        </div>

        {/* Gradient line at the bottom of the header */}
        <div className="h-[1px] bg-brand-gradient w-full"></div>
      </div>

      {/* Page content with dark theme background */}
      <div className="p-md bg-background text-white">{children}</div>
    </PageLayout>
  );
};

SearchPageLayout.propTypes = {
  initialSearchValue: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  onFilterToggle: PropTypes.func,
  showFilters: PropTypes.bool,
  resultsCount: PropTypes.number,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SearchPageLayout;
