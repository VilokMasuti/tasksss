import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useForm } from 'react-hook-form';

// Define the interface for form values
interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}
interface TaskData {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}

// Adjust the types for props
interface TaskFormProps {
  task: TaskData | undefined; // Task is now of type TaskData or undefined

  action: (taskData: TaskFormValues) => Promise<void>; // action should be a function
}
export default function TaskForm({ task, action }: TaskFormProps) {
  // Default values with optional task prop
  const { register, handleSubmit } = useForm<TaskFormValues>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate || '', // 'dueDate' is a string here
      isCompleted: task?.isCompleted || false,
    },
  });

  // Form submission handler
  const onSubmit = async (data: TaskFormValues) => {
    const dueDate = data.dueDate
      ? new Date(data.dueDate).toISOString()
      : undefined; // Convert to ISO string if provided
    await action({
      ...data,
      dueDate, // Ensure dueDate is in the correct format (string or undefined)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('title', { required: true })}
        placeholder="Task title"
      />
      <Textarea {...register('description')} placeholder="Description" />
      <Input type="datetime-local" {...register('dueDate')} />
      <Button type="submit">{task ? 'Update' : 'Create'} Task</Button>
    </form>
  );
}
