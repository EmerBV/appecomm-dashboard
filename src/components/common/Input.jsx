import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
  className,
  label,
  name,
  error,
  type = 'text',
  id,
  required = false,
  helpText,
  ...props
}, ref) => {
  // Generate ID if not provided
  const inputId = id || name;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-description`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={inputId}
        name={name}
        className={twMerge(
          'block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : '',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? errorId : helpText ? helpId : undefined
        }
        {...props}
      />
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={helpId}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
};

export default Input;