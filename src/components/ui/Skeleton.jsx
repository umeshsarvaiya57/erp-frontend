import React from 'react';

export const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  ...props
}) => {
  const variants = {
    text: 'rounded-md h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`bg-slate-200 animate-pulse ${variants[variant]} ${className}`}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
};

export default Skeleton;
