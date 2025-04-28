import { useState } from 'react';
import PropTypes from 'prop-types';
import PageLayout from './PageLayout';
import Calendar from '../organisms/Calendar';
import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';
import { formatDate } from '../../utils/dateUtils';

/**
 * CalendarPageLayout component for date-based views
 * Mobile-optimized with calendar and results area
 */
const CalendarPageLayout = ({
  initialDate = new Date(),
  onDateSelect,
  highlightedDates = [],
  resultsTitle,
  filterComponent,
  children,
  className = '',
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showCalendar, setShowCalendar] = useState(true);

  // Handle date selection
  const handleDateSelect = date => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <PageLayout className={className}>
      {/* Calendar header with toggle */}
      <div className="bg-background sticky top-0 z-10 shadow-sm border-b border-deep-orchid border-opacity-30">
        <div className="flex items-center justify-between p-md">
          <Typography variant="h3">Calendar</Typography>

          <IconButton
            icon={showCalendar ? 'chevron-up' : 'chevron-down'}
            ariaLabel={showCalendar ? 'Hide calendar' : 'Show calendar'}
            onClick={toggleCalendar}
          />
        </div>

        {/* Collapsible calendar */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showCalendar ? 'max-h-[350px]' : 'max-h-0'
          }`}
        >
          <div className="p-md pb-lg">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              highlightedDates={highlightedDates}
            />
          </div>
        </div>

        {/* Selected date display - always visible */}
        <div className="flex items-center justify-between p-md border-t border-deep-orchid border-opacity-30">
          <Typography variant="h4">{formatDate(selectedDate)}</Typography>

          {filterComponent && <div>{filterComponent}</div>}
        </div>
      </div>

      {/* Results title */}
      {resultsTitle && (
        <div className="p-md">
          <Typography variant="h3">{resultsTitle}</Typography>
        </div>
      )}

      {/* Results content */}
      <div className="px-md">{children}</div>
    </PageLayout>
  );
};

CalendarPageLayout.propTypes = {
  initialDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  highlightedDates: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  ),
  resultsTitle: PropTypes.string,
  filterComponent: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default CalendarPageLayout;
