import React from 'react';

export const Radio = ({
  label,
  name,
  value,
  checked,
  onChange,
  onBlur,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer select-none ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 transition duration-150 ease-in-out
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...props}
      />
      {label && (
        <span className={`ml-2 text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Radio;
