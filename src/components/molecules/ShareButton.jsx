import { useState } from 'react';
import PropTypes from 'prop-types';
import { shareContent } from '../../services/shareService';

/**
 * ShareButton Component
 *
 * A mobile-optimized button that allows users to share content to social media
 * and via other mobile native sharing methods.
 *
 * Mobile-first considerations:
 * - Uses native sharing APIs on mobile when available
 * - Touch-friendly size (minimum 44x44px)
 * - Fallback for browsers without Web Share API
 * - Instant visual feedback
 */
const ShareButton = ({
  title,
  text,
  url,
  size = 'md',
  className = '',
  iconOnly = true,
  label = 'Share',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Handle share action
  const handleShare = async e => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      await shareContent({ title, text, url });
    } catch (error) {
      console.error('Error sharing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <button
      aria-label="Share"
      className={`rounded-full flex items-center justify-center focus:outline-none text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 ${sizeStyles[size]} ${className}`}
      onClick={handleShare}
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
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          {!iconOnly && <span className="ml-2 font-medium">{label}</span>}
        </>
      )}
    </button>
  );
};

ShareButton.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  iconOnly: PropTypes.bool,
  label: PropTypes.string,
};

export default ShareButton;
