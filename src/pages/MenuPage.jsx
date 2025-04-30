import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/molecules/HamburgerMenu';

/**
 * MenuPage Component
 *
 * A dedicated page for the hamburger menu.
 * This page opens the hamburger menu automatically when loaded
 * and navigates appropriately based on user selections.
 *
 * Mobile-first design features:
 * - Optimized for touch interactions
 * - Automatic opening of menu
 * - Clean navigation experience
 */
const MenuPage = () => {
  const navigate = useNavigate();

  // When menu is closed (without selection), go back to previous page
  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Add escape key support
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* 
        The HamburgerMenu component handles navigation through its internal Link components.
        When a link is clicked, it will close the menu and the Link component will handle
        the navigation to the selected page.
      */}
      <HamburgerMenu isOpen={true} onClose={handleClose} />
    </div>
  );
};

export default MenuPage;
