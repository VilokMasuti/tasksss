import { Schema, model, models, Document } from "mongoose";

// Define the TypeScript interface
export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
}

// Define the Mongoose Schema
const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Export the model with TypeScript support
const Task = models.Task || model<ITask>("Task", taskSchema);
export default Task;
