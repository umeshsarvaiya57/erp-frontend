import React, { useState } from 'react';

export const Tooltip = ({
  text,
  children,
  position = 'top',
  className = ''
}) => {
  const [show, setShow] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 origin-top',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2 origin-right',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2 origin-left',
  };

  if (!text) return children;

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-[9999] px-2.5 py-1.5 text-xs text-white bg-slate-900 rounded-lg shadow-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 ${positions[position] || positions.top}`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
