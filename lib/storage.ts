: 'use client';

import { Task } from './types';

const STORAGE_KEY = 'taskflow-tasks';

const demoData: Task[] = [
  { id: '1', title: 'Design system review', assignee: 'Alex', status: 'done', priority: 'medium', dueDate: '2026-06-20' },
  { id: '2', title: 'API integration', assignee: 'Maria', status: 'in-progress', priority: 'high', dueDate: '2026-06-25' },
  { id: '3', title: 'User onboarding flow', assignee: 'John', status: 'todo', priority: 'high', dueDate: '2026-06-28' },
  { id: '4', title: 'Write documentation', assignee: 'Alex', status: 'todo', priority: 'low', dueDate: '2026-06-30' },
  { id: '5', title: 'Fix navigation bug', assignee: 'Maria', status: 'in-progress', priority: 'medium', dueDate: '2026-06-26' },
];

export function getTasks(): Task[] {
  if (typeof window === 'undefined') return demoData;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : demoData;
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function resetDemo(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
}
