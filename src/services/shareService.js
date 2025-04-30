/**
 * Share Service for EncoreLando
 *
 * This service provides functionality for sharing content to social media
 * and creating calendar events with deep links back to the app.
 *
 * Mobile-first considerations:
 * - Uses native sharing APIs when available
 * - Fallbacks for older browsers
 * - Optimized sharing content for mobile devices
 * - Efficient calendar links for mobile calendar apps
 */

// Generate deep link URL for app content
const generateDeepLink = path => {
  // Base URL of the application
  const baseUrl = window.location.origin;
  return `${baseUrl}${path}`;
};

// Share content to social media using Web Share API when available
export const shareContent = async ({ title, text, url }) => {
  // Generate deep link if URL is a relative path
  const shareUrl = url.startsWith('/') ? generateDeepLink(url) : url;

  try {
    // Check if Web Share API is available (most mobile browsers support this)
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
      return { success: true };
    } else {
      // Fallback for browsers without Web Share API
      // Open a new window with the appropriate share URL
      return openShareWindow(title, text, shareUrl);
    }
  } catch (error) {
    console.error('Error sharing content:', error);
    return { error: error.message };
  }
};

// Share to specific platforms (fallback method)
const openShareWindow = (title, text, url) => {
  // Encode sharing information
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  // Create a temporary element to hold the share buttons
  const shareModal = document.createElement('div');
  shareModal.style.position = 'fixed';
  shareModal.style.top = '0';
  shareModal.style.left = '0';
  shareModal.style.width = '100%';
  shareModal.style.height = '100%';
  shareModal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  shareModal.style.zIndex = '9999';
  shareModal.style.display = 'flex';
  shareModal.style.flexDirection = 'column';
  shareModal.style.alignItems = 'center';
  shareModal.style.justifyContent = 'center';

  // Create content container
  const container = document.createElement('div');
  container.style.backgroundColor = 'white';
  container.style.borderRadius = '12px';
  container.style.width = '90%';
  container.style.maxWidth = '400px';
  container.style.padding = '20px';

  // Create header
  const header = document.createElement('h3');
  header.textContent = 'Share to:';
  header.style.marginTop = '0';
  header.style.textAlign = 'center';

  // Create share options
  const shareOptions = document.createElement('div');
  shareOptions.style.display = 'flex';
  shareOptions.style.flexWrap = 'wrap';
  shareOptions.style.justifyContent = 'center';
  shareOptions.style.gap = '15px';
  shareOptions.style.marginTop = '15px';

  // Social platforms and their share URLs
  const platforms = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#3b5998',
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: '#1da1f2',
    },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25d366',
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
      color: '#c71610',
    },
    {
      name: 'Copy Link',
      action: () => {
        // Copy to clipboard
        navigator.clipboard
          .writeText(url)
          .then(() => {
            alert('Link copied to clipboard!');
            document.body.removeChild(shareModal);
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      },
      color: '#333333',
    },
  ];

  // Create platform buttons
  platforms.forEach(platform => {
    const button = document.createElement('button');
    button.textContent = platform.name;
    button.style.minWidth = '120px';
    button.style.padding = '12px';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.backgroundColor = platform.color;
    button.style.color = 'white';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';

    // Add touch-friendly styles for mobile
    button.style.touchAction = 'manipulation';
    button.style.minHeight = '44px'; // Minimum touch target size

    button.addEventListener('click', e => {
      e.preventDefault();
      if (platform.action) {
        platform.action();
      } else {
        window.open(platform.url, '_blank', 'width=600,height=400');
        document.body.removeChild(shareModal);
      }
    });

    shareOptions.appendChild(button);
  });

  // Add cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.marginTop = '20px';
  cancelButton.style.padding = '12px 20px';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '6px';
  cancelButton.style.backgroundColor = '#eaeaea';
  cancelButton.style.color = '#333';
  cancelButton.style.minHeight = '44px'; // Minimum touch target size
  cancelButton.style.fontWeight = 'bold';
  cancelButton.style.width = '100%';
  cancelButton.style.cursor = 'pointer';

  cancelButton.addEventListener('click', () => {
    document.body.removeChild(shareModal);
  });

  // Assemble the modal
  container.appendChild(header);
  container.appendChild(shareOptions);
  container.appendChild(cancelButton);
  shareModal.appendChild(container);

  // Add modal to the document
  document.body.appendChild(shareModal);

  // Close modal when clicking outside the container
  shareModal.addEventListener('click', e => {
    if (e.target === shareModal) {
      document.body.removeChild(shareModal);
    }
  });

  return { success: true };
};

/**
 * Generate Add to Calendar links with deeplinks back to the app
 *
 * Supports:
 * - Google Calendar
 * - Outlook
 * - Apple Calendar (ics download)
 * - Yahoo Calendar
 */
export const generateCalendarLinks = event => {
  const { title, description, startTime, endTime, location, url } = event;

  // Format dates for calendar URLs
  const formatDate = (date, format) => {
    const d = new Date(date);

    if (format === 'google') {
      // Google Calendar format: YYYYMMDDTHHMMSSZ
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    } else if (format === 'ics') {
      // iCalendar format: YYYYMMDDTHHMMSSZ
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    } else if (format === 'yahoo') {
      // Yahoo Calendar format: YYYYMMDDTHHMMSSZ
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    } else {
      // Default ISO format
      return d.toISOString();
    }
  };

  // Add deep link back to the app in the description
  const deepLink = url.startsWith('/') ? generateDeepLink(url) : url;
  const fullDescription = `${description || ''}\n\nView in EncoreLando: ${deepLink}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedLocation = encodeURIComponent(location || '');
  const encodedDescription = encodeURIComponent(fullDescription);

  // Generate Google Calendar link
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${formatDate(
    startTime,
    'google'
  )}/${formatDate(
    endTime,
    'google'
  )}&details=${encodedDescription}&location=${encodedLocation}&sprop=website:${encodeURIComponent(
    deepLink
  )}`;

  // Generate Outlook.com link
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&startdt=${formatDate(
    startTime
  )}&enddt=${formatDate(endTime)}&body=${encodedDescription}&location=${encodedLocation}`;

  // Generate Yahoo Calendar link
  const yahooUrl = `https://calendar.yahoo.com/?title=${encodedTitle}&st=${formatDate(
    startTime,
    'yahoo'
  )}&et=${formatDate(endTime, 'yahoo')}&desc=${encodedDescription}&in_loc=${encodedLocation}`;

  // Generate Apple Calendar ICS data
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startTime, 'ics')}`,
    `DTEND:${formatDate(endTime, 'ics')}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${fullDescription.replace(/\n/g, '\\n')}`,
    `LOCATION:${location || ''}`,
    `URL:${deepLink}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  // Create download link for ICS file
  const icsFile = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const icsUrl = URL.createObjectURL(icsFile);

  return {
    google: googleUrl,
    outlook: outlookUrl,
    yahoo: yahooUrl,
    ics: icsUrl,
    download: (filename = 'event.ics') => {
      const link = document.createElement('a');
      link.href = icsUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  };
};
