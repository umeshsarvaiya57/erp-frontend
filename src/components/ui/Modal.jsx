import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({
  isOpen = false,
  onClose,
  title,
  size = 'md',
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

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        className={`w-full bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${sizes[size] || sizes.md} animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto flex-1 text-sm text-slate-600">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
