import React, { useState, useEffect, useCallback } from 'react';
import CalendarPageLayout from '../components/templates/CalendarPageLayout';
import PerformanceList from '../components/organisms/PerformanceList';
import IconButton from '../components/atoms/IconButton';
import FilterAccordion from '../components/organisms/FilterAccordion';
import { formatDateForApi } from '../utils/dateUtils';
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
  
  // Format date for API
  const formattedDate = formatDateForApi(selectedDate);
  
  // Fetch concerts for selected date
  const { 
    loading,
    error,
    getConcertsByDate,
    concerts
  } = useConcerts();
  
  // Fetch parks for filter options
  const { parks } = useParks();
  
  // Fetch concerts when date or filters change
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        await getConcertsByDate(formattedDate, {
          ...(filters.parkIds.length > 0 ? { parkId: filters.parkIds } : {})
        });
      } catch (err) {
        console.error('Error fetching concerts by date:', err);
      }
    };
    
    fetchConcerts();
  }, [formattedDate, filters, getConcertsByDate]);
  
  // Handle date selection
  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
  }, []);
  
  // Handle filter changes
  const handleFilterChange = useCallback((key, values) => {
    setFilters(prev => ({
      ...prev,
      [key]: values
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
      resultsTitle={`Performances on ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
    >
      {/* Filters panel (conditionally shown) */}
      {showFilters && (
        <div className="mb-lg">
          <FilterAccordion
            title="Parks"
            icon="map-pin"
            options={parkOptions}
            selectedValues={filters.parkIds}
            onChange={(values) => handleFilterChange('parkIds', values)}
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