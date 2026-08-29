import React, { useState } from 'react';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg font-semibold',
    xl: 'h-20 w-20 text-2xl font-bold',
  };

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const colors = [
    'bg-primary-500 text-white',
    'bg-indigo-500 text-white',
    'bg-blue-500 text-white',
    'bg-emerald-500 text-white',
    'bg-rose-500 text-white',
    'bg-amber-500 text-white',
  ];

  // Derive stable color index based on name hash
  const getColorClass = (str) => {
    if (!str) return colors[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const renderFallback = () => {
    const initials = getInitials(name);
    const colorClass = getColorClass(name);
    return (
      <div
        className={`flex items-center justify-center rounded-full font-medium tracking-wider select-none shrink-0 ${colorClass} ${sizes[size] || sizes.md} ${className}`}
        {...props}
      >
        {initials}
      </div>
    );
  };

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={`object-cover rounded-full shrink-0 border border-slate-100 ${sizes[size] || sizes.md} ${className}`}
        {...props}
      />
    );
  }

  return renderFallback();
};

export default Avatar;
