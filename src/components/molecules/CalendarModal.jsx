import { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';
import {
  generateGoogleCalendarUrl,
  generateAppleCalendarUrl,
  generateOutlookCalendarUrl,
  downloadICalendarFile,
} from '../../utils/calendarUtils';

/**
 * Calendar selection modal for adding events to different calendar apps
 * Mobile-optimized with large touch targets and simple UI
 */
const CalendarModal = ({ event, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle opening calendar service
  const handleCalendarOpen = calendarType => {
    if (!event) {
      console.error('No event data provided to CalendarModal');
      return;
    }

    setIsProcessing(true);

    try {
      let url = '';

      switch (calendarType) {
        case 'google':
          url = generateGoogleCalendarUrl(event);
          window.open(url, '_blank');
          break;

        case 'apple':
          url = generateAppleCalendarUrl(event);
          window.location.href = url;
          break;

        case 'outlook':
          url = generateOutlookCalendarUrl(event);
          window.open(url, '_blank');
          break;

        case 'ical':
          downloadICalendarFile(event);
          break;

        default:
          console.error('Unknown calendar type:', calendarType);
      }
    } catch (error) {
      console.error('Error adding to calendar:', error);
    } finally {
      setIsProcessing(false);
      // Close the modal after a short delay to allow the action to complete
      setTimeout(onClose, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black bg-opacity-75">
      <Card className="w-full max-w-sm p-lg relative overflow-hidden">
        {/* Close button */}
        <button className="absolute top-xs right-xs p-xs" onClick={onClose} aria-label="Close">
          <Icon name="x" size="md" />
        </button>

        {/* Header */}
        <Typography variant="h3" className="mb-md text-center">
          Add to Calendar
        </Typography>

        {/* Calendar options */}
        <div className="space-y-md">
          {/* Google Calendar */}
          <button
            className="w-full text-left flex items-center p-md rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sunset-orange transition-colors"
            onClick={() => handleCalendarOpen('google')}
            disabled={isProcessing}
          >
            <div className="w-8 h-8 mr-md flex items-center justify-center bg-white rounded-full shadow-sm">
              <Icon name="calendar" size="md" color="#4285F4" />
            </div>
            <Typography variant="body1">Google Calendar</Typography>
          </button>

          {/* Apple Calendar */}
          <button
            className="w-full text-left flex items-center p-md rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sunset-orange transition-colors"
            onClick={() => handleCalendarOpen('apple')}
            disabled={isProcessing}
          >
            <div className="w-8 h-8 mr-md flex items-center justify-center bg-white rounded-full shadow-sm">
              <Icon name="calendar" size="md" color="#000000" />
            </div>
            <Typography variant="body1">Apple Calendar</Typography>
          </button>

          {/* Outlook Calendar */}
          <button
            className="w-full text-left flex items-center p-md rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sunset-orange transition-colors"
            onClick={() => handleCalendarOpen('outlook')}
            disabled={isProcessing}
          >
            <div className="w-8 h-8 mr-md flex items-center justify-center bg-white rounded-full shadow-sm">
              <Icon name="calendar" size="md" color="#0078D4" />
            </div>
            <Typography variant="body1">Outlook Calendar</Typography>
          </button>

          {/* iCalendar Download */}
          <button
            className="w-full text-left flex items-center p-md rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sunset-orange transition-colors"
            onClick={() => handleCalendarOpen('ical')}
            disabled={isProcessing}
          >
            <div className="w-8 h-8 mr-md flex items-center justify-center bg-white rounded-full shadow-sm">
              <Icon name="download" size="md" color="#888888" />
            </div>
            <Typography variant="body1">Download .ics File</Typography>
          </button>
        </div>

        {/* Cancel button */}
        <Button
          variant="ghost"
          fullWidth
          className="mt-lg"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </Card>
    </div>
  );
};

CalendarModal.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    description: PropTypes.string,
    location: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CalendarModal;
