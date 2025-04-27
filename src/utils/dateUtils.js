/**
 * Date utility functions for formatting dates and times
 * Optimized for mobile display with concise formatting
 */

/**
 * Format a date string or Date object to display format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string (e.g., "Mon, Apr 15")
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format: "Mon, Apr 15"
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date string or Date object to display time format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted time string (e.g., "7:30 PM")
 */
export const formatTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format: "7:30 PM"
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format a date range for display
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} - Formatted date range (e.g., "Apr 15 - Apr 20")
 */
export const formatDateRange = (startDate, endDate) => {
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  // Format: "Apr 15 - Apr 20"
  const startFormatted = startObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const endFormatted = endObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Get relative time description (today, tomorrow, days of week, or date)
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative date description
 */
export const getRelativeDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Set to midnight for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const compareDate = new Date(dateObj);
  compareDate.setHours(0, 0, 0, 0);
  
  // Check if date is today or tomorrow
  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (compareDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  
  // If date is within the next 6 days (this week), return day of week
  const dayDiff = Math.floor((compareDate - today) / (1000 * 60 * 60 * 24));
  if (dayDiff > 0 && dayDiff < 7) {
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  // Otherwise, return formatted date
  return formatDate(dateObj);
};

/**
 * Group performances by date
 * @param {Array} performances - Array of performance objects
 * @returns {Object} - Object with dates as keys and arrays of performances as values
 */
export const groupPerformancesByDate = (performances) => {
  return performances.reduce((groups, performance) => {
    const date = new Date(performance.startTime);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    
    groups[dateStr].push(performance);
    return groups;
  }, {});
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export const isDatePast = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return dateObj < now;
};

/**
 * Format date to YYYY-MM-DD for API requests
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
export const formatDateForApi = (date) => {
  return date.toISOString().split('T')[0];
};