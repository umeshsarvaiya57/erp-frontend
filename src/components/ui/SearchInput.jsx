import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  const handleClear = () => {
    if (onChange) {
      // Simulate input event change for easy integration with state/Formik
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`relative rounded-xl shadow-sm w-full max-w-xs ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm py-2 pl-10 pr-9 transition-all duration-200 hover:border-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
