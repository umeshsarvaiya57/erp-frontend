let listeners = [];
let toasts = [];

const notify = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const toastService = {
  subscribe: (listener) => {
    listeners.push(listener);
    listener([...toasts]);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  
  add: (type, message, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, message };
    toasts.push(newToast);
    notify();

    if (duration > 0 && type !== 'loading') {
      setTimeout(() => {
        toastService.dismiss(id);
      }, duration);
    }
    return id;
  },

  success: (message, duration) => toastService.add('success', message, duration),
  error: (message, duration) => toastService.add('error', message, duration),
  warning: (message, duration) => toastService.add('warning', message, duration),
  info: (message, duration) => toastService.add('info', message, duration),
  loading: (message) => toastService.add('loading', message, 0),
  
  dismiss: (id) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }
};

export const toast = toastService;
export default toast;
