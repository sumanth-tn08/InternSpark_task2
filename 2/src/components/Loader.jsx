import React from 'react';

/**
 * Centered spinner component for page-level loading
 */
export function Loader({ message = 'Loading tasks...' }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{message}</p>
    </div>
  );
}

/**
 * Skeleton loading card elements matching the dashboard task grid
 */
export function SkeletonLoader({ count = 3 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card"></div>
      ))}
    </div>
  );
}
