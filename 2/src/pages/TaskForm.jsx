import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTaskById, createTask, updateTask } from '../services/api';
import { Loader } from '../components/Loader';

export default function TaskForm({ showNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  // Format date object/string to YYYY-MM-DD for input field
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load existing task details if in edit mode
  const loadTask = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchTaskById(id);
      if (res.success && res.data) {
        const task = res.data;
        setFormData({
          title: task.title || '',
          description: task.description || '',
          completed: task.completed || false,
          priority: task.priority || 'medium',
          dueDate: formatDateForInput(task.dueDate)
        });
      }
    } catch {
      showNotification('Failed to load task for editing.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showNotification]);

  useEffect(() => {
    if (isEditMode) {
      loadTask();
    }
  }, [isEditMode, loadTask]);

  // Handle inputs change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Perform form validation before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Task title cannot exceed 100 characters';
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    // Due Date validation (not in the past)
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      selectedDate.setHours(23, 59, 59, 999); // Allow until end of selected day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      // Clean request data
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      if (isEditMode) {
        const res = await updateTask(id, payload);
        if (res.success) {
          showNotification('Task updated successfully.', 'success');
          navigate(`/tasks/${id}`);
        }
      } else {
        const res = await createTask(payload);
        if (res.success) {
          showNotification('Task created successfully.', 'success');
          navigate('/');
        }
      }
    } catch (err) {
      // Backend validation error responses
      if (err.errors) {
        const backendErrors = {};
        err.errors.forEach(el => {
          backendErrors[el.field] = el.message;
        });
        setErrors(backendErrors);
        showNotification('Validation failed on server.', 'error');
      } else {
        showNotification(err.message || 'An error occurred during submission.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading form details..." />;

  // Get minimum date attribute (today) for date picker
  const getMinDateStr = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to={isEditMode ? `/tasks/${id}` : '/'} className="btn btn-secondary">
          &larr; Cancel
        </Link>
      </div>

      <div className="form-layout">
        <h2 className="form-title">
          {isEditMode ? 'Edit Task Details' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Complete project implementation plan"
              value={formData.title}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              placeholder="Add details about this task..."
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {formData.description ? formData.description.length : 0}/500 chars
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label" htmlFor="priority">Priority Level</label>
            <select
              id="priority"
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              min={getMinDateStr()}
              className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
              value={formData.dueDate}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.dueDate && <div className="form-error">{errors.dueDate}</div>}
          </div>

          {/* Completed status - Only in Edit Mode */}
          {isEditMode && (
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="completed"
                name="completed"
                className="task-checkbox"
                checked={formData.completed}
                onChange={handleChange}
                disabled={submitting}
              />
              <label className="form-label" htmlFor="completed" style={{ cursor: 'pointer', userSelect: 'none' }}>
                Mark this task as completed
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <Link to={isEditMode ? `/tasks/${id}` : '/'} className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
