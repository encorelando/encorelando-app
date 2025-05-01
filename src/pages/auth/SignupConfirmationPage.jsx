import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import BrandHeading from '../../components/atoms/BrandHeading';
import BrandLogo from '../../components/atoms/BrandLogo';
import BrandCard from '../../components/atoms/BrandCard';
import BrandButton from '../../components/atoms/BrandButton';

/**
 * SignupConfirmationPage Component
 *
 * Provides a user-friendly message after signup when email confirmation is required.
 * Follows mobile-first design principles with clear messaging.
 *
 * Mobile-first design features:
 * - Clean, focused layout with clear instructions
 * - Large touch targets for navigation
 * - Visual hierarchy emphasizing next steps
 * - Simple interface with minimal distractions
 */
const SignupConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  // If no email was provided, redirect to signup
  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-white border-opacity-10 p-md">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-md h-11 w-11 flex items-center justify-center rounded-full text-white hover:bg-white hover:bg-opacity-10"
            aria-label="Go to home page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </button>
          <BrandHeading level={3}>Check Your Email</BrandHeading>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-md max-w-md mx-auto w-full">
        <div className="mb-xl text-center">
          <BrandLogo variant="white" size="md" className="mb-md" />

          <BrandHeading level={2} className="mb-xs">
            Please Confirm Your Email
          </BrandHeading>
        </div>

        <BrandCard className="mb-lg">
          <div className="flex flex-col gap-md items-center text-center p-md">
            <div className="w-16 h-16 bg-sunset-orange bg-opacity-20 rounded-full flex items-center justify-center mb-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-sunset-orange"
              >
                <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-4.5" />
                <path d="M22 10.5l-8.4 4.5c-.8.5-1.9.5-2.7 0L2 10.5" />
              </svg>
            </div>

            <p className="font-manrope text-lg text-white mb-xs">
              We&apos;ve sent a confirmation email to:
            </p>
            <p className="font-manrope font-bold text-xl text-sunset-orange mb-md">{email}</p>

            <div className="text-white text-opacity-90 mb-lg">
              <p className="mb-md">
                Please check your inbox and click on the confirmation link to complete your
                registration.
              </p>
              <p className="text-sm text-white text-opacity-70">
                If you don&apos;t see the email, check your spam folder or try the login page after
                a few minutes.
              </p>
            </div>

            <div className="flex flex-col gap-sm w-full">
              <BrandButton onClick={() => navigate('/login')} variant="gradient" fullWidth>
                Go to Login
              </BrandButton>

              <Link to="/" className="text-sunset-orange hover:text-magenta-pink text-center py-md">
                Return to Home
              </Link>
            </div>
          </div>
        </BrandCard>
      </div>
    </div>
  );
};

export default SignupConfirmationPage;
