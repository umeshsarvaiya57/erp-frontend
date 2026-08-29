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
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-[calc(100vw-2rem)] sm:max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
