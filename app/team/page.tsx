'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Task } from '@/lib/types';
import { getTasks } from '@/lib/storage';
import { Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const team = [
  { name: 'Alex', role: 'Product Designer', email: 'alex@example.com' },
  { name: 'Maria', role: 'Backend Engineer', email: 'maria@example.com' },
  { name: 'John', role: 'Frontend Engineer', email: 'john@example.com' },
];

export default function TeamPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTasks(getTasks());
    setLoaded(true);
  }, []);

  const stats = useMemo(() => {
    return team.map((member) => {
      const memberTasks = tasks.filter((t) => t.assignee === member.name);
      return {
        ...member,
        total: memberTasks.length,
        done: memberTasks.filter((t) => t.status === 'done').length,
        high: memberTasks.filter((t) => t.priority === 'high').length,
      };
    });
  }, [tasks]);

  if (!loaded) return null;

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-sm text-slate-500">Team members and their workload</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((member) => (
            <Card key={member.name}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                  {member.name[0]}
                </div>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 p-2">
                  <Clock size={16} className="mx-auto mb-1 text-slate-400" />
                  <p className="text-lg font-bold">{member.total}</p>
                  <p className="text-[10px] uppercase text-slate-400">Tasks</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <CheckCircle2 size={16} className="mx-auto mb-1 text-green-500" />
                  <p className="text-lg font-bold">{member.done}</p>
                  <p className="text-[10px] uppercase text-slate-400">Done</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <AlertCircle size={16} className="mx-auto mb-1 text-red-500" />
                  <p className="text-lg font-bold">{member.high}</p>
                  <p className="text-[10px] uppercase text-slate-400">High</p>
                </div>
              </div>
              <a
                href={`mailto:${member.email}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Mail size={14} /> {member.email}
              </a>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
