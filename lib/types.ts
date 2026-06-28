export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
}
