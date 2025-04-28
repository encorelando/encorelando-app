import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BrandLogo from '../atoms/BrandLogo';

/**
 * SplashScreen component showcasing the updated EncoreLando branding
 * Follows the dark background by default principle with gradient elements
 */
const SplashScreen = ({ onComplete, duration = 2500, showProgressBar = true, className = '' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(newProgress);

      if (elapsed >= duration && onComplete) {
        clearInterval(interval);
        onComplete();
      }
    }, 16); // ~60fps update

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div
      className={`bg-background min-h-screen flex flex-col items-center justify-center p-md ${className}`}
    >
      {/* Animate the logo fading in */}
      <div className="animate-[fadeIn_1s_ease-in-out]">
        {/* Use gradient logo on the splash screen for maximum impact */}
        <BrandLogo variant="gradient" size="xl" className="mb-lg" />

        {/* Typography split brand name */}
        <div className="typography-split text-white text-2xl text-center mb-xl">
          <span className="enc font-poppins">enc</span>
          <span className="or font-manrope">or</span>
          <span className="e font-poppins">e</span>
          <span className="lando font-manrope">lando</span>
        </div>
      </div>

      {/* Tag line */}
      <p className="text-white text-opacity-80 font-manrope text-center mb-xl">
        Discover live music at Orlando theme parks
      </p>

      {/* Progress bar with gradient */}
      {showProgressBar && (
        <div className="relative w-48 h-1 bg-white bg-opacity-10 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-brand-gradient rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

SplashScreen.propTypes = {
  onComplete: PropTypes.func,
  duration: PropTypes.number,
  showProgressBar: PropTypes.bool,
  className: PropTypes.string,
};

export default SplashScreen;
