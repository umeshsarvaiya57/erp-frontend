import React from 'react';
import { Label } from './Label';

export const TextField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  startIcon = null,
  endIcon = null,
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
      <div className="relative rounded-xl shadow-sm">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {startIcon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            block w-full rounded-xl border transition-all duration-200 text-sm py-2.5 px-3.5
            ${startIcon ? 'pl-10' : ''}
            ${endIcon ? 'pr-10' : ''}
            ${disabled ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900'}
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
            }
            ${inputClassName}
          `}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            {endIcon}
          </div>
        )}
      </div>
      {hasError && (
        <span className="text-xs text-red-500 font-medium mt-1 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextField;
