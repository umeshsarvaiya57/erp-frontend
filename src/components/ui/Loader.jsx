import React from 'react';

export const Loader = ({
  size = 'md',
  fullscreen = false,
  className = ''
}) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div
      className={`
        animate-spin rounded-full border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent border-slate-200
        ${sizes[size] || sizes.md}
        ${className}
      `}
      role="status"
      aria-label="loading"
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      {spinner}
    </div>
  );
};

export default Loader;
