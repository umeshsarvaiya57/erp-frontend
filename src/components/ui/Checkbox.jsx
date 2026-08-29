import React from 'react';

export const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = !!error;

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="inline-flex items-center cursor-pointer select-none">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 transition duration-150 ease-in-out
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${hasError ? 'border-red-300' : 'border-slate-300'}
          `}
          {...props}
        />
        {label && (
          <span className={`ml-2 text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
            {label}
          </span>
        )}
      </label>
      {hasError && (
        <span className="text-xs text-red-500 font-medium mt-1 ml-6">
          {error}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
