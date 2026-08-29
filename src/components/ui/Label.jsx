import React from 'react';

export const Label = ({
  htmlFor,
  required = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
