import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long'],
      maxlength: [100, 'Task title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Task description cannot exceed 500 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority level (must be low, medium, or high)'
      },
      default: 'medium'
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function(v) {
          // ensure due date is not in the past
          if (!v) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return v >= today;
        },
        message: 'Due date cannot be in the past'
      }
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries on status and priority
taskSchema.index({ completed: 1, priority: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
