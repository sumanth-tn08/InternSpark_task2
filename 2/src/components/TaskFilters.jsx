import React, { useState, useEffect } from 'react';

export default function TaskFilters({ filters, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search term changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onFilterChange({ search: searchTerm });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onFilterChange]);

  const handleTabChange = (completedVal) => {
    onFilterChange({ completed: completedVal });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-row-top">
        {/* Search */}
        <div className="search-wrapper">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <select
            name="priority"
            className="filter-select"
            value={filters.priority || ''}
            onChange={handleSelectChange}
          >
            <option value="">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          {/* Sort options */}
          <select
            name="sortBy"
            className="filter-select"
            value={filters.sortBy || 'createdAt:desc'}
            onChange={handleSelectChange}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="title:asc">Title (A-Z)</option>
            <option value="title:desc">Title (Z-A)</option>
            <option value="dueDate:asc">Due Date (Soonest)</option>
            <option value="dueDate:desc">Due Date (Latest)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Completed status tabs */}
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${filters.completed === '' ? 'active' : ''}`}
            onClick={() => handleTabChange('')}
          >
            All Tasks
          </button>
          <button
            type="button"
            className={`filter-tab ${filters.completed === 'false' ? 'active' : ''}`}
            onClick={() => handleTabChange('false')}
          >
            Active
          </button>
          <button
            type="button"
            className={`filter-tab ${filters.completed === 'true' ? 'active' : ''}`}
            onClick={() => handleTabChange('true')}
          >
            Completed
          </button>
        </div>

        {/* Limit Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Show:</span>
          <select
            name="limit"
            className="filter-select"
            style={{ padding: '6px 12px' }}
            value={filters.limit || 6}
            onChange={handleSelectChange}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>
    </div>
  );
}
