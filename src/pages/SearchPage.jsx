import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchPageLayout from '../components/templates/SearchPageLayout';
import SearchFilters from '../components/organisms/SearchFilters';
import Typography from '../components/atoms/Typography';
import BrandHeading from '../components/atoms/BrandHeading';
import PerformanceCard from '../components/organisms/PerformanceCard';
import ArtistCard from '../components/organisms/ArtistCard';
import FestivalCard from '../components/organisms/FestivalCard';
import Spinner from '../components/atoms/Spinner';
import Icon from '../components/atoms/Icon';
import Button from '../components/atoms/Button';
import useSearch from '../hooks/useSearch';

/**
 * SearchPage component with the new EncoreLando branding
 * Mobile-optimized with dark theme and comprehensive filtering
 */
const SearchPage = () => {
  // Get search query from URL
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  // State for search and filters
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    entityTypes: [],
    parkIds: [],
    dates: [],
  });
  
  // Fetch search results
  const {
    results,
    loading,
    error,
    globalSearch,
  } = useSearch();
  
  // Update URL when search changes
  useEffect(() => {
    if (searchValue) {
      queryParams.set('q', searchValue);
      navigate({ search: queryParams.toString() }, { replace: true });
      
      // Perform search with filters
      globalSearch(searchValue, {
        entityTypes: selectedFilters.entityTypes.length > 0 
          ? selectedFilters.entityTypes 
          : ['concerts', 'artists', 'festivals', 'venues'],
        parkIds: selectedFilters.parkIds,
        dates: selectedFilters.dates,
      });
    }
  }, [searchValue, selectedFilters]);
  
  // Handle search submission
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedFilters({
      entityTypes: [],
      parkIds: [],
      dates: [],
    });
  };
  
  // Filter configurations
  const filterGroups = [
    {
      key: 'entityTypes',
      title: 'Result Type',
      icon: 'filter',
      options: [
        { value: 'concerts', label: 'Concerts', count: results.concerts?.length || 0 },
        { value: 'artists', label: 'Artists', count: results.artists?.length || 0 },
        { value: 'festivals', label: 'Festivals', count: results.festivals?.length || 0 },
        { value: 'venues', label: 'Venues', count: results.venues?.length || 0 },
      ],
    },
    {
      key: 'parkIds',
      title: 'Theme Parks',
      icon: 'map-pin',
      options: [
        { value: 'magic-kingdom', label: 'Magic Kingdom', count: 24 },
        { value: 'epcot', label: 'Epcot', count: 32 },
        { value: 'hollywood-studios', label: 'Hollywood Studios', count: 18 },
        { value: 'animal-kingdom', label: 'Animal Kingdom', count: 12 },
        { value: 'universal-studios', label: 'Universal Studios', count: 26 },
        { value: 'islands-of-adventure', label: 'Islands of Adventure', count: 20 },
      ],
    },
    {
      key: 'dates',
      title: 'Date Range',
      icon: 'calendar',
      options: [
        { value: 'today', label: 'Today', count: 8 },
        { value: 'tomorrow', label: 'Tomorrow', count: 12 },
        { value: 'this-week', label: 'This Week', count: 45 },
        { value: 'this-weekend', label: 'This Weekend', count: 32 },
        { value: 'next-week', label: 'Next Week', count: 38 },
        { value: 'this-month', label: 'This Month', count: 120 },
      ],
      multiSelect: false,
    },
  ];
  
  // Calculate total results count
  const resultsCount = 
    (results.concerts?.length || 0) + 
    (results.artists?.length || 0) + 
    (results.festivals?.length || 0) + 
    (results.venues?.length || 0);
    
  // Display empty state with dark theme styling
  const renderEmptyState = () => (
    <div className="text-center py-xl">
      <Icon name="search" size="lg" color="white" className="mb-md text-opacity-50" />
      <Typography variant="h4" color="medium-gray">
        No results found
      </Typography>
      <Typography variant="body1" color="medium-gray" className="mt-xs">
        Try adjusting your search or filters
      </Typography>
      {Object.keys(selectedFilters).some(key => selectedFilters[key].length > 0) && (
        <Button variant="secondary" className="mt-md" onClick={resetFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Filters sidebar with dark theme - conditionally shown */}
      {showFilters && (
        <div className="fixed inset-0 z-40 bg-background">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <SearchFilters
                filters={filterGroups}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                darkMode={true}
              />
            </div>
            <div className="p-md border-t border-white border-opacity-10">
              <Button
                variant="gradient"
                fullWidth
                onClick={toggleFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        <SearchPageLayout
          initialSearchValue={searchValue}
          onSearch={handleSearch}
          onFilterToggle={toggleFilters}
          showFilters={showFilters}
          resultsCount={loading ? undefined : resultsCount}
        >
          {/* Loading state with dark theme colors */}
          {loading && (
            <div className="flex justify-center items-center py-xl">
              <Spinner size="lg" color="sunset-orange" />
            </div>
          )}
          
          {/* Error state with dark theme colors */}
          {error && !loading && (
            <div className="text-center py-lg">
              <Icon name="alert" size="lg" color="error" className="mb-md" />
              <Typography variant="h4" color="error">
                Something went wrong
              </Typography>
              <Typography variant="body1" color="medium-gray" className="mt-xs">
                {error}
              </Typography>
            </div>
          )}
          
          {/* Empty state */}
          {!loading && !error && resultsCount === 0 && searchValue && (
            renderEmptyState()
          )}
          
          {/* Search prompt with dark theme colors */}
          {!loading && !error && !searchValue && (
            <div className="text-center py-xl">
              <Icon name="search" size="lg" color="deep-orchid" className="mb-md" />
              <Typography variant="h4" color="white">
                Search for concerts, artists, venues, and more
              </Typography>
              <Typography variant="body1" color="medium-gray" className="mt-xs">
                Enter keywords in the search box above
              </Typography>
            </div>
          )}
          
          {/* Results */}
          {!loading && !error && searchValue && resultsCount > 0 && (
            <div className="space-y-xl">
              {/* Concerts section with updated branding */}
              {results.concerts && results.concerts.length > 0 && (
                <div>
                  <BrandHeading level={3} gradient className="mb-md">
                    Concerts
                  </BrandHeading>
                  <div className="space-y-md">
                    {results.concerts.slice(0, 5).map((concert, index) => (
                      <PerformanceCard
                        key={concert.id}
                        performance={concert}
                        showDate={true}
                        featured={index === 0}
                      />
                    ))}
                    {results.concerts.length > 5 && (
                      <Button 
                        variant="secondary" 
                        fullWidth
                        className="mt-sm"
                      >
                        View All {results.concerts.length} Concerts
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Artists section with updated branding */}
              {results.artists && results.artists.length > 0 && (
                <div>
                  <BrandHeading level={3} gradient className="mb-md">
                    Artists
                  </BrandHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
                    {results.artists.slice(0, 6).map((artist, index) => (
                      <ArtistCard
                        key={artist.id}
                        artist={artist}
                        featured={index === 0}
                      />
                    ))}
                  </div>
                  {results.artists.length > 6 && (
                    <Button 
                      variant="secondary" 
                      fullWidth
                      className="mt-md"
                    >
                      View All {results.artists.length} Artists
                    </Button>
                  )}
                </div>
              )}
              
              {/* Festivals section with updated branding */}
              {results.festivals && results.festivals.length > 0 && (
                <div>
                  <BrandHeading level={3} gradient className="mb-md">
                    Festivals
                  </BrandHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    {results.festivals.slice(0, 4).map((festival, index) => (
                      <FestivalCard
                        key={festival.id}
                        festival={festival}
                        featured={index === 0}
                      />
                    ))}
                  </div>
                  {results.festivals.length > 4 && (
                    <Button 
                      variant="secondary" 
                      fullWidth
                      className="mt-md"
                    >
                      View All {results.festivals.length} Festivals
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </SearchPageLayout>
      </div>
    </div>
  );
};

export default SearchPage;