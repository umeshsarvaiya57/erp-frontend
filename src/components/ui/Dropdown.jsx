import React, { useState, useEffect, useRef } from 'react';

export const Dropdown = ({
  trigger,
  align = 'right',
  items = [],
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute mt-2 w-48 rounded-xl border border-slate-100 bg-white shadow-xl z-50 py-1.5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150 ${alignments[align] || alignments.right}`}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (item.onClick) item.onClick();
              }}
              className={`
                w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 transition-colors duration-150
                ${item.danger 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              {item.icon && <span className="shrink-0 text-slate-400">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
