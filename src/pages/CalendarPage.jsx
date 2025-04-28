import { useState, useEffect, useCallback, useMemo } from 'react';
import CalendarPageLayout from '../components/templates/CalendarPageLayout';
import PerformanceList from '../components/organisms/PerformanceList';
import IconButton from '../components/atoms/IconButton';
import FilterAccordion from '../components/organisms/FilterAccordion';
import useConcerts from '../hooks/useConcerts';
import useParks from '../hooks/useParks';

/**
 * CalendarPage component for date-based concert listings
 * Mobile-optimized with calendar and filtering
 */
const CalendarPage = () => {
  // State for selected date and filters
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    parkIds: [],
  });

  // Create start and end dates for the selected day (full day in local time)
  const { startOfDay, endOfDay } = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    return { startOfDay: start, endOfDay: end };
  }, [selectedDate]);

  // Initialize the concerts hook with the date range filters
  const initialFilters = useMemo(
    () => ({
      startDate: startOfDay,
      endDate: endOfDay,
    }),
    [startOfDay, endOfDay]
  );

  // Get all the needed hook functions and state
  const { loading, error, concerts, updateFilters } = useConcerts(initialFilters);

  // Fetch parks for filter options
  const { parks } = useParks();

  // Track if initial load has happened
  const [initialLoad, setInitialLoad] = useState(false);

  // After initial render, mark as loaded
  useEffect(() => {
    if (!initialLoad) {
      setInitialLoad(true);
    }
  }, [initialLoad]);

  // Update filters when date or park filters change
  useEffect(() => {
    if (initialLoad && startOfDay && endOfDay) {
      console.log(
        `Updating filters for date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`
      );

      // Build the filter object
      const newFilters = {
        startDate: startOfDay,
        endDate: endOfDay,
      };

      if (filters.parkIds && filters.parkIds.length > 0) {
        console.log('Including park filters:', filters.parkIds);
        newFilters.parkId = filters.parkIds;
      }

      // Update filters in the hook
      updateFilters(newFilters);
    }
  }, [startOfDay, endOfDay, filters.parkIds, updateFilters, initialLoad]);

  // Handle date selection
  const handleDateSelect = useCallback(date => {
    console.log(`Date selected: ${date.toISOString()}`);
    setSelectedDate(date);
    // Note: The concerts will be updated through the filter change in useEffect
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((key, values) => {
    setFilters(prev => ({
      ...prev,
      [key]: values,
    }));
  }, []);

  // Toggle filters visibility
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Build filter options from parks data
  const parkOptions = parks.map(park => ({
    value: park.id,
    label: park.name,
  }));

  // Filter button component for the calendar header
  const filterButton = (
    <IconButton
      icon="filter"
      ariaLabel={showFilters ? 'Hide filters' : 'Show filters'}
      onClick={toggleFilters}
      variant={filters.parkIds.length > 0 ? 'primary' : 'ghost'}
    />
  );

  return (
    <CalendarPageLayout
      initialDate={selectedDate}
      onDateSelect={handleDateSelect}
      filterComponent={filterButton}
      resultsTitle={`Performances on ${selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`}
    >
      {/* Filters panel (conditionally shown) */}
      {showFilters && (
        <div className="mb-lg">
          <FilterAccordion
            title="Parks"
            icon="map-pin"
            options={parkOptions}
            selectedValues={filters.parkIds}
            onChange={values => handleFilterChange('parkIds', values)}
            initialExpanded={true}
          />
        </div>
      )}

      {/* Performance list */}
      <PerformanceList
        performances={concerts}
        loading={loading}
        error={error}
        emptyMessage="No performances scheduled for this date"
      />
    </CalendarPageLayout>
  );
};

export default CalendarPage;
