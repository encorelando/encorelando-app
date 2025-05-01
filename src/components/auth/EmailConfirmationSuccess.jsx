import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandButton from '../atoms/BrandButton';

/**
 * EmailConfirmationSuccess Component
 *
 * Displays a success message when a user has successfully confirmed their email.
 * Automatically appears and disappears with a smooth animation.
 *
 * Mobile-first features:
 * - Bottom-positioned for thumb accessibility
 * - Large touch target for the login button
 * - Auto-dismisses after a delay
 * - Non-intrusive design
 */
const EmailConfirmationSuccess = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-green-600 text-white rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          {/* Success icon */}
          <div className="flex-shrink-0 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Email Confirmed!</h3>
            <p className="mb-3">
              Your email has been successfully verified. You can now log in to your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <BrandButton onClick={handleLogin} variant="light" size="sm" className="flex-1">
                Log In Now
              </BrandButton>

              <button onClick={handleDismiss} className="text-white text-sm underline py-2">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationSuccess;
