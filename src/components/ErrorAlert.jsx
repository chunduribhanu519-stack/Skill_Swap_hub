import React from 'react';

const ErrorAlert = ({ message, onRetry, className = "" }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Error Icon */}
        <div className="text-red-500 text-xl">⚠️</div>
        
        <div className="flex-1">
          <p className="text-sm font-bold text-red-800 dark:text-red-300">
            Error Occurred
          </p>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
            {message}
          </p>
          
          {/* Optional Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:text-red-800 transition underline decoration-2 underline-offset-4"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
