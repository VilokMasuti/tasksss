// interfaces/TaskForm.d.ts
export interface TaskData {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}
