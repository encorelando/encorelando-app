import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';
import { formatDate, isDatePast } from '../../utils/dateUtils';

/**
 * Calendar component for date selection
 * Mobile-optimized with touchable date cells
 */
const Calendar = ({
  selectedDate,
  onDateSelect,
  highlightedDates = [],
  className = '',
}) => {
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
      return newDate;
    });
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  // Format month year title
  const monthYearTitle = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  
  // Check if a date has events
  const hasEvents = (date) => {
    return highlightedDates.some(highlightedDate => {
      const highlighted = new Date(highlightedDate);
      return (
        date.getDate() === highlighted.getDate() &&
        date.getMonth() === highlighted.getMonth() &&
        date.getFullYear() === highlighted.getFullYear()
      );
    });
  };
  
  // Check if a date is selected
  const isSelected = (date) => {
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
          onClick={goToPreviousMonth}
        />
        
        <Typography variant="h3">
          {monthYearTitle}
        </Typography>
        
        <IconButton 
          icon="chevron-right" 
          ariaLabel="Next month"
          onClick={goToNextMonth}
        />
      </div>
      
      {/* Day names row */}
      <div className="grid grid-cols-7 mb-sm">
        {weekDays.map(day => (
          <div key={day} className="text-center">
            <Typography variant="caption" color="medium-gray">
              {day}
            </Typography>
          </div>
        ))}
      </div>
      
      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayObj, index) => {
          const { date, isCurrentMonth } = dayObj;
          const isPast = isDatePast(date);
          const day = date.getDate();
          const hasEvent = hasEvents(date);
          const isToday = formatDate(date) === formatDate(new Date());
          const isDateSelected = isSelected(date);
          
          // Determine day styling based on state
          let dayClasses = "aspect-square flex flex-col items-center justify-center relative";
          
          // Base styling for the day
          if (!isCurrentMonth) {
            dayClasses += " text-light-gray";
          } else if (isPast) {
            dayClasses += " text-medium-gray";
          }
          
          // Selected day styling
          if (isDateSelected) {
            dayClasses += " bg-primary text-white rounded-full";
          } 
          // Today styling (if not selected)
          else if (isToday) {
            dayClasses += " border border-primary rounded-full";
          }
          
          return (
            <button
              key={index}
              className={dayClasses}
              onClick={() => onDateSelect(date)}
              disabled={isPast && !isToday}
              aria-label={`${date.toLocaleDateString()}`}
              aria-selected={isDateSelected}
            >
              <Typography 
                variant="body2"
                color={isDateSelected ? 'white' : undefined}
              >
                {day}
              </Typography>
              
              {/* Event indicator dot */}
              {hasEvent && !isDateSelected && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
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
  highlightedDates: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.instanceOf(Date)
  ])),
  className: PropTypes.string,
};

export default Calendar;