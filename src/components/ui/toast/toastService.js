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
  
  add: (type, content, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    let message = '';
    let title = '';
    let customDuration = duration;

    if (typeof content === 'string') {
      message = content;
    } else if (content && typeof content === 'object') {
      message = content.message || '';
      title = content.title || '';
      if (content.duration !== undefined) {
        customDuration = content.duration;
      }
    }

    const newToast = { id, type, message, title };
    toasts.push(newToast);
    notify();

    if (customDuration > 0 && type !== 'loading') {
      setTimeout(() => {
        toastService.dismiss(id);
      }, customDuration);
    }
    return id;
  },

  success: (content, duration) => toastService.add('success', content, duration),
  error: (content, duration) => toastService.add('error', content, duration),
  warning: (content, duration) => toastService.add('warning', content, duration),
  info: (content, duration) => toastService.add('info', content, duration),
  loading: (content) => toastService.add('loading', content, 0),
  
  dismiss: (id) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }
};

export const toast = toastService;
export default toast;

