'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Task, TaskStatus, Priority } from '@/lib/types';
import { getTasks, saveTasks } from '@/lib/storage';
import { Search, Trash2 } from 'lucide-react';

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const priorityClasses: Record<Priority, string> = {
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  useEffect(() => {
    setTasks(getTasks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.assignee.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500">Search and filter all tasks</p>
        </header>

        <Card className="mb-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search tasks or assignee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}>
              <option value="all">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}>
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
        </Card>

        <div className="space-y-3">
          {filtered.map((task) => (
            <Card
              key={task.id}
              className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            >
              <div>
                <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{task.assignee}</span>
                  <span>•</span>
                  <span>{task.dueDate}</span>
                  <span>•</span>
                  <span>{statusLabels[task.status]}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${priorityClasses[task.priority]}`}
                >
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-300 transition-colors hover:text-rose-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">No tasks match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
