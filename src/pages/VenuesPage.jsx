import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageLayout from '../components/templates/PageLayout';
import Typography from '../components/atoms/Typography';
import BrandHeading from '../components/atoms/BrandHeading';
import Spinner from '../components/atoms/Spinner';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import useVenues from '../hooks/useVenues';

/**
 * VenuesPage component that displays a list of all venues
 * Mobile-optimized with responsive grid for larger screens and filtering functionality
 */
const VenuesPage = () => {
  // Track the active filter type
  const [activeFilter, setActiveFilter] = useState('all');

  // Create a venues hook instance
  const { venues, loading, error, refresh, getVenuesByPark, getVenuesWithUpcomingConcerts } =
    useVenues();

  // State to store filtered venues
  const [displayedVenues, setDisplayedVenues] = useState([]);
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Default to showing all venues
        setDisplayedVenues(venues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [venues]);

  // Handle filter change
  const handleFilterChange = async filterType => {
    setActiveFilter(filterType);
    setIsLoading(true);

    try {
      if (filterType === 'upcoming-concerts') {
        // Get venues with upcoming concerts
        const venuesWithConcerts = await getVenuesWithUpcomingConcerts();
        setDisplayedVenues(venuesWithConcerts);
      } else if (filterType.startsWith('park-')) {
        // Get venues by specific park
        const parkId = filterType.replace('park-', '');
        const parkVenues = await getVenuesByPark(parkId);
        setDisplayedVenues(parkVenues);
      } else {
        // Reset to all venues
        refresh();
        setDisplayedVenues(venues);
      }
    } catch (error) {
      console.error('Error filtering venues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplify park filtering by mapping park IDs to names
  // In a real implementation, these would come from a parks service/hook
  const parks = [
    { id: 'magic-kingdom', name: 'Magic Kingdom' },
    { id: 'epcot', name: 'EPCOT' },
    { id: 'hollywood-studios', name: 'Hollywood Studios' },
    { id: 'animal-kingdom', name: 'Animal Kingdom' },
    { id: 'universal-studios', name: 'Universal Studios' },
    { id: 'islands-of-adventure', name: 'Islands of Adventure' },
  ];

  /**
   * VenueCard component for displaying venue information
   * Mobile-optimized with responsive design
   */
  const VenueCard = ({ venue }) => {
    return (
      <Link to={`/venues/${venue.id}`} className="block h-full">
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
          {/* Venue image */}
          <div className="relative h-40 overflow-hidden rounded-t-lg">
            <img
              src={venue.image_url || '/images/placeholder-venue.jpg'}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Venue details */}
          <div className="p-4 flex-grow flex flex-col">
            <Typography variant="h4" className="mb-1">
              {venue.name}
            </Typography>

            {/* Park name */}
            {venue.park && (
              <div className="flex items-center mb-2">
                <Icon name="map" size="sm" className="text-primary mr-1" />
                <Typography variant="body2" color="medium-gray">
                  {venue.park.name}
                </Typography>
              </div>
            )}

            {/* Venue capacity if available */}
            {venue.capacity && (
              <div className="flex items-center mb-2">
                <Icon name="users" size="sm" className="text-primary mr-1" />
                <Typography variant="body2" color="medium-gray">
                  Capacity: {venue.capacity.toLocaleString()}
                </Typography>
              </div>
            )}

            {/* Indoor/outdoor status if available */}
            {venue.venue_type && (
              <div className="flex items-center">
                <Icon
                  name={venue.venue_type === 'indoor' ? 'home' : 'cloud'}
                  size="sm"
                  className="text-primary mr-1"
                />
                <Typography variant="body2" color="medium-gray">
                  {venue.venue_type === 'indoor' ? 'Indoor Venue' : 'Outdoor Venue'}
                </Typography>
              </div>
            )}
          </div>
        </Card>
      </Link>
    );
  };

  // PropTypes validation for VenueCard
  VenueCard.propTypes = {
    venue: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string,
      park: PropTypes.shape({
        name: PropTypes.string,
      }),
      capacity: PropTypes.number,
      venue_type: PropTypes.string,
    }).isRequired,
  };

  return (
    <PageLayout>
      {/* Page header */}
      <div className="pt-6 px-4 mb-6">
        <BrandHeading level={1} gradient className="mb-2">
          Venues
        </BrandHeading>
        <Typography variant="body1" color="medium-gray">
          Concert and performance venues across Orlando theme parks
        </Typography>
      </div>

      {/* Filter tabs - Horizontally scrollable on mobile for good touch targets */}
      <div className="flex justify-start px-4 mb-6 overflow-x-auto pb-2">
        <Button
          variant={activeFilter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          className="mr-3 min-w-[100px] whitespace-nowrap"
          onClick={() => handleFilterChange('all')}
        >
          All Venues
        </Button>
        <Button
          variant={activeFilter === 'upcoming-concerts' ? 'primary' : 'secondary'}
          size="sm"
          className="mr-3 min-w-[100px] whitespace-nowrap"
          onClick={() => handleFilterChange('upcoming-concerts')}
        >
          With Concerts
        </Button>

        {/* Park filters */}
        {parks.map(park => (
          <Button
            key={park.id}
            variant={activeFilter === `park-${park.id}` ? 'primary' : 'secondary'}
            size="sm"
            className="mr-3 min-w-[100px] whitespace-nowrap"
            onClick={() => handleFilterChange(`park-${park.id}`)}
          >
            {park.name}
          </Button>
        ))}
      </div>

      {/* Venues grid - Single column on mobile, multi-column on larger screens */}
      <div className="px-4 pb-6">
        {loading || isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner color="deep-orchid" size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Typography variant="body1" color="error">
              Unable to load venues. Please try again later.
            </Typography>
          </div>
        ) : displayedVenues.length === 0 ? (
          <div className="text-center py-16">
            <Typography variant="body1" color="medium-gray">
              No venues found matching the selected filters.
            </Typography>
            <Button variant="ghost" className="mt-4" onClick={() => handleFilterChange('all')}>
              View all venues
            </Button>
          </div>
        ) : (
          // Grid layout with responsive columns
          // Single column for mobile, two columns for tablet, three for desktop
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedVenues.map(venue => (
              <div key={venue.id} className="mb-4">
                <VenueCard venue={venue} />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default VenuesPage;
