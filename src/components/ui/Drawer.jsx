import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen = false,
  onClose,
  title,
  placement = 'right',
  children,
  footer = null,
  closeOnOverlayClick = true
}) => {
  // Listen for Esc key down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const placements = {
    left: 'left-0 h-full w-80 max-w-[85vw] animate-in slide-in-from-left duration-200',
    right: 'right-0 h-full w-96 max-w-[85vw] animate-in slide-in-from-right duration-200',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-slate-900/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className={`absolute bg-white shadow-2xl flex flex-col h-full border-l border-slate-100 ${placements[placement] || placements.right}`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-slate-600">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
