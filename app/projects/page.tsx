'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Project } from '@/lib/types';
import { getProjects, saveProjects } from '@/lib/storage';
import { Plus, Trash2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setProjects(getProjects());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveProjects(projects);
  }, [projects, loaded]);

  const addProject = () => {
    if (!name.trim()) return;
    const project: Project = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || 'No description',
      progress: 0,
    };
    setProjects((prev) => [project, ...prev]);
    setName('');
    setDescription('');
  };

  const updateProgress = (id: string, progress: number) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, progress } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (!loaded) return null;

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">Manage projects and track overall progress</p>
        </header>

        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mt-4">
            <Button onClick={addProject}>
              <Plus size={16} className="mr-2" /> Add project
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between">
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <CardTitle>{project.name}</CardTitle>
                  <button onClick={() => deleteProject(project.id)} className="text-slate-400 hover:text-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="mb-4 text-sm text-slate-500">{project.description}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={project.progress}
                  onChange={(e) => updateProgress(project.id, parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
