import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';
import { formatDate, isDatePast } from '../../utils/dateUtils';

/**
 * Calendar component for date selection
 * Mobile-optimized with touchable date cells
 * Enhanced with event counts and past date selection
 */
const Calendar = props => {
  const {
    selectedDate,
    onDateSelect,
    highlightedDates = [],
    eventCounts = [],
    allowPastSelection = true,
    className = '',
  } = props;
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [calendarDays, setCalendarDays] = useState([]);

  // Generate calendar days for current month view
  useEffect(() => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of the month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week for the first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();

    // Add days from previous month to fill first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Add days from next month to complete the grid (always show 6 weeks)
    const remainingDays = 42 - days.length; // 6 weeks × 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    setCalendarDays(days);
  }, [currentMonth]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);

      // Notify parent component of month change
      if (props.onMonthChange) {
        props.onMonthChange(newDate.getMonth(), newDate.getFullYear());
      }

      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);

      // Notify parent component of month change
      if (props.onMonthChange) {
        props.onMonthChange(newDate.getMonth(), newDate.getFullYear());
      }

      return newDate;
    });
  };

  // Format month year title
  const monthYearTitle = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Check if a date has events
  const hasEvents = date => {
    // First check if it's in the highlighted dates array
    const inHighlighted = highlightedDates.some(highlightedDate => {
      const highlighted = new Date(highlightedDate);
      return (
        date.getDate() === highlighted.getDate() &&
        date.getMonth() === highlighted.getMonth() &&
        date.getFullYear() === highlighted.getFullYear()
      );
    });

    if (inHighlighted) return true;

    // Then check if it's in the event counts array
    const dateStr = date.toISOString().split('T')[0];
    return eventCounts.some(event => event.date === dateStr && event.count > 0);
  };

  // Get event count for a date
  const getEventCount = date => {
    const dateStr = date.toISOString().split('T')[0];
    const eventData = eventCounts.find(event => event.date === dateStr);
    return eventData ? eventData.count : 0;
  };

  // Check if a date is selected
  const isSelected = date => {
    if (!selectedDate) return false;

    const selected = new Date(selectedDate);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  // Day of week headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`w-full ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-md">
        <IconButton
          icon="chevron-left"
          ariaLabel="Previous month"
          variant="ghost"
          onClick={goToPreviousMonth}
        />

        <Typography variant="h3" color="white">
          {monthYearTitle}
        </Typography>

        <IconButton
          icon="chevron-right"
          ariaLabel="Next month"
          variant="ghost"
          onClick={goToNextMonth}
        />
      </div>

      {/* Day names row */}
      <div className="grid grid-cols-7 ">
        {weekDays.map(day => (
          <div key={day} className="text-center p-xxs">
            <Typography variant="caption" color="white" className="text-opacity-70">
              {day}
            </Typography>
          </div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-0.5 pb-4">
        {' '}
        {/* Replaced max-height with padding-bottom */}
        {calendarDays.map((dayObj, index) => {
          const { date, isCurrentMonth } = dayObj;
          const isPast = isDatePast(date);
          const day = date.getDate();
          const hasEvent = hasEvents(date);
          const isToday = formatDate(date) === formatDate(new Date());
          const isDateSelected = isSelected(date);

          // Determine day styling based on state
          let dayClasses = 'py-xxs flex flex-col items-center justify-center relative';

          // Base styling for the day with dark theme colors
          if (!isCurrentMonth) {
            dayClasses += ' text-white text-opacity-30';
          } else if (isPast) {
            dayClasses += ' text-white text-opacity-50';
          } else {
            dayClasses += ' text-white';
          }

          // Selected day styling
          if (isDateSelected) {
            dayClasses += ' bg-sunset-orange text-white rounded-full';
          }
          // Today styling (if not selected)
          else if (isToday) {
            dayClasses += ' border border-sunset-orange rounded-full';
          }

          return (
            <button
              key={index}
              className={dayClasses}
              onClick={() => onDateSelect(date)}
              disabled={!allowPastSelection && isPast && !isToday}
              aria-label={`${date.toLocaleDateString()}${
                hasEvent ? ` - ${getEventCount(date)} events` : ''
              }`}
              aria-selected={isDateSelected}
            >
              <Typography
                variant="body2"
                color={isDateSelected ? 'white' : undefined}
                className="text-center w-full"
              >
                {day}
              </Typography>

              {/* Event count or indicator */}
              {hasEvent && !isDateSelected && (
                <>
                  {getEventCount(date) > 0 ? (
                    <div className="absolute -bottom-1 flex items-center justify-center">
                      <div className="bg-sunset-orange text-white text-[10px] px-1 rounded-full min-w-[14px] text-center">
                        {getEventCount(date)}
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-magenta-pink" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  highlightedDates: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  ),
  eventCounts: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
  allowPastSelection: PropTypes.bool,
  onMonthChange: PropTypes.func,
  className: PropTypes.string,
};

export default Calendar;
