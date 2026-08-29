import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'An error occurred',
  message = 'Unable to fetch data from the server. Please try again.',
  onRetry = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-red-100 rounded-2xl bg-red-50/50 ${className}`}>
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-500 mb-4 animate-bounce">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          startIcon={<RefreshCw className="h-3.5 w-3.5" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
