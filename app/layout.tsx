import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { LayoutDashboard, FolderKanban, ListChecks, Users } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TaskFlow Dashboard',
  description: 'Task and project management dashboard for teams',
};

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/team', label: 'Team', icon: Users },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <div className="flex min-h-screen">
          <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="text-sm font-bold">TF</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">TaskFlow</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
              ))}
            </nav>
            <div className="border-t border-slate-100 p-4">
              <p className="text-xs leading-relaxed text-slate-400">
                Portfolio demo — data is stored locally in your browser.
              </p>
            </div>
          </aside>
          <main className="ml-64 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
    >
      <Icon size={18} className="transition-colors group-hover:text-primary" />
      {label}
    </Link>
  );
}
