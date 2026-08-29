import React from 'react';
import { Label } from './Label';

export const TextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 3,
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
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={`
          block w-full rounded-xl border transition-all duration-200 text-sm py-2.5 px-3.5
          ${disabled ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900'}
          ${hasError 
            ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
          }
          ${inputClassName}
        `}
        {...props}
      />
      {hasError && (
        <span className="text-xs text-red-500 font-medium mt-1 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextArea;
