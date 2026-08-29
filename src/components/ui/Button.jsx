import React from 'react';
import { Loader } from 'lucide-react';

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon = null,
  endIcon = null,
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/10 focus:ring-primary-400',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 focus:ring-emerald-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/10 focus:ring-red-400',
    outline: 'border border-slate-300 hover:bg-slate-100 text-slate-700 focus:ring-slate-400',
    text: 'hover:bg-slate-100 text-slate-600 focus:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading && <Loader className="h-4 w-4 animate-spin shrink-0" />}
      {!loading && startIcon && <span className="shrink-0">{startIcon}</span>}
      <span>{children}</span>
      {!loading && endIcon && <span className="shrink-0">{endIcon}</span>}
    </button>
  );
};

export default Button;
