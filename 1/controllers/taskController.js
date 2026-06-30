import Task from '../models/Task.js';

/**
 * Helper utility to wrap async middleware and catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all tasks (with filtering, search, pagination, and sorting)
// @route   GET /api/tasks
// @access  Public
export const getAllTasks = asyncHandler(async (req, res) => {
  const query = {};

  // filter by completed status
  if (req.query.completed !== undefined) {
    query.completed = req.query.completed === 'true';
  }

  // filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  // text search
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: 'i' };
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // sorting
  let sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    // Default sort by creation date descending
    sort = { createdAt: -1 };
  }

  // execute query
  const totalTasks = await Task.countDocuments(query);
  const tasks = await Task.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalTasks / limit);

  res.status(200).json({
    success: true,
    count: tasks.length,
    pagination: {
      page,
      limit,
      totalPages,
      totalTasks
    },
    data: tasks
  });
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error(`Task with id ${req.params.id} not found`);
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, completed, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    completed,
    priority,
    dueDate
  });

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = asyncHandler(async (req, res, next) => {
  const { title, description, completed, priority, dueDate } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (completed !== undefined) updateData.completed = completed;
  if (priority !== undefined) updateData.priority = priority;
  if (dueDate !== undefined) updateData.dueDate = dueDate;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!task) {
    res.status(404);
    throw new Error(`Task with id ${req.params.id} not found`);
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error(`Task with id ${req.params.id} not found`);
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {
      id: req.params.id
    }
  });
});
