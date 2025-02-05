import connectDB from '@/lib/db';
import Task from '@/model/task';

export async function GET() {
  await connectDB();
  const tasks = await Task.find().sort({ createdAt: -1 });
  return Response.json(tasks);
}
