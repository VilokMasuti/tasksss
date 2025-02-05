'use client';
import { createTask, deleteTask, updateTask } from '@/app/actions/task.action';
import TaskForm from '@/components/TaskForm';
import TaskSkeleton from '@/components/TaskSkeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// interfaces/TaskForm.d.ts
// interfaces/TaskForm.d.ts
interface TaskData {
  _id: string; // Add this line
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}
type TaskInput = Omit<TaskData, '_id'>;

export default function Home() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      toast.error(`${error} Failed to fetch tasks`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Toggle task completion status
  const handleToggle = async (task: TaskData) => {
    try {
      const updatedTask = {
        ...task,
        isCompleted: !task.isCompleted,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      };
      await updateTask(task._id as string, updatedTask);

      fetchTasks();
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(`${error} Failed to update task`);
    }
  };

  const handleSubmitTask = async (taskData: TaskInput) => {
    try {
      setIsSubmitting(true);
      if (selectedTask) {
        await updateTask(selectedTask._id as string, {
          ...taskData,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        });
        toast.success('Task updated successfully');
      } else {
        await createTask(taskData);
        toast.success('Task created successfully');
      }
      fetchTasks();
      setShowForm(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error(`${error} Failed to submit task`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setSelectedTask(null);
          }}
          disabled={isSubmitting}
        >
          {showForm ? 'Cancel' : 'New Task'}
        </Button>
      </div>

      {/* Task Form */}
      {showForm && (
        <Card className="mb-6 animate-fade-in">
          <CardContent className="pt-6">
            <TaskForm
              task={selectedTask ?? undefined}
              action={handleSubmitTask}
            />
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading ? (
        <TaskSkeleton />
      ) : tasks.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No tasks found. Create a new task!</p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            Create Task
          </Button>
        </div>
      ) : (
        // Task List
        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => handleToggle(task)}
                  />
                  <div>
                    <CardTitle
                      className={`${
                        task.isCompleted ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {task.title}
                    </CardTitle>
                    <CardDescription>
                      Due:{' '}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : 'No due date'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        await deleteTask(task._id as string);
                        fetchTasks();
                        toast.success('Task deleted successfully');
                      } catch (error) {
                        toast.error(`${error} Failed to delete task`);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              {task.description && (
                <CardContent>
                  <p className="text-gray-700">{task.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
