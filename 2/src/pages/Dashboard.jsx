import React, { useState, useEffect, useCallback } from 'react';
import { fetchTasks, updateTask, deleteTask } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import TaskFilters from '../components/TaskFilters';
import TaskCard from '../components/TaskCard';
import { SkeletonLoader } from '../components/Loader';

export default function Dashboard({ showNotification }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter settings
  const [filters, setFilters] = useState({
    completed: '',
    priority: '',
    search: '',
    page: 1,
    limit: 6,
    sortBy: 'createdAt:desc'
  });
  
  // Total pages from API response
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalPages: 1,
    totalTasks: 0
  });

  // Calculate statistics from all tasks in database
  const loadStats = useCallback(async () => {
    try {
      // Fetch tasks without limits to compute global stats
      const res = await fetchTasks({ limit: 1000 });
      if (res.success && res.data) {
        const all = res.data;
        const total = all.length;
        const completed = all.filter(t => t.completed).length;
        const pending = total - completed;
        const highPriority = all.filter(t => t.priority === 'high' && !t.completed).length;
        
        setStats({ total, completed, pending, highPriority });
      }
    } catch (err) {
      console.error('Failed to load global statistics:', err);
    }
  }, []);

  // Fetch paginated tasks based on current filters
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchTasks(filters);
      if (res.success) {
        setTasks(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading tasks.');
      showNotification('Failed to fetch tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  // Load data on mount and filter changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1 // Reset page unless explicitly setting it
    }));
  }, []);

  // Toggle completion checkbox
  const handleStatusToggle = async (id, newCompletedState) => {
    try {
      const res = await updateTask(id, { completed: newCompletedState });
      if (res.success) {
        // Optimistic state update in local grid
        setTasks(prev => prev.map(t => t._id === id ? { ...t, completed: newCompletedState } : t));
        showNotification(
          newCompletedState ? 'Task marked as completed.' : 'Task marked as active.',
          'success'
        );
        loadStats();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update task status.', 'error');
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const res = await deleteTask(id);
      if (res.success) {
        setTasks(prev => prev.filter(t => t._id !== id));
        showNotification('Task deleted successfully.', 'success');
        
        // If we deleted the last item on this page, go back a page
        if (tasks.length === 1 && filters.page > 1) {
          handleFilterChange({ page: filters.page - 1 });
        } else {
          loadTasks();
        }
        loadStats();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete task.', 'error');
    }
  };

  return (
    <div className="container dashboard-layout">
      <div className="dashboard-title-section">
        <div>
          <h1>Your Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track your items</p>
        </div>
      </div>

      {/* Stats bar */}
      <DashboardStats
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
        highPriority={stats.highPriority}
      />

      {/* Filters bar */}
      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <span><strong>Error:</strong> {error}</span>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={loadTasks}>
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <SkeletonLoader count={filters.limit} />
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-title">No tasks found</div>
          <p style={{ marginBottom: '16px' }}>Try adjusting your filters or search query, or add a new task.</p>
        </div>
      ) : (
        /* Task Card Grid */
        <>
          <div className="tasks-grid">
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusToggle={handleStatusToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={filters.page === 1}
                onClick={() => handleFilterChange({ page: filters.page - 1 })}
              >
                &larr; Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={filters.page === pagination.totalPages}
                onClick={() => handleFilterChange({ page: filters.page + 1 })}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
