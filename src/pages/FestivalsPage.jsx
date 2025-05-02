import { useState, useEffect } from 'react';
import PageLayout from '../components/templates/PageLayout';
import Typography from '../components/atoms/Typography';
import BrandHeading from '../components/atoms/BrandHeading';
import Spinner from '../components/atoms/Spinner';
import EntityCard from '../components/organisms/EntityCard';
import useFestivals from '../hooks/useFestivals';
import Button from '../components/atoms/Button';

/**
 * FestivalsPage component that displays a list of all festivals
 * Mobile-optimized with responsive grid for larger screens
 */
const FestivalsPage = () => {
  // Track the active filter type
  const [activeFilter, setActiveFilter] = useState('all');

  // Create a festivals hook instance
  const {
    festivals,
    loading,
    error,
    getCurrentFestivals,
    getUpcomingFestivals,
    updateFilters,
    refresh,
  } = useFestivals({
    includePast: true, // By default, show all festivals including past ones
  });

  // State to store filtered festivals
  const [displayedFestivals, setDisplayedFestivals] = useState([]);
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Default to showing all festivals
        setDisplayedFestivals(festivals);
      } catch (error) {
        console.error('Error fetching festivals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [festivals]);

  // Handle filter change
  const handleFilterChange = async filterType => {
    setActiveFilter(filterType);
    setIsLoading(true);

    try {
      if (filterType === 'active') {
        // Get currently active festivals
        const currentFestivals = await getCurrentFestivals();
        setDisplayedFestivals(currentFestivals);
      } else if (filterType === 'upcoming') {
        // Get upcoming festivals
        const upcomingFestivals = await getUpcomingFestivals();
        setDisplayedFestivals(upcomingFestivals);
      } else {
        // Reset to all festivals
        updateFilters({ includePast: true });
        refresh();
        setDisplayedFestivals(festivals);
      }
    } catch (error) {
      console.error('Error filtering festivals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Page header */}
      <div className="pt-6 px-4 mb-6">
        <BrandHeading level={1} gradient className="mb-2">
          Festivals
        </BrandHeading>
        <Typography variant="body1" color="medium-gray">
          Special events and festival performances in Orlando theme parks
        </Typography>
      </div>

      {/* Filter tabs - Mobile friendly touch targets */}
      <div className="flex justify-start px-4 mb-6 overflow-x-auto">
        <Button
          variant={activeFilter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          className="mr-3 min-w-[100px]"
          onClick={() => handleFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={activeFilter === 'active' ? 'primary' : 'secondary'}
          size="sm"
          className="mr-3 min-w-[100px]"
          onClick={() => handleFilterChange('active')}
        >
          Active
        </Button>
        <Button
          variant={activeFilter === 'upcoming' ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[100px]"
          onClick={() => handleFilterChange('upcoming')}
        >
          Upcoming
        </Button>
      </div>

      {/* Festivals grid - Single column on mobile, multi-column on larger screens */}
      <div className="px-4">
        {loading || isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner color="deep-orchid" size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Typography variant="body1" color="error">
              Unable to load festivals. Please try again later.
            </Typography>
          </div>
        ) : displayedFestivals.length === 0 ? (
          <div className="text-center py-16">
            <Typography variant="body1" color="medium-gray">
              No festivals found matching the selected filters.
            </Typography>
            <Button variant="ghost" className="mt-4" onClick={() => handleFilterChange('all')}>
              View all festivals
            </Button>
          </div>
        ) : (
          // Grid layout with responsive columns
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFestivals.map((festival, index) => (
              <div key={festival.id} className="mb-4">
                <EntityCard
                  entity={festival}
                  featured={index === 0 && activeFilter === 'all'}
                  type="festival"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FestivalsPage;
