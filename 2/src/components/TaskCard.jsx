import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaskCard({ task, onStatusToggle, onDelete }) {
  const navigate = useNavigate();
  const { _id, title, description, completed, priority, dueDate } = task;

  // Format date to local string
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if due date is today or soon (within 24 hours) for high urgency warning
  const isOverdueOrDueSoon = () => {
    if (!dueDate || completed) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due < today;
  };

  return (
    <div className={`task-card ${completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <span className={`priority-badge priority-${priority}`}>
          {priority}
        </span>
        <h3 className="task-title" title={title}>{title}</h3>
      </div>

      <p className="task-description">
        {description || <i>No description provided.</i>}
      </p>

      <div className="task-meta">
        <div className="task-meta-item">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span style={{ color: isOverdueOrDueSoon() ? 'var(--priority-high)' : 'inherit' }}>
            {formatDate(dueDate)} {isOverdueOrDueSoon() && '(Overdue)'}
          </span>
        </div>
      </div>

      <div className="task-actions">
        {/* Status Checkbox */}
        <label className="task-checkbox-wrapper" title={completed ? 'Mark incomplete' : 'Mark complete'}>
          <input
            type="checkbox"
            className="task-checkbox"
            checked={completed}
            onChange={() => onStatusToggle(_id, !completed)}
          />
        </label>

        {/* View Details */}
        <button
          type="button"
          className="action-icon-btn"
          title="View Details"
          onClick={() => navigate(`/tasks/${_id}`)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {/* Edit Task */}
        <button
          type="button"
          className="action-icon-btn"
          title="Edit Task"
          onClick={() => navigate(`/tasks/${_id}/edit`)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>

        {/* Delete Task */}
        <button
          type="button"
          className="action-icon-btn delete-btn"
          title="Delete Task"
          onClick={() => onDelete(_id)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
