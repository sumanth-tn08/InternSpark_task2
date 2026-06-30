import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <NavLink to="/" className="brand">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--accent-primary)' }}
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>TaskFlow</span>
        </NavLink>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            end
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/tasks/new" 
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
          >
            + New Task
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
