/**
 * Calendar utilities for EncoreLando
 *
 * Functions for generating calendar events from various entity types.
 * Optimized for mobile devices and calendar applications.
 */

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

  // Set end time (default to 2 hours after start if not specified)
  const startTime = new Date(concert.start_time);
  let endTime;

  if (concert.end_time) {
    endTime = new Date(concert.end_time);
  } else {
    // If no end time is provided, default to 2 hours after start time
    endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
  }

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
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    location,
    url,
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
    allDay: true,
  };
};
