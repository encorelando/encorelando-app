import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import CalendarPageLayout from '../components/templates/CalendarPageLayout';
import PerformanceList from '../components/organisms/PerformanceList';
import useConcerts from '../hooks/useConcerts';
import useParks from '../hooks/useParks';

/**
 * CalendarPage component for date-based concert listings
 * Mobile-optimized with calendar and filtering
 */
const CalendarPage = () => {
  // State for selected date and filters
  const [selectedDate, setSelectedDate] = useState(new Date());
  // eslint-disable-next-line no-unused-vars
  const [showFilters, setShowFilters] = useState(false);
  // eslint-disable-next-line no-unused-vars
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

  // Add state for event counts
  const [eventCounts, setEventCounts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [eventCountsLoading, setEventCountsLoading] = useState(false);

  // Track if initial load has happened
  const [initialLoad, setInitialLoad] = useState(false);
  const currentMonthRef = useRef(new Date().getMonth());

  // Get all the needed hook functions and state
  const { loading, error, concerts, updateFilters, getConcertDatesWithCounts } =
    useConcerts(initialFilters);

  // Fetch parks for filter options
  // eslint-disable-next-line no-unused-vars
  const { parks } = useParks();

  // Function to load event counts for calendar display - defined before it's used
  const loadEventCounts = useCallback(
    async (month = new Date().getMonth(), year = new Date().getFullYear()) => {
      try {
        setEventCountsLoading(true);

        // Create start date (first day of month)
        const startDate = new Date(year, month, 1);

        // Create end date (last day of next month to include 2 months of data)
        const endDate = new Date(year, month + 2, 0);

        // Fetch event counts
        const filterOptions = {
          startDate,
          endDate,
          ...(filters.parkIds && filters.parkIds.length > 0 ? { parkId: filters.parkIds } : {}),
        };

        const counts = await getConcertDatesWithCounts(filterOptions);
        setEventCounts(counts);

        // Update the current month reference
        currentMonthRef.current = month;
      } catch (error) {
        console.error('Failed to load event counts:', error);
      } finally {
        setEventCountsLoading(false);
      }
    },
    [filters.parkIds, getConcertDatesWithCounts]
  );

  // Handle date selection
  const handleDateSelect = useCallback(
    date => {
      console.log(`Date selected: ${date.toISOString()}`);
      setSelectedDate(date);

      // If the month changes, load event counts for the new month
      const selectedMonth = date.getMonth();
      if (selectedMonth !== currentMonthRef.current) {
        loadEventCounts(selectedMonth, date.getFullYear());
      }

      // Note: The concerts will be updated through the filter change in useEffect
    },
    [loadEventCounts]
  );

  // After initial render, mark as loaded
  useEffect(() => {
    if (!initialLoad) {
      setInitialLoad(true);

      // Load initial event counts for the current month and next month
      loadEventCounts();
    }
  }, [initialLoad, loadEventCounts]);

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

  return (
    <CalendarPageLayout
      initialDate={selectedDate}
      onDateSelect={handleDateSelect}
      eventCounts={eventCounts}
      allowPastSelection={true}
      onMonthChange={loadEventCounts}
      resultsTitle={`Performances on ${selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`}
    >
      {/* Filters panel temporarily disabled */}

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
