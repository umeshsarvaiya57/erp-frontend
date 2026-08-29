import React from 'react';
import { Label } from './Label';

export const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  inputClassName = '',
  ...props
}) => {
  const hasError = !!error;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          block w-full rounded-xl border transition-all duration-200 text-sm py-2.5 px-3.5 bg-white
          ${disabled ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'text-slate-900'}
          ${hasError 
            ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
          }
          ${inputClassName}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <span className="text-xs text-red-500 font-medium mt-1 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
