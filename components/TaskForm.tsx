/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ITask } from '@/model/task';
import { useForm } from 'react-hook-form'

interface TaskFormProps {
  task?: Partial<ITask>; // Task can be optional (for create)
  action: (data: Omit<ITask, '_id' | 'createdAt'>) => Promise<void>;
}

export default function TaskForm({ task, action }: TaskFormProps) {
  const { register, handleSubmit, setValue } = useForm<
    Omit<ITask, '_id' | 'createdAt'>
  >({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 16)
        : '',
      isCompleted: task?.isCompleted || false,
    },
  });

  const onSubmit = async (data: Omit<ITask, '_id' | 'createdAt'>) => {
    // Ensure dueDate is converted to a Date object
    await action({
      ...data,
      dueDate: new Date(data.dueDate),
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
