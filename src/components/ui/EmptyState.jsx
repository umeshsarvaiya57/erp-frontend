import React from 'react';
import { Database } from 'lucide-react';

export const EmptyState = ({
  title = 'No records found',
  description = 'Try adding a new entry or adjusting your filters.',
  icon = null,
  action = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 ${className}`}>
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-400 mb-4">
        {icon || <Database className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default EmptyState;
