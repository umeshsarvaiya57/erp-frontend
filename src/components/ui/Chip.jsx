import React from 'react';
import { X } from 'lucide-react';

export const Chip = ({
  label,
  onDelete = null,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 ${className}`}
      {...props}
    >
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-200/50"
          aria-label="Remove item"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default Chip;
