/**
 * API client services for task CRUD operations.
 * Communicates with backend endpoints proxied through /api.
 */

const API_BASE_URL = '/api/tasks';

/**
 * Handles fetch responses, throwing errors with detailed messages if needed
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status: ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

/**
 * Fetch all tasks with optional filters, search, sorting and pagination
 */
export async function fetchTasks({ completed, priority, search, page = 1, limit = 10, sortBy } = {}) {
  const params = new URLSearchParams();
  
  if (completed !== undefined && completed !== '') {
    params.append('completed', completed);
  }
  if (priority) {
    params.append('priority', priority);
  }
  if (search) {
    params.append('search', search);
  }
  if (page) {
    params.append('page', page);
  }
  if (limit) {
    params.append('limit', limit);
  }
  if (sortBy) {
    params.append('sortBy', sortBy);
  }

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
  return handleResponse(response);
}

/**
 * Fetch a single task by ID
 */
export async function fetchTaskById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse(response);
}

/**
 * Create a new task
 */
export async function createTask(taskData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
}

/**
 * Update an existing task
 */
export async function updateTask(id, taskData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
}

/**
 * Delete a task
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
