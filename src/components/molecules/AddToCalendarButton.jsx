import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { generateCalendarLinks } from '../../services/shareService';

/**
 * AddToCalendarButton Component
 *
 * A mobile-optimized button that allows users to add events to their calendar.
 * Supports multiple calendar types and provides appropriate deep links back to the app.
 *
 * Mobile-first considerations:
 * - Touch-friendly button and dropdown options (minimum 44x44px)
 * - Designed for touch interaction
 * - Works well on native mobile calendar apps
 */
const AddToCalendarButton = ({
  event,
  size = 'md',
  className = '',
  iconOnly = false,
  label = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Size variants
  const sizeStyles = {
    sm: iconOnly ? 'h-8 w-8' : 'h-8 px-3',
    md: iconOnly ? 'h-10 w-10' : 'h-10 px-4',
    lg: iconOnly ? 'h-12 w-12' : 'h-12 px-5',
  };

  // Icon sizes
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Close dropdown when clicking outside
  const handleClickOutside = e => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  // Add event listener when dropdown opens
  const toggleDropdown = () => {
    if (!isOpen) {
      // Add event listener when opening
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when closing
      document.removeEventListener('mousedown', handleClickOutside);
    }
    setIsOpen(!isOpen);
  };

  // Use effect to position dropdown when it opens
  useEffect(() => {
    if (isOpen && menuRef.current && dropdownRef.current) {
      const buttonRect = dropdownRef.current.getBoundingClientRect();

      // Set position
      menuRef.current.style.left = `${buttonRect.left}px`;
      menuRef.current.style.top = `${buttonRect.bottom + 8}px`;

      // Check if menu would go off screen to the right
      const menuWidth = menuRef.current.offsetWidth;
      const windowWidth = window.innerWidth;
      if (buttonRect.left + menuWidth > windowWidth) {
        // Adjust to keep menu within viewport
        menuRef.current.style.left = `${windowWidth - menuWidth - 16}px`;
      }
    }
  }, [isOpen]);

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle calendar selection
  const handleAddToCalendar = async calendarType => {
    try {
      setIsLoading(true);

      // Generate calendar links
      const calendarLinks = generateCalendarLinks(event);

      if (calendarType === 'apple' || calendarType === 'outlook' || calendarType === 'other') {
        // Download ICS file for Apple Calendar, Outlook desktop or other
        calendarLinks.download(`${event.title.replace(/\s+/g, '-')}.ics`);
      } else if (calendarType === 'google') {
        // Open Google Calendar in a new tab
        window.open(calendarLinks.google, '_blank');
      } else if (calendarType === 'outlook-web') {
        // Open Outlook.com in a new tab
        window.open(calendarLinks.outlook, '_blank');
      } else if (calendarType === 'yahoo') {
        // Open Yahoo Calendar in a new tab
        window.open(calendarLinks.yahoo, '_blank');
      }

      // Close dropdown after selection
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding to calendar:', error);
    } finally {
      setIsLoading(false);
      // Clean up event listener
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  // Calendar dropdown portal component
  const CalendarDropdown = () => {
    return ReactDOM.createPortal(
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg overflow-hidden w-48"
        style={{
          zIndex: 9999,
          position: 'fixed',
          color: '#333', // Ensure text color is dark
        }}
        ref={menuRef}
      >
        <div className="py-1">
          <button
            className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
            onClick={() => handleAddToCalendar('google')}
            style={{ minHeight: '44px' }}
          >
            <span className="w-6 h-6 flex items-center justify-center mr-3 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M10 7L14 12 10 17" fill="white" />
              </svg>
            </span>
            Google Calendar
          </button>
          <button
            className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
            onClick={() => handleAddToCalendar('apple')}
            style={{ minHeight: '44px' }}
          >
            <span className="w-6 h-6 flex items-center justify-center mr-3 text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M12 4a5 5 0 015 5v10a1 1 0 01-1 1H8a1 1 0 01-1-1V9a5 5 0 015-5z" />
                <path d="M12 4V2M8 10H4M20 10h-4" />
              </svg>
            </span>
            Apple Calendar
          </button>
          <button
            className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
            onClick={() => handleAddToCalendar('outlook-web')}
            style={{ minHeight: '44px' }}
          >
            <span className="w-6 h-6 flex items-center justify-center mr-3 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                <path d="M2 8h20M2 12h20M8 6v12" fill="white" />
              </svg>
            </span>
            Outlook.com
          </button>
          <button
            className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
            onClick={() => handleAddToCalendar('yahoo')}
            style={{ minHeight: '44px' }}
          >
            <span className="w-6 h-6 flex items-center justify-center mr-3 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M7 8l5 4 5-4M7 16l5-4 5 4" fill="white" />
              </svg>
            </span>
            Yahoo Calendar
          </button>
          <button
            className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
            onClick={() => handleAddToCalendar('other')}
            style={{ minHeight: '44px' }}
          >
            <span className="w-6 h-6 flex items-center justify-center mr-3 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </span>
            Other Calendar
          </button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative" style={{ position: 'relative', zIndex: 999 }} ref={dropdownRef}>
      <button
        aria-label="Add to Calendar"
        className={`rounded-full flex items-center justify-center focus:outline-none text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 ${sizeStyles[size]} ${className}`}
        onClick={toggleDropdown}
        disabled={isLoading}
        style={{ minHeight: '44px', minWidth: iconOnly ? '44px' : 'auto' }}
      >
        {isLoading ? (
          <svg
            className={`animate-spin ${iconSizes[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            <svg
              className={iconSizes[size]}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {!iconOnly && <span className="ml-2 font-medium">{label}</span>}
          </>
        )}
      </button>

      {/* Render dropdown through portal when open */}
      {isOpen && <CalendarDropdown />}
    </div>
  );
};

AddToCalendarButton.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    location: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  iconOnly: PropTypes.bool,
  label: PropTypes.string,
};

export default AddToCalendarButton;
