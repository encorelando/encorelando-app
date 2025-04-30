/**
 * Date utility functions for formatting dates and times
 * Optimized for mobile display with concise formatting
 */

/**
 * Format a date string or Date object to display format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string (e.g., "Mon, Apr 15")
 */
export const formatDate = date => {
  // Return a placeholder if date is undefined or null
  if (!date) {
    return 'TBD';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Format: "Mon, Apr 15"
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date string or Date object to display time format without timezone adjustments
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted time string (e.g., "7:30 PM")
 */
export const formatTime = date => {
  // Return a placeholder if date is undefined or null
  if (!date) {
    return 'TBD';
  }

  // If the date is provided as a string
  if (typeof date === 'string') {
    // Parse the time portion only from the ISO string to prevent timezone adjustments
    const timeMatch = date.match(/(\d{2}):(\d{2}):(\d{2})/);

    if (timeMatch) {
      const [, hours, minutes] = timeMatch;
      const hourNum = parseInt(hours, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12; // Convert 24h to 12h format

      return `${hour12}:${minutes} ${ampm}`;
    }

    // If no time pattern was found in the string, create a date object
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
  }

  // If it's already a Date object, format it without timezone adjustments
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Format a date range for display
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} - Formatted date range (e.g., "Apr 15 - Apr 20")
 */
export const formatDateRange = (startDate, endDate) => {
  // Handle missing dates
  if (!startDate && !endDate) {
    return 'Dates TBD';
  }

  if (!startDate) {
    return `Ends ${formatDate(endDate)}`;
  }

  if (!endDate) {
    return `Starts ${formatDate(startDate)}`;
  }

  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // Format: "Apr 15 - Apr 20"
  const startFormatted = startObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const endFormatted = endObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Get relative time description (today, tomorrow, days of week, or date)
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative date description
 */
export const getRelativeDate = date => {
  // Return placeholder if date is undefined or null
  if (!date) {
    return 'Date TBD';
  }

  const dateObj =
    typeof date === 'string'
      ? new Date(`${date}T12:00:00`) // ensures local date rendering
      : date;
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
 * Extract valid date string from a date object or string
 * CRITICAL FIX: Always extracts date directly from ISO string to preserve UTC dates
 * @param {Date|string} date - The date to process
 * @returns {string|null} - YYYY-MM-DD format date string or null if invalid
 */
export const getValidDateString = date => {
  if (!date) return null;

  try {
    // If it's a string (most common case from API)
    if (typeof date === 'string') {
      // Direct extraction of date part from ISO string (YYYY-MM-DD)
      // This avoids all timezone issues by not creating a Date object
      const datePart = date.split('T')[0];
      if (datePart && datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return datePart; // Return the date part directly
      }

      // If not in ISO format, create a Date and extract UTC components
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return null;

      // Use UTC components to avoid timezone shifts
      return dateObj.toISOString().split('T')[0];
    }
    // If it's already a Date object
    else if (date instanceof Date) {
      if (isNaN(date.getTime())) return null;

      // Always use UTC/ISO string to avoid timezone issues
      return date.toISOString().split('T')[0];
    }

    return null;
  } catch (e) {
    console.error('Error extracting date:', e);
    return null;
  }
};

/**
 * Group performances by date - uses the ISO date string directly to avoid timezone issues
 * @param {Array} performances - Array of performance objects
 * @returns {Object} - Object with dates as keys and arrays of performances as values
 */
export const groupPerformancesByDate = performances => {
  if (!performances || !Array.isArray(performances) || performances.length === 0) {
    return {};
  }

  return performances.reduce((groups, performance) => {
    if (!performance) return groups;

    // Handle both camelCase and snake_case property names
    const startTime = performance.startTime || performance.start_time;
    if (!startTime) {
      // If no start time is available, skip this performance
      return groups;
    }

    // Extract date part directly from ISO string to avoid timezone conversions
    let dateStr;

    if (typeof startTime === 'string') {
      // Always use the date directly from the ISO string (YYYY-MM-DD)
      dateStr = startTime.split('T')[0];
    } else if (startTime instanceof Date) {
      // For Date objects, use UTC date components to maintain consistency with ISO strings
      dateStr = startTime.toISOString().split('T')[0];
    } else {
      return groups; // Invalid date format
    }

    if (!dateStr) return groups;

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }

    groups[dateStr].push(performance);
    return groups;
  }, {});
};

/**
 * Group performances by date and then by venue for artists
 * Uses ISO date strings to avoid timezone issues
 * @param {Array} performances - Array of performance objects
 * @returns {Object} - Object with dates as keys and arrays of consolidated performances
 */
export const groupArtistPerformancesByDateAndVenue = performances => {
  // Safety check for inputs
  if (!performances || !Array.isArray(performances) || performances.length === 0) {
    return {};
  }

  // Filter out invalid performances
  const validPerformances = performances.filter(
    perf => perf && perf.id && (perf.startTime || perf.start_time)
  );

  if (validPerformances.length === 0) return {};

  // Create date groups manually to avoid timezone issues
  const byDate = {};

  // Group by date directly from the ISO string date part
  validPerformances.forEach(performance => {
    if (!performance) return;

    const startTime = performance.startTime || performance.start_time;
    if (!startTime) return;

    // Get date string directly from ISO string when possible
    let dateStr;

    if (typeof startTime === 'string') {
      // Always use the date directly from the ISO string (YYYY-MM-DD)
      dateStr = startTime.split('T')[0];
    } else if (startTime instanceof Date) {
      // For Date objects, use toISOString() to get the date part
      dateStr = startTime.toISOString().split('T')[0];
    } else {
      return; // Invalid date format
    }

    if (!dateStr) return;

    if (!byDate[dateStr]) {
      byDate[dateStr] = [];
    }

    byDate[dateStr].push(performance);
  });

  const consolidatedByDate = {};

  // Process each date group
  Object.entries(byDate).forEach(([dateStr, datePerformances]) => {
    // Skip invalid dates
    if (!dateStr || dateStr === 'undefined' || !datePerformances.length) return;

    // Group by venue
    const byVenueId = {};

    datePerformances.forEach(perf => {
      if (!perf || !perf.id) return;

      // Get venue ID safely
      const venue = perf.venue || perf.venues || {};
      const venueId = venue.id || 'unknown';

      if (!byVenueId[venueId]) {
        byVenueId[venueId] = [];
      }

      byVenueId[venueId].push(perf);
    });

    // Consolidate performances at each venue
    const consolidated = [];

    Object.values(byVenueId).forEach(venuePerfs => {
      if (!venuePerfs.length) return;

      if (venuePerfs.length === 1) {
        // Single performance, add as-is
        consolidated.push(venuePerfs[0]);
      } else {
        // Multiple performances, consolidate
        try {
          // Sort by start time
          const sortedPerfs = [...venuePerfs].sort((a, b) => {
            const aStart = a.startTime || a.start_time;
            const bStart = b.startTime || b.start_time;
            if (!aStart || !bStart) return 0;
            return new Date(aStart) - new Date(bStart);
          });

          // Create consolidated performance
          const base = sortedPerfs[0];
          if (!base) return;

          // Build time slots array
          const timeSlots = sortedPerfs
            .map(p => {
              if (!p) return null;
              return {
                id: p.id,
                startTime: p.startTime || p.start_time,
                endTime: p.endTime || p.end_time,
              };
            })
            .filter(Boolean);

          if (timeSlots.length) {
            // Use the ID of the earliest performance (base.id) for the consolidated card
            // This ensures the link to the concert detail page will work correctly
            // Previously this used "${base.id}-consolidated" which caused errors as that ID didn't exist
            consolidated.push({
              ...base,
              id: base.id,
              performanceTimes: timeSlots,
            });
          }
        } catch (err) {
          console.error('Error consolidating performances:', err);
          // Fallback: add all performances individually
          venuePerfs.forEach(p => {
            if (p && p.id) consolidated.push(p);
          });
        }
      }
    });

    // Sort by time and add to result
    if (consolidated.length) {
      consolidatedByDate[dateStr] = consolidated.sort((a, b) => {
        const aTime = a.startTime || a.start_time;
        const bTime = b.startTime || b.start_time;
        if (!aTime || !bTime) return 0;
        return new Date(aTime) - new Date(bTime);
      });
    }
  });

  return consolidatedByDate;
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export const isDatePast = date => {
  // If date is undefined or null, consider it as a future date
  if (!date) {
    return false;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return dateObj < now;
};

/**
 * Format date to YYYY-MM-DD for API requests
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
export const formatDateForApi = date => {
  if (!date) {
    console.error('Date is undefined in formatDateForApi');
    // Return today's date as a fallback
    return getTodayDateString();
  }

  // Ensure we're using local date components to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date as a YYYY-MM-DD string in local timezone
 * @returns {string} Today's date string
 */
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
