import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '../components/templates/PageLayout';
import SearchInput from '../components/molecules/SearchInput';
import ArtistCard from '../components/organisms/ArtistCard';
import Typography from '../components/atoms/Typography';
import BrandHeading from '../components/atoms/BrandHeading';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import Icon from '../components/atoms/Icon';
import FilterAccordion from '../components/organisms/FilterAccordion';
import IconButton from '../components/atoms/IconButton';
import useArtists from '../hooks/useArtists';

/**
 * ArtistDirectoryPage component for browsing artists
 * Mobile-optimized with search and filtering
 */
const ArtistDirectoryPage = () => {
  // State for search and filters
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genres: [],
  });
  
  // Fetch artists with search and filters
  const {
    artists,
    loading,
    error,
    pagination,
    updateFilters,
    loadMore
  } = useArtists({
    name: debouncedSearch,
    ...(filters.genres.length > 0 ? { genre: filters.genres } : {}),
  });
  
  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchValue]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  // Handle search clear
  const handleSearchClear = () => {
    setSearchValue('');
    setDebouncedSearch('');
  };
  
  // Handle filter changes
  const handleFilterChange = (key, values) => {
    setFilters(prev => ({
      ...prev,
      [key]: values
    }));
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  // Determine if there are more artists to load
  const hasMore = artists.length < pagination.total;
  
  // Sample genre options (in a real app, these would come from the API)
  const genreOptions = [
    { value: 'rock', label: 'Rock', count: 12 },
    { value: 'pop', label: 'Pop', count: 18 },
    { value: 'jazz', label: 'Jazz', count: 8 },
    { value: 'blues', label: 'Blues', count: 6 },
    { value: 'country', label: 'Country', count: 10 },
    { value: 'electronic', label: 'Electronic', count: 7 },
    { value: 'hip-hop', label: 'Hip-Hop', count: 5 },
  ];

  return (
    <PageLayout>
      {/* Search header with dark theme */}
      <div className="sticky top-0 z-10 bg-background border-b border-white border-opacity-10 shadow-sm">
        <div className="p-md">
          <div className="flex items-center">
            <BrandHeading level={2} className="mb-md" gradient>
              Artists
            </BrandHeading>
          </div>
          
          <div className="flex items-center">
            <div className="flex-1">
              <SearchInput
                value={searchValue}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
                placeholder="Search artists..."
                darkMode={true}
              />
            </div>
            
            <div className="ml-sm">
              <IconButton
                icon="filter"
                ariaLabel={showFilters ? 'Hide filters' : 'Show filters'}
                onClick={toggleFilters}
                variant={filters.genres.length > 0 ? 'primary' : 'ghost'}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters with dark theme (conditionally shown) */}
      {showFilters && (
        <div className="p-md bg-background border-b border-white border-opacity-10">
          <FilterAccordion
            title="Genres"
            icon="music"
            options={genreOptions}
            selectedValues={filters.genres}
            onChange={(values) => handleFilterChange('genres', values)}
            initialExpanded={true}
            darkMode={true}
          />
        </div>
      )}
      
      {/* Artists grid */}
      <div className="p-md bg-background">
        {/* Loading state with updated brand colors */}
        {loading && !artists.length && (
          <div className="flex justify-center items-center py-xl">
            <Spinner size="lg" color="sunset-orange" />
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-lg">
            <Icon name="alert" size="lg" color="error" className="mb-md" />
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && artists.length === 0 && (
          <div className="text-center py-lg">
            <Icon name="info" size="lg" color="white" className="text-opacity-70 mb-md" />
            <Typography variant="body1" color="medium-gray">
              No artists found
            </Typography>
          </div>
        )}
        
        {/* Artists grid - mobile-optimized with proper spacing */}
        {artists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
            {artists.map(artist => (
              <ArtistCard
                key={artist.id}
                artist={artist}
              />
            ))}
          </div>
        )}
        
        {/* Load more button with updated branding */}
        {hasMore && (
          <div className="flex justify-center mt-lg mb-md">
            <Button
              variant="secondary"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="white" className="mr-xs" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ArtistDirectoryPage;