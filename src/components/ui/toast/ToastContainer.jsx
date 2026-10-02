import React, { useState, useEffect } from 'react';
import { toastService } from './toastService';
import { ToastItem } from './ToastItem';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toastService.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });
  }, []);

  return (
    <aside
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 w-full max-w-[calc(100vw-2.5rem)] sm:max-w-md pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in">
          <ToastItem toast={toast} />
        </div>
      ))}
    </aside>
  );
};

export default ToastContainer;

