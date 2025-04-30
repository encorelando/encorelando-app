import { DateTime } from 'luxon';

/**
 * Calendar utility functions for creating calendar events
 * Mobile-optimized with cross-platform support
 *
 * IMPORTANT: All events are in Eastern Time (ET) regardless of user's local timezone
 */

// Define the timezone identifier for Eastern Time
// eslint-disable-next-line no-unused-vars
const TIMEZONE_ID = 'America/New_York';

/**
 * Escape text for use in iCalendar format
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
const escapeICalText = text => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
};

/**
 * Ensures a date is properly interpreted as Eastern Time
 * @param {string|Date} dateInput - The date from API or user input
 * @returns {Date} - Date object correctly interpreted as Eastern Time
 */
/**
 * Parses a string or Date and forces interpretation as Eastern Time, ignoring any timezone suffix
 * @param {string|Date} dateInput
 * @returns {Date} - JS Date object representing correct local Eastern Time
 */
const parseEasternTime = dateInput => {
  console.log('[parseEasternTime] Raw input:', dateInput);

  if (!dateInput) return new Date();

  if (typeof dateInput === 'string') {
    // Remove timezone suffix (Z or ±HH:mm) if present, to prevent UTC interpretation
    const cleaned = dateInput.replace(/([+-]\d{2}:?\d{2}|Z)$/, '');
    const dt = DateTime.fromISO(cleaned, { zone: 'America/New_York' });

    console.log('[parseEasternTime] Cleaned input:', cleaned);
    console.log('[parseEasternTime] Luxon ET parsed:', dt.toString());

    if (!dt.isValid) {
      console.warn('[parseEasternTime] Invalid format, falling back to native Date');
      return new Date(dateInput);
    }

    return dt.toJSDate();
  }

  return dateInput;
};

/**
 * Format date for iCalendar format with explicit timezone
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string (e.g., "20230415T193000")
 */
const formatICalDate = date => {
  if (!date) return '';

  // Parse the date, ensuring it's treated as Eastern Time
  const dateObj = parseEasternTime(date);

  // Format in UTC for iCalendar (add Z suffix)
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

/**
 * Generate Google Calendar URL with timezone handling
 * @param {Object} event - Event details
 * @returns {string} - Google Calendar URL
 */
export const generateGoogleCalendarUrl = ({
  title,
  startTime,
  endTime,
  description,
  location,
  url,
}) => {
  if (!title || !startTime) {
    console.error('Title and start time are required for Google Calendar events');
    return '';
  }

  // Parse dates with proper Eastern Time handling
  const startDate = parseEasternTime(startTime);

  // If no end time is provided, set it to 1 hour after start time
  let endDate;
  if (endTime) {
    endDate = parseEasternTime(endTime);
  } else {
    endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
  }

  // Format dates for Google Calendar with UTC designation (Z)
  const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');

  // Create the URL parameters
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDateStr}/${endDateStr}`,
    ctz: 'America/New_York', // Explicitly set Eastern timezone
  });

  // Add optional parameters if provided
  if (description) {
    // Include the URL in the description if provided
    const fullDescription = url ? `${description}\n\nView event details: ${url}` : description;
    params.append('details', fullDescription);
  } else if (url) {
    params.append('details', `View event details: ${url}`);
  }

  if (location) {
    params.append('location', location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate iCalendar (.ics) file content with timezone support
 * @param {Object} event - Event details
 * @returns {string} - iCalendar file content
 */
export const generateICalendarContent = ({
  title,
  startTime,
  endTime,
  description,
  location,
  url,
}) => {
  if (!title || !startTime) {
    console.error('Title and start time are required for iCalendar events');
    return '';
  }

  // Parse dates with proper Eastern Time handling
  const startDate = parseEasternTime(startTime);

  // If no end time is provided, set it to 1 hour after start time
  let endDate;
  if (endTime) {
    endDate = parseEasternTime(endTime);
  } else {
    endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
  }

  // Create a unique identifier for the event
  const uid = `event-${Date.now()}@encorelando.com`;
  const now = formatICalDate(new Date());

  // Format the event details
  const eventTitle = escapeICalText(title);
  const eventLocation = location ? escapeICalText(location) : '';

  // Include the URL in the description if provided
  let eventDescription = description ? escapeICalText(description) : '';
  if (url) {
    eventDescription +=
      (eventDescription ? '\\n\\n' : '') + escapeICalText(`View event details: ${url}`);
  }

  // Add Eastern Time Zone information
  const vtimezone = [
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:STANDARD',
    'DTSTART:20071104T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:20070311T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
  ].join('\r\n');

  // Build the iCalendar content
  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EncoreLando//Concert Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    vtimezone,
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `SUMMARY:${eventTitle}`,
  ].join('\r\n');

  // Add optional fields
  if (eventLocation) {
    icalContent += `\r\nLOCATION:${eventLocation}`;
  }

  if (eventDescription) {
    icalContent += `\r\nDESCRIPTION:${eventDescription}`;
  }

  if (url) {
    icalContent += `\r\nURL:${url}`;
  }

  // Close the event and calendar
  icalContent += '\r\nEND:VEVENT\r\nEND:VCALENDAR';

  return icalContent;
};

/**
 * Generate Apple Calendar URL (uses iCalendar format)
 * @param {Object} event - Event details
 * @returns {string} - iCalendar Data URL
 */
export const generateAppleCalendarUrl = event => {
  const icalContent = generateICalendarContent(event);
  if (!icalContent) return '';

  // Convert the iCalendar content to a data URL
  const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icalContent)}`;
  return dataUrl;
};

/**
 * Generate Outlook.com calendar URL with timezone handling
 * @param {Object} event - Event details
 * @returns {string} - Outlook.com calendar URL
 */
export const generateOutlookCalendarUrl = ({
  title,
  startTime,
  endTime,
  description,
  location,
  url,
}) => {
  if (!title || !startTime) {
    console.error('Title and start time are required for Outlook Calendar events');
    return '';
  }

  // Parse dates with proper Eastern Time handling
  const startDate = parseEasternTime(startTime);

  // If no end time is provided, set it to 1 hour after start time
  let endDate;
  if (endTime) {
    endDate = parseEasternTime(endTime);
  } else {
    endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
  }

  // Format dates for Outlook (UTC format)
  const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');

  // Create the URL parameters
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: startDateStr,
    enddt: endDateStr,
  });

  // Add timezone parameter (Outlook supports this)
  params.append('ctz', 'Eastern Standard Time');

  // Add optional parameters if provided
  if (description) {
    // Include the URL and timezone in the description if provided
    const fullDescription = url
      ? `${description}\n\nView event details: ${url}\n\nThis event time is in Eastern Time (ET).`
      : `${description}\n\nThis event time is in Eastern Time (ET).`;
    params.append('body', fullDescription);
  } else if (url) {
    params.append('body', `View event details: ${url}\n\nThis event time is in Eastern Time (ET).`);
  } else {
    params.append('body', 'This event time is in Eastern Time (ET).');
  }

  if (location) {
    params.append('location', location);
  }

  return `https://outlook.live.com/calendar/0/${params.toString()}`;
};

/**
 * Download iCalendar file
 * @param {Object} event - Event details
 */
export const downloadICalendarFile = event => {
  const icalContent = generateICalendarContent(event);
  if (!icalContent) return;

  // Create a blob and link to download the file
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.replace(/[^\w\s]/gi, '')}.ics`);
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate event details from concert data with proper Eastern Time handling
 * @param {Object} concert - Concert data
 * @param {string} concertUrl - URL to the concert details page
 * @returns {Object} - Event details for calendar functions
 */
export const generateEventFromConcert = (concert, concertUrl) => {
  if (!concert) return null;

  // Extract artist and venue data safely
  const artistData = concert.artist || concert.artists || {};
  const venueData = concert.venue || concert.venues || {};
  const parkData = venueData.park || {};

  // Determine location string
  let location = venueData.name || '';
  if (venueData.location_details) {
    location += location ? `, ${venueData.location_details}` : venueData.location_details;
  }
  if (parkData.name) {
    location += location ? `, ${parkData.name}` : parkData.name;
  }

  // Build description with timezone information
  let description = `${artistData.name} performing at ${venueData.name}\n\nNOTE: Event time is in Eastern Time (ET).`;

  if (concert.notes) {
    description += `\n\nPerformance Notes:\n${concert.notes}`;
  }

  if (artistData.genres && artistData.genres.length > 0) {
    description += `\n\nGenres: ${artistData.genres.join(', ')}`;
  }

  // Create the event object
  return {
    title: `${artistData.name} at ${venueData.name}`,
    startTime: concert.start_time,
    endTime: concert.end_time,
    description,
    location,
    url: concertUrl,
  };
};
