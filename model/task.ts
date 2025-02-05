import { Document, Schema, model, models } from 'mongoose';

// Base interface (data structure only)
interface ITaskBase {
  title: string;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
}

// Database interface (includes Mongoose methods)
export interface ITask extends ITaskBase, Document {
  createdAt: Date;
}

// Input type for server actions (excludes Mongoose-specific fields)
export type TaskInput = Omit<ITaskBase, '_id' | 'createdAt'>;

// Mongoose schema
const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Model export
const Task = models.Task || model<ITask>('Task', taskSchema);
export default Task;
