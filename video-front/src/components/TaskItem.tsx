import React, { useState } from 'react';
import { updateTask, deleteTask } from '../api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Save, X } from "lucide-react";

interface Task {
  task_id: string;
  text: string;
  created_at: string;
  owner_id: string;
  is_completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateTask(task.task_id, { text });
    setEditing(false);
    setLoading(false);
    onUpdate();
  };

  const handleToggle = async () => {
    setLoading(true);
    await updateTask(task.task_id, { is_completed: !task.is_completed });
    setLoading(false);
    onUpdate();
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteTask(task.task_id);
    setLoading(false);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg border border-gray-100">
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.is_completed}
          onCheckedChange={handleToggle}
          disabled={loading}
          className="mt-1"
        />
        <div className="flex-1">
          {editing ? (
            <div className="space-y-2">
              <Input
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={loading}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={() => setEditing(false)}
                  disabled={loading}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className={`text-gray-800 ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                {task.text}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Created: {new Date(task.created_at).toLocaleString()}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => setEditing(true)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 