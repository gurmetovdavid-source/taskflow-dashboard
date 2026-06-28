'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Task, TaskStatus, Priority } from '@/lib/types';
import { getTasks, resetDemo, saveTasks } from '@/lib/storage';
import { CheckCircle2, Clock, Layout, Plus, RotateCcw, Trash2 } from 'lucide-react';

const columns: TaskStatus[] = ['todo', 'in-progress', 'done'];

const columnTitles: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const priorityColors: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
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
    return { total, done, high, progress: total ? Math.round((done / total) * 100) : 0 };
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
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">TaskFlow</h1>
            <p className="mt-2 text-slate-600">Team task board and project overview</p>
            <p className="mt-1 text-xs text-slate-400">Portfolio demo — data is stored locally in your browser.</p>
          </div>
          <Button variant="secondary" onClick={() => { resetDemo(); setTasks(getTasks()); }}>
            <RotateCcw size={16} className="mr-2" /> Reset board
          </Button>
        </header>

        <section className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm font-medium text-slate-500">Total tasks</p>
            <p className="mt-1 text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="mt-1 text-2xl font-bold text-secondary">{stats.done}</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-slate-500">High priority</p>
            <p className="mt-1 text-2xl font-bold text-danger">{stats.high}</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-slate-500">Progress</p>
            <p className="mt-1 text-2xl font-bold text-primary">{stats.progress}%</p>
          </Card>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add task</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <Input className="lg:col-span-2" placeholder="Task title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
              <Plus size={16} className="mr-2" /> Add task
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {columns.map((status) => (
            <Card key={status} className="min-h-[300px]">
              <div className="mb-4 flex items-center justify-between">
                <CardTitle>{columnTitles[status]}</CardTitle>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {tasks.filter((t) => t.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-slate-900">{task.title}</h4>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-danger">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{task.assignee}</span>
                        <span>•</span>
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <div className="flex gap-1">
                          {status !== 'todo' && (
                            <button
                              onClick={() => moveTask(task.id, columns[columns.indexOf(status) - 1])}
                              className="rounded p-1 text-slate-400 hover:bg-slate-200"
                            >
                              <Clock size={14} />
                            </button>
                          )}
                          {status !== 'done' && (
                            <button
                              onClick={() => moveTask(task.id, columns[columns.indexOf(status) + 1])}
                              className="rounded p-1 text-slate-400 hover:bg-slate-200"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
