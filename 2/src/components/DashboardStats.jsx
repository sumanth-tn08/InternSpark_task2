import React from 'react';

export default function DashboardStats({ total = 0, completed = 0, pending = 0, highPriority = 0 }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-title">Total Tasks</span>
        <span className="stat-value">{total}</span>
      </div>
      
      <div className="stat-card stat-completed">
        <span className="stat-title">Completed</span>
        <span className="stat-value">{completed}</span>
      </div>
      
      <div className="stat-card stat-pending">
        <span className="stat-title">Pending</span>
        <span className="stat-value">{pending}</span>
      </div>
      
      <div className="stat-card stat-high">
        <span className="stat-title">High Priority</span>
        <span className="stat-value">{highPriority}</span>
      </div>
    </div>
  );
}
