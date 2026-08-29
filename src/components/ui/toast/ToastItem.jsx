import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Loader, X } from 'lucide-react';
import { toast } from './toastService';

export const ToastItem = ({ toast: item }) => {
  const { id, type, message } = item;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    loading: 'bg-slate-50 text-slate-800 border-slate-200',
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
    loading: <Loader className="h-5 w-5 text-slate-500 shrink-0 animate-spin" />,
  };

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${styles[type] || styles.info}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 text-sm font-medium pt-0.5">{message}</div>
      <button
        onClick={() => toast.dismiss(id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-black/5 shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ToastItem;
