/**
 * Calendar utility functions for creating calendar events
 * Mobile-optimized with cross-platform support
 */

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
 * Format date for iCalendar format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string (e.g., "20230415T193000")
 */
const formatICalDate = date => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Generate Google Calendar URL
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

  const startDate = typeof startTime === 'string' ? new Date(startTime) : startTime;

  // If no end time is provided, set it to 1 hour after start time
  let endDate;
  if (endTime) {
    endDate = typeof endTime === 'string' ? new Date(endTime) : endTime;
  } else {
    endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
  }

  // Format dates for Google Calendar
  const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');

  // Create the URL parameters
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDateStr}/${endDateStr}`,
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
 * Generate iCalendar (.ics) file content
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

  const startDate = typeof startTime === 'string' ? new Date(startTime) : startTime;

  // If no end time is provided, set it to 1 hour after start time
  let endDate;
  if (endTime) {
    endDate = typeof endTime === 'string' ? new Date(endTime) : endTime;
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

  // Build the iCalendar content
  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EncoreLando//Concert Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
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
 * Generate Outlook.com calendar URL
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

  const startDate = typeof startTime === 'string' ? new Date(startTime) : startTime;

  // If no end time is provided, set it to 1 hour after start time
  let endDate;
  if (endTime) {
    endDate = typeof endTime === 'string' ? new Date(endTime) : endTime;
  } else {
    endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
  }

  // Format dates for Outlook
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

  // Add optional parameters if provided
  if (description) {
    // Include the URL in the description if provided
    const fullDescription = url ? `${description}\n\nView event details: ${url}` : description;
    params.append('body', fullDescription);
  } else if (url) {
    params.append('body', `View event details: ${url}`);
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
 * Generate event details from concert data
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

  // Build description
  let description = `${artistData.name} performing at ${venueData.name}`;
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
