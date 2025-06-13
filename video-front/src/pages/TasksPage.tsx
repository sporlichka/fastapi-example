import React, { useEffect, useState } from 'react';
import { getTasks, createTask } from '../api';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Plus } from "lucide-react";

interface Task {
  task_id: string;
  text: string;
  created_at: string;
  owner_id: string;
  is_completed: boolean;
}

const TasksPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await createTask(newTask);
      setNewTask('');
      fetchTasks();
    } catch {
      setError('Failed to add task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <Button
            onClick={() => { logout(); navigate('/login'); }}
            variant="outline"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <form onSubmit={handleAddTask} className="mb-8">
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskItem key={task.task_id} task={task} onUpdate={fetchTasks} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No tasks yet. Add one above!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage; 