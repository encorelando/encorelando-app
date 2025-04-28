import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import Input from '../atoms/Input';

/**
 * FormField component combining label, input, and error message
 * Mobile-optimized with appropriate spacing and touch targets
 */
const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...inputProps
}) => {
  // Generate unique ID if not provided
  const fieldId = id || `field-${label?.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`mb-md ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={fieldId} className="block mb-xs">
          <Typography variant="body2" color="dark-gray">
            {label}
            {required && <span className="text-error ml-xxs">*</span>}
          </Typography>
        </label>
      )}

      {/* Input */}
      <Input
        id={fieldId}
        name={fieldId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        error={error}
        fullWidth
        {...inputProps}
      />

      {/* Error message */}
      {error && (
        <Typography variant="caption" color="error" className="mt-xxs">
          {error}
        </Typography>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <Typography variant="caption" color="medium-gray" className="mt-xxs">
          {helperText}
        </Typography>
      )}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  helperText: PropTypes.string,
};

export default FormField;
