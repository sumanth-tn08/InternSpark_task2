import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import TaskForm from './pages/TaskForm';

export default function App() {
  const [toasts, setToasts] = useState([]);

  // Toast notification system
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard showNotification={showNotification} />} 
          />
          <Route 
            path="/tasks/new" 
            element={<TaskForm showNotification={showNotification} />} 
          />
          <Route 
            path="/tasks/:id" 
            element={<TaskDetails showNotification={showNotification} />} 
          />
          <Route 
            path="/tasks/:id/edit" 
            element={<TaskForm showNotification={showNotification} />} 
          />
          {/* Catch-all route */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </main>

      {/* Premium Toast Notification Bar */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="16" y2="12" />
                <line x1="12" x2="12.01" y1="8" y2="8" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </BrowserRouter>
  );
}
