'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Task, TaskStatus, Priority } from '@/lib/types';
import { getTasks, resetDemo, saveTasks } from '@/lib/storage';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';

const columns: TaskStatus[] = ['todo', 'in-progress', 'done'];

const columnTitles: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const columnColors: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-600',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  done: 'bg-emerald-100 text-emerald-700',
};

const priorityColors: Record<Priority, string> = {
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<Partial<Task>>({ status: 'todo', priority: 'medium' });

  useEffect(() => {
    setTasks(getTasks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const high = tasks.filter((t) => t.priority === 'high').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    return { total, done, high, inProgress, progress: total ? Math.round((done / total) * 100) : 0 };
  }, [tasks]);

  const addTask = () => {
    if (!form.title || !form.assignee) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: form.title,
      assignee: form.assignee,
      status: (form.status as TaskStatus) || 'todo',
      priority: (form.priority as Priority) || 'medium',
      dueDate: form.dueDate || new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [newTask, ...prev]);
    setForm({ status: 'todo', priority: 'medium' });
  };

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Track tasks and team progress at a glance</p>
          </div>
          <Button variant="secondary" onClick={() => { resetDemo(); setTasks(getTasks()); }}>
            <RotateCcw size={16} /> Reset board
          </Button>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total tasks" value={stats.total} icon={ClipboardList} color="text-primary" bg="bg-indigo-50" />
          <StatCard label="Completed" value={stats.done} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="High priority" value={stats.high} icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
          <StatCard label="Progress" value={`${stats.progress}%`} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        </section>

        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Add task</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Input
              className="lg:col-span-2"
              placeholder="Task title"
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input placeholder="Assignee" value={form.assignee || ''} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
            <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Input type="date" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="mt-4">
            <Button onClick={addTask}>
              <Plus size={16} /> Add task
            </Button>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-3">
          {columns.map((status) => (
            <div key={status} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${columnColors[status]}`}>
                    {columnTitles[status]}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{tasks.filter((t) => t.status === status).length}</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <Card key={task.id} className="group transition-shadow hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-300 transition-colors hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{task.assignee}</span>
                        <span>•</span>
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${priorityColors[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        <div className="flex items-center gap-1">
                          {status !== 'todo' && (
                            <button
                              onClick={() => moveTask(task.id, columns[columns.indexOf(status) - 1])}
                              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                              aria-label="Move back"
                            >
                              <ChevronLeft size={16} />
                            </button>
                          )}
                          {status !== 'done' && (
                            <button
                              onClick={() => moveTask(task.id, columns[columns.indexOf(status) + 1])}
                              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                              aria-label="Move forward"
                            >
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}
