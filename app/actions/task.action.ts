'use server';
import connectDB from '@/db';
import Task, { ITask } from '@/model/task';
import { Types } from 'mongoose';

// Use Omit to exclude `_id` and `createdAt` for form input
type TaskInput = Omit<ITask, '_id' | 'createdAt'>;

// ✅ Create Task (Exclude `_id` & `createdAt`)
export const createTask = async (formData: TaskInput) => {
  try {
    await connectDB();

    const task = new Task({
      ...formData,
      createdAt: new Date(),
    });

    await task.save();
    return { success: true, message: 'Task created successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ✅ Update Task (Ensure `id` is a valid MongoDB ObjectId)
export const updateTask = async (id: string, taskData: Partial<TaskInput>) => {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: 'Invalid task ID' };
    }

    await Task.findByIdAndUpdate(id, taskData);
    return { success: true };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ✅ Delete Task (Validate `id`)
export const deleteTask = async (id: string) => {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: 'Invalid task ID' };
    }

    await Task.findByIdAndDelete(id);
    return { success: true, message: 'Task deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
