import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTaskById, deleteTask, updateTask } from '../services/api';
import { Loader } from '../components/Loader';

export default function TaskDetails({ showNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTask = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchTaskById(id);
      if (res.success) {
        setTask(res.data);
      }
    } catch (err) {
      setError(err.message || 'Task not found.');
      showNotification('Failed to load task details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleStatusToggle = async () => {
    if (!task) return;
    const newState = !task.completed;
    try {
      const res = await updateTask(task._id, { completed: newState });
      if (res.success) {
        setTask(prev => ({ ...prev, completed: newState }));
        showNotification(
          newState ? 'Task marked as completed.' : 'Task marked as active.',
          'success'
        );
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update task.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await deleteTask(id);
      if (res.success) {
        showNotification('Task deleted successfully.', 'success');
        navigate('/');
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete task.', 'error');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loader message="Fetching task details..." />;

  if (error) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="error-banner" style={{ display: 'inline-flex', gap: '20px' }}>
          <span><strong>Error:</strong> {error}</span>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="btn btn-secondary">&larr; Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="details-layout">
        <div className="details-header">
          <div>
            <h1 className="details-title">{task.title}</h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority} Priority
              </span>
              <span className={`priority-badge ${task.completed ? 'priority-low' : 'priority-medium'}`}>
                {task.completed ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>
          
          <button 
            type="button" 
            className={`btn ${task.completed ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleStatusToggle}
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>

        <div className="details-description-title">Description</div>
        <div className="details-description">
          {task.description || <i>No description was provided for this task.</i>}
        </div>

        <div className="details-meta-grid">
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due Date</span>
            <strong style={{ fontSize: '1.1rem' }}>{formatDate(task.dueDate)}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Created On</span>
            <span style={{ fontSize: '0.95rem' }}>{formatTimestamp(task.createdAt)}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Last Updated</span>
            <span style={{ fontSize: '0.95rem' }}>{formatTimestamp(task.updatedAt)}</span>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete Task
          </button>
          
          <Link to={`/tasks/${task._id}/edit`} className="btn btn-primary">
            Edit Details
          </Link>
        </div>
      </div>
    </div>
  );
}
