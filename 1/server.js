import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

// Controllers
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from './controllers/taskController.js';

// Env config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// DB connection
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('[MongoDB] Error: MONGODB_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Database connection failure: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Logger
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.route('/api/tasks')
  .get(getAllTasks)
  .post(createTask);

app.route('/api/tasks/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Tasks RESTful CRUD API. Use /api/tasks to access resources.'
  });
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = null;

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message
    }));
  }

  // Cast errors (invalid ObjectID)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid resource ID format: ${err.value}`;
  }

  // Duplicate keys
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `Conflict: Duplicate value entered for field: '${duplicatedField}'`;
  }

  // Log error stack to console (if not in production environment)
  console.error(`[Error] ${statusCode} - ${message}`);
  if (NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`[Server] running in ${NODE_ENV} mode on port ${PORT}`);
});

// Unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Process] Unhandled Rejection: ${err.message}`);
  // Gracefully close server and exit process
  server.close(() => process.exit(1));
});
