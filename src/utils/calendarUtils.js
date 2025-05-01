/**
 * Calendar utilities for EncoreLando
 *
 * Functions for generating calendar events from various entity types.
 * Optimized for mobile devices and calendar applications.
 */

/**
 * Parse a time string and extract hours and minutes values
 * This handles times stored in the database without timezone conversion issues
 *
 * @param {string} timeString - Time string from database (e.g. "2025-05-01T17:30:00")
 * @returns {Object} - Object containing hours and minutes
 */
const extractTimeComponents = timeString => {
  // Extract hours and minutes directly from the string
  // Format is typically "YYYY-MM-DDTHH:MM:SS" or similar
  const timePart = timeString.split('T')[1]; // Get the time part after 'T'
  if (!timePart) return { hours: 0, minutes: 0 };

  const timeComponents = timePart.split(':');
  const hours = parseInt(timeComponents[0], 10);
  const minutes = parseInt(timeComponents[1], 10);

  return { hours, minutes };
};

/**
 * Generate a calendar event object from a concert
 *
 * @param {Object} concert - The concert data
 * @param {string} url - The URL to link back to in the calendar event
 * @returns {Object} - Calendar event object ready for use with calendar components
 */
export const generateEventFromConcert = (concert, url) => {
  if (!concert || !concert.start_time) {
    return null;
  }

  // Get artist and venue data
  const artist = concert.artist || concert.artists;
  const venue = concert.venue || concert.venues;

  if (!artist || !venue) {
    return null;
  }

  // Extract date components directly from the time strings
  // This avoids timezone conversion issues
  const startTimeComponents = extractTimeComponents(concert.start_time);
  let endTimeComponents;

  if (concert.end_time) {
    endTimeComponents = extractTimeComponents(concert.end_time);
  } else {
    // If no end time is provided, default to 1 hour after start time
    endTimeComponents = {
      hours: (startTimeComponents.hours + 1) % 24,
      minutes: startTimeComponents.minutes,
    };
  }

  // Create Date objects for other needed information (year, month, day)
  const startDate = new Date(concert.start_time);
  const endDate = concert.end_time ? new Date(concert.end_time) : new Date(concert.start_time);

  // Build description
  let description = '';

  if (artist.name) {
    description += `Artist: ${artist.name}\n`;
  }

  if (venue.name) {
    description += `Venue: ${venue.name}\n`;
  }

  if (venue.location_details) {
    description += `Location: ${venue.location_details}\n`;
  }

  if (concert.notes) {
    description += `\n${concert.notes}\n\n`;
  }

  // Include deep link back to app
  description += `View in encorelando: ${url}`;

  // Build location string
  let location = venue.name || '';
  if (venue.location_details) {
    location += `, ${venue.location_details}`;
  }

  // If venue has a park, add that too
  if (venue.park && venue.park.name) {
    location += `, ${venue.park.name}`;
  }

  return {
    title: `${artist.name} at ${venue.name}`,
    description,
    // We still need ISO strings for some purposes
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    location,
    url,
    // Include date components for proper calendar formatting
    startYear: startDate.getFullYear(),
    startMonth: startDate.getMonth() + 1, // 0-based to 1-based
    startDay: startDate.getDate(),
    endYear: endDate.getFullYear(),
    endMonth: endDate.getMonth() + 1, // 0-based to 1-based
    endDay: endDate.getDate(),
    // Store ACTUAL hours and minutes from original time strings, not from Date objects
    startHours: startTimeComponents.hours,
    startMinutes: startTimeComponents.minutes,
    endHours: endTimeComponents.hours,
    endMinutes: endTimeComponents.minutes,
  };
};

/**
 * Generate a calendar event object from a festival
 *
 * @param {Object} festival - The festival data
 * @param {string} url - The URL to link back to in the calendar event
 * @returns {Object} - Calendar event object ready for use with calendar components
 */
export const generateEventFromFestival = (festival, url) => {
  if (!festival || !festival.start_date || !festival.end_date) {
    return null;
  }

  // Set start and end times
  // For festivals, we use the full day format (start at beginning of day, end at end of day)
  const startDate = new Date(festival.start_date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(festival.end_date);
  endDate.setHours(23, 59, 59, 999);

  // Build description
  let description = '';

  if (festival.description) {
    description += `${festival.description}\n\n`;
  }

  if (festival.park && festival.park.name) {
    description += `Location: ${festival.park.name}\n`;
  }

  if (festival.website_url) {
    description += `Website: ${festival.website_url}\n\n`;
  }

  // Include deep link back to app
  description += `View in encorelando: ${url}`;

  // Build location string
  let location = '';
  if (festival.park && festival.park.name) {
    location = festival.park.name;
  }

  return {
    title: festival.name,
    description,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    location,
    url,
    // Include date components for calendar formatting
    startYear: startDate.getFullYear(),
    startMonth: startDate.getMonth() + 1, // 0-based to 1-based
    startDay: startDate.getDate(),
    endYear: endDate.getFullYear(),
    endMonth: endDate.getMonth() + 1, // 0-based to 1-based
    endDay: endDate.getDate(),
    // For all-day events
    startHours: 0,
    startMinutes: 0,
    endHours: 23,
    endMinutes: 59,
    allDay: true,
  };
};
