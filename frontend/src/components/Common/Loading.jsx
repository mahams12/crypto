import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-2 border-gray-600 border-t-primary-500 rounded-full`}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-400 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Skeleton loading components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-dark-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-dark-700 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-dark-700 rounded w-1/3" />
          <div className="h-3 bg-dark-700 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-dark-700 rounded w-1/2" />
        <div className="h-4 bg-dark-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 10 }) => (
  <div className="animate-pulse space-y-4">
    {/* Table header */}
    <div className="flex space-x-4 py-3">
      <div className="h-4 bg-dark-700 rounded w-8" />
      <div className="h-4 bg-dark-700 rounded w-32" />
      <div className="h-4 bg-dark-700 rounded w-20" />
      <div className="h-4 bg-dark-700 rounded w-24" />
      <div className="h-4 bg-dark-700 rounded w-20" />
    </div>
    
    {/* Table rows */}
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 py-4">
        <div className="w-6 h-4 bg-dark-800 rounded" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dark-800 rounded-full" />
          <div className="space-y-1">
            <div className="h-4 bg-dark-800 rounded w-24" />
            <div className="h-3 bg-dark-800 rounded w-16" />
          </div>
        </div>
        <div className="h-4 bg-dark-800 rounded w-20" />
        <div className="h-4 bg-dark-800 rounded w-16" />
        <div className="h-4 bg-dark-800 rounded w-24" />
      </div>
    ))}
  </div>
);

export const SkeletonChart = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-dark-800 rounded-xl p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-dark-700 rounded w-32" />
          <div className="h-4 bg-dark-700 rounded w-16" />
        </div>
        <div className="h-64 bg-dark-700 rounded" />
        <div className="flex justify-between">
          <div className="h-3 bg-dark-700 rounded w-12" />
          <div className="h-3 bg-dark-700 rounded w-12" />
          <div className="h-3 bg-dark-700 rounded w-12" />
          <div className="h-3 bg-dark-700 rounded w-12" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonNews = ({ count = 6 }) => (
  <div className="space-y-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-dark-800 rounded-xl p-6">
          <div className="flex space-x-4">
            <div className="w-24 h-24 bg-dark-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-dark-700 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-dark-700 rounded w-full" />
                <div className="h-4 bg-dark-700 rounded w-2/3" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-3 bg-dark-700 rounded w-16" />
                <div className="h-3 bg-dark-700 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Page loading component
export const PageLoading = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-3 border-gray-600 border-t-primary-500 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-200 mb-2">CryptoTracker</h2>
      <p className="text-gray-400">Loading market data...</p>
    </div>
  </div>
);

// Component loading wrapper
export const LoadingWrapper = ({ isLoading, children, fallback, className = '' }) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        {fallback || <Loading />}
      </div>
    );
  }
  
  return children;
};

export default Loading;