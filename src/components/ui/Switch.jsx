import React from 'react';

export const Switch = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer select-none ${className}`}>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={`
          block w-10 h-6 rounded-full transition-colors duration-200
          ${checked ? 'bg-primary-500' : 'bg-slate-300'}
          ${disabled ? 'opacity-50' : ''}
        `}></div>
        <div className={`
          absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200
          ${checked ? 'transform translate-x-4' : ''}
          ${disabled ? 'opacity-50' : ''}
        `}></div>
      </div>
      {label && (
        <span className={`ml-3 text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;
