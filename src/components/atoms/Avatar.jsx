import PropTypes from 'prop-types';

/**
 * Avatar Component
 *
 * Mobile-optimized avatar component that displays a user's profile image
 * or a fallback initial/icon.
 */
const Avatar = ({ src, alt, size = 'md', fallback, className = '', onClick }) => {
  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  const baseClasses =
    'rounded-full flex items-center justify-center overflow-hidden bg-gray-200 text-gray-600 font-medium';
  const colorClass = !src ? 'bg-blue-100 text-blue-600' : '';

  const classes = `${baseClasses} ${sizeClasses[size]} ${colorClass} ${className}`;

  return (
    <div className={classes} onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : (
        <span>{fallback || '?'}</span>
      )}

      {/* Hidden fallback that shows if image fails to load */}
      {src && (
        <span
          style={{ display: 'none' }}
          className="w-full h-full flex items-center justify-center"
        >
          {fallback || '?'}
        </span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fallback: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Avatar;
