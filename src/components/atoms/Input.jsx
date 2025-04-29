import PropTypes from 'prop-types';

/**
 * Input component for form fields
 * Optimized for mobile with appropriate sizing for touch targets
 */
const Input = ({
  type = 'text',
  id,
  name,
  value,
  placeholder,
  disabled = false,
  required = false,
  error,
  onChange,
  onBlur,
  onFocus,
  className = '',
  fullWidth = true,
  max,
  min,
  maxLength,
  pattern,
  autoComplete,
}) => {
  // Base classes for all inputs with proper mobile touch sizing
  const baseClasses =
    'appearance-none min-h-touch px-md py-xs rounded border focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors';

  // Error classes
  const errorClasses = error ? 'border-error' : 'border-light-gray focus:border-primary';

  // Disabled classes - We'll use bg-white for standard inputs to ensure visibility
  const disabledClasses = disabled ? 'bg-light-gray opacity-50 cursor-not-allowed' : 'bg-white';

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Text color class - explicitly set for admin pages with dark backgrounds
  const textColorClass = className.includes('bg-neutral-700')
    ? 'text-white placeholder-gray-400'
    : 'text-black';

  // Combined classes
  const combinedClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${widthClasses} ${textColorClass} ${className}`;

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      className={combinedClasses}
      max={max}
      min={min}
      maxLength={maxLength}
      pattern={pattern}
      autoComplete={autoComplete}
      aria-invalid={!!error}
    />
  );
};

Input.propTypes = {
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'tel',
    'date',
    'time',
    'url',
    'search',
    'datetime-local',
  ]),
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  autoComplete: PropTypes.string,
};

export default Input;
