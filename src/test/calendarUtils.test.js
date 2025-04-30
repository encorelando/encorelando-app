/**
 * Tests for the calendar utility functions
 * Focuses on timezone handling to ensure Eastern Time is properly preserved
 */

import {
  generateGoogleCalendarUrl,
  generateAppleCalendarUrl,
  generateOutlookCalendarUrl,
  generateICalendarContent,
  generateEventFromConcert
} from '../utils/calendarUtils';

/**
 * Sample concert data for testing
 */
const sampleConcert = {
  id: 'concert-123',
  start_time: '2023-12-15T19:30:00',
  end_time: '2023-12-15T21:00:00',
  artist: {
    id: 'artist-456',
    name: 'The Test Band',
    genres: ['Rock', 'Pop']
  },
  venue: {
    id: 'venue-789',
    name: 'Magic Kingdom Stage',
    location_details: 'Near Main Street',
    park: {
      name: 'Magic Kingdom'
    }
  },
  notes: 'Special holiday performance with guest stars.'
};

describe('Calendar Utils - Timezone Handling', () => {
  test('Event generated from concert includes timezone info in description', () => {
    const concertUrl = 'https://encorelando.com/concerts/concert-123';
    const event = generateEventFromConcert(sampleConcert, concertUrl);
    
    // Description should mention Eastern Time
    expect(event.description).toContain('Eastern Time');
    
    // Basic event details should be present
    expect(event.title).toBe('The Test Band at Magic Kingdom Stage');
    expect(event.startTime).toBe(sampleConcert.start_time);
    expect(event.endTime).toBe(sampleConcert.end_time);
  });
  
  test('Google Calendar URL includes timezone parameter', () => {
    const concertUrl = 'https://encorelando.com/concerts/concert-123';
    const event = generateEventFromConcert(sampleConcert, concertUrl);
    const url = generateGoogleCalendarUrl(event);
    
    // URL should include timezone parameter for Eastern Time
    expect(url).toContain('ctz=America/New_York');
    
    // Basic event parameters should be present
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain(encodeURIComponent(event.title));
  });
  
  test('iCalendar content includes timezone definition', () => {
    const concertUrl = 'https://encorelando.com/concerts/concert-123';
    const event = generateEventFromConcert(sampleConcert, concertUrl);
    const icalContent = generateICalendarContent(event);
    
    // Check for timezone definition
    expect(icalContent).toContain('BEGIN:VTIMEZONE');
    expect(icalContent).toContain('TZID:America/New_York');
    
    // Check for Z suffix in dates (UTC format)
    expect(icalContent).toContain('Z'); // Indicates UTC time in iCal
    
    // Basic event details should be present
    expect(icalContent).toContain(`SUMMARY:${event.title}`);
  });
  
  test('Outlook Calendar URL includes timezone information', () => {
    const concertUrl = 'https://encorelando.com/concerts/concert-123';
    const event = generateEventFromConcert(sampleConcert, concertUrl);
    const url = generateOutlookCalendarUrl(event);
    
    // URL should include timezone parameter
    expect(url).toContain('ctz=Eastern%20Standard%20Time');
    
    // Description should mention Eastern Time
    expect(url).toContain(encodeURIComponent('Eastern Time'));
    
    // Basic event parameters should be present
    expect(url).toContain('subject=');
    expect(url).toContain('startdt=');
  });
});
