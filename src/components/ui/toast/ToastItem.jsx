import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Loader2, 
  X 
} from 'lucide-react';
import { toast } from './toastService';

export const ToastItem = ({ toast: item }) => {
  const { id, type = 'info', message, title } = item;

  const typeConfig = {
    success: {
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      bg: 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      icon: <CheckCircle2 className="h-5 w-5" />,
      defaultTitle: 'Success',
    },
    error: {
      border: 'border-rose-500/30 dark:border-rose-500/40',
      bg: 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
      accent: 'bg-rose-500',
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      icon: <AlertCircle className="h-5 w-5" />,
      defaultTitle: 'Error',
    },
    warning: {
      border: 'border-amber-500/30 dark:border-amber-500/40',
      bg: 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
      accent: 'bg-amber-500',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      icon: <AlertTriangle className="h-5 w-5" />,
      defaultTitle: 'Warning',
    },
    info: {
      border: 'border-blue-500/30 dark:border-blue-500/40',
      bg: 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      icon: <Info className="h-5 w-5" />,
      defaultTitle: 'Information',
    },
    loading: {
      border: 'border-primary-500/30 dark:border-primary-500/40',
      bg: 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
      accent: 'bg-primary-500',
      iconBg: 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400',
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      defaultTitle: 'Please wait...',
    },
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`
        relative overflow-hidden flex items-start gap-3 w-full p-4 rounded-2xl border shadow-xl
        backdrop-blur-md transition-all duration-300 transform translate-x-0
        hover:shadow-2xl select-none group
        ${current.border} ${current.bg}
      `}
      role="alert"
    >
      {/* Accent left indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${current.accent}`} />

      {/* Icon Badge */}
      <div className={`p-2 rounded-xl shrink-0 flex items-center justify-center ${current.iconBg}`}>
        {current.icon}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-0.5">
          {title || current.defaultTitle}
        </h4>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug break-words">
          {message}
        </p>
      </div>

      {/* Close Button */}
      {type !== 'loading' && (
        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 mt-0.5"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ToastItem;

