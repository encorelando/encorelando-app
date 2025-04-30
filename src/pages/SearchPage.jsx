import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchPageLayout from '../components/templates/SearchPageLayout';
import SearchFilters from '../components/organisms/SearchFilters';
import Typography from '../components/atoms/Typography';
import BrandHeading from '../components/atoms/BrandHeading';
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
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
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
  const { results, loading, error, globalSearch } = useSearch();

  // Update URL when search changes and perform search
  useEffect(() => {
    console.log('[SearchPage] Search triggered with value:', searchValue);
    console.log('[SearchPage] Selected filters:', JSON.stringify(selectedFilters, null, 2));

    if (searchValue) {
      queryParams.set('q', searchValue);
      navigate({ search: queryParams.toString() }, { replace: true });

      // Determine search types to use - TEMPORARY FIX: Remove 'concerts' from search types
      const searchTypes =
        selectedFilters.entityTypes.length > 0
          ? selectedFilters.entityTypes.filter(type => type !== 'concerts')
          : ['artists', 'festivals', 'venues', 'parks'];

      console.log('[SearchPage] Searching with types:', searchTypes);

      // Perform search with filters
      const searchOptions = {
        types: searchTypes,
        parkIds: selectedFilters.parkIds,
        dates: selectedFilters.dates,
      };

      console.log('[SearchPage] Search options:', JSON.stringify(searchOptions, null, 2));
      globalSearch(searchValue, searchOptions);
    } else {
      // Clear search results when search value is empty
      console.log('[SearchPage] Clearing search (empty query)');
      queryParams.delete('q');
      navigate({ search: queryParams.toString() }, { replace: true });
    }
  }, [globalSearch, navigate, queryParams, searchValue, selectedFilters]);

  // Handle search submission
  const handleSearch = value => {
    console.log('[SearchPage] handleSearch called with:', value);
    setSearchValue(value);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    console.log('[SearchPage] toggleFilters called, current state:', showFilters);
    setShowFilters(prev => !prev);
  };

  // Handle filter changes
  const handleFilterChange = newFilters => {
    console.log('[SearchPage] handleFilterChange called with:', newFilters);

    // TEMPORARY FIX: Remove concerts from entity types
    const filteredTypes = newFilters.entityTypes
      ? newFilters.entityTypes.filter(type => type !== 'concerts')
      : [];

    setSelectedFilters({
      ...newFilters,
      entityTypes: filteredTypes,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    console.log('[SearchPage] resetFilters called');
    setSelectedFilters({
      entityTypes: [],
      parkIds: [],
      dates: [],
    });
  };

  // Filter configurations - TEMPORARY FIX: Remove concerts from filter options
  const filterGroups = [
    {
      key: 'entityTypes',
      title: 'Result Type',
      icon: 'filter',
      options: [
        // Concert option removed temporarily
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

  // Calculate total results count (excluding concerts completely)
  const resultsCount =
    (results.artists?.length || 0) +
    (results.festivals?.length || 0) +
    (results.venues?.length || 0);

  console.log('[SearchPage] Total results count:', resultsCount);

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
              <Button variant="gradient" fullWidth onClick={toggleFilters}>
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
          {!loading && !error && resultsCount === 0 && searchValue && renderEmptyState()}

          {/* Search prompt with dark theme colors */}
          {!loading && !error && !searchValue && (
            <div className="text-center py-xl">
              <Icon name="search" size="lg" color="deep-orchid" className="mb-md" />
              <Typography variant="h4" color="white">
                Search for artists, venues, and more
              </Typography>
              <Typography variant="body1" color="medium-gray" className="mt-xs">
                Enter keywords in the search box above
              </Typography>
            </div>
          )}

          {/* Results */}
          {!loading && !error && searchValue && resultsCount > 0 && (
            <div className="space-y-xl">
              {/* Artists section with updated branding */}
              {results.artists && results.artists.length > 0 && (
                <div>
                  <BrandHeading level={3} gradient className="mb-md">
                    Artists
                  </BrandHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
                    {results.artists.slice(0, 6).map((artist, index) => {
                      // Ensure artist data is properly formatted
                      console.log('[SearchPage] Processing artist for display:', artist);

                      const formattedArtist = {
                        id: artist.id,
                        name: artist.name,
                        image_url: artist.image_url,
                        genres: artist.genres || [],
                      };

                      console.log('[SearchPage] Formatted artist:', formattedArtist);

                      return (
                        <ArtistCard
                          key={artist.id}
                          artist={formattedArtist}
                          featured={index === 0}
                        />
                      );
                    })}
                  </div>
                  {results.artists.length > 6 && (
                    <Button
                      variant="secondary"
                      fullWidth
                      className="mt-md"
                      onClick={() =>
                        navigate('/artists', {
                          state: { searchResults: results.artists, searchTerm: searchValue },
                        })
                      }
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
                    {results.festivals.slice(0, 4).map((festival, index) => {
                      // Ensure festival data is properly formatted
                      console.log('[SearchPage] Processing festival for display:', festival);

                      const formattedFestival = {
                        id: festival.id,
                        name: festival.name,
                        start_date: festival.start_date,
                        end_date: festival.end_date,
                        image_url: festival.image_url,
                        park: festival.park || festival.parks || {},
                      };

                      console.log('[SearchPage] Formatted festival:', formattedFestival);

                      return (
                        <FestivalCard
                          key={festival.id}
                          festival={formattedFestival}
                          featured={index === 0}
                        />
                      );
                    })}
                  </div>
                  {results.festivals.length > 4 && (
                    <Button
                      variant="secondary"
                      fullWidth
                      className="mt-md"
                      onClick={() =>
                        navigate('/festivals', {
                          state: { searchResults: results.festivals, searchTerm: searchValue },
                        })
                      }
                    >
                      View All {results.festivals.length} Festivals
                    </Button>
                  )}
                </div>
              )}

              {/* Venues section with updated branding */}
              {results.venues && results.venues.length > 0 && (
                <div>
                  <BrandHeading level={3} gradient className="mb-md">
                    Venues
                  </BrandHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
                    {/* eslint-disable-next-line no-unused-vars */}
                    {results.venues.slice(0, 6).map((venue, index) => {
                      console.log('[SearchPage] Processing venue for display:', venue);
                      return (
                        <div key={venue.id} className="bg-card p-md rounded-lg">
                          <Typography variant="h4" color="white" className="mb-xs">
                            {venue.name}
                          </Typography>
                          {venue.parks && (
                            <Typography variant="body2" color="medium-gray">
                              {venue.parks.name}
                            </Typography>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="mt-sm"
                            onClick={() => navigate(`/venues/${venue.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  {results.venues.length > 6 && (
                    <Button
                      variant="secondary"
                      fullWidth
                      className="mt-md"
                      onClick={() =>
                        navigate('/venues', {
                          state: { searchResults: results.venues, searchTerm: searchValue },
                        })
                      }
                    >
                      View All {results.venues.length} Venues
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
