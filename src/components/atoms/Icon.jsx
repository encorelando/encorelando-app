import PropTypes from 'prop-types';

// Import icons from react-icons
import {
  FiHome,
  FiCalendar,
  FiMusic,
  FiMapPin,
  FiSearch,
  FiClock,
  FiInfo,
  FiChevronRight,
  FiChevronLeft,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiPlus,
  FiMinus,
  FiStar,
  FiHeart,
  FiFilter,
  FiUser,
  FiSettings,
  FiArrowLeft,
  FiList,
  FiGrid,
  FiAlertCircle,
  FiCheckCircle,
  FiImage,
  FiMap,
  FiCompass,
  FiNavigation,
  FiAlertTriangle,
  FiMenu,
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiSave,
  FiLogIn,
  FiDownload,
  FiShare,
  FiUserPlus,
} from 'react-icons/fi';

/**
 * Icon component that provides consistent iconography across the app
 * Mobile-optimized with appropriate sizes
 */
const Icon = ({ name, size = 'md', color = 'currentColor', className = '' }) => {
  // Map of icon names to components
  const icons = {
    home: FiHome,
    calendar: FiCalendar,
    music: FiMusic,
    'map-pin': FiMapPin,
    search: FiSearch,
    clock: FiClock,
    info: FiInfo,
    'chevron-right': FiChevronRight,
    'chevron-left': FiChevronLeft,
    'chevron-down': FiChevronDown,
    'chevron-up': FiChevronUp,
    x: FiX,
    plus: FiPlus,
    minus: FiMinus,
    star: FiStar,
    heart: FiHeart,
    filter: FiFilter,
    user: FiUser,
    settings: FiSettings,
    'arrow-left': FiArrowLeft,
    list: FiList,
    grid: FiGrid,
    alert: FiAlertCircle,
    check: FiCheckCircle,
    image: FiImage,
    map: FiMap,
    'map-off': FiMap,
    compass: FiCompass,
    navigation: FiNavigation,
    'alert-triangle': FiAlertTriangle,
    menu: FiMenu,
    logout: FiLogOut,
    edit: FiEdit,
    trash: FiTrash2,
    save: FiSave,
    'log-in': FiLogIn,
    download: FiDownload,
    share: FiShare,
    'user-plus': FiUserPlus,
    'log-out': FiLogOut,
  };

  // Icon sizes in pixels - ensuring visibility on mobile
  const sizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  };

  // Get the icon component
  const IconComponent = icons[name];

  // If icon doesn't exist, show warning in development
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent size={sizes[size]} color={color} className={className} aria-hidden="true" />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Icon;
