import React from 'react';

const EmptyState = ({ icon, title, message, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in zoom-in duration-500">
      {/* Icon/Illustration Container */}
      <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">
        {icon}
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
        {message}
      </p>

      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
