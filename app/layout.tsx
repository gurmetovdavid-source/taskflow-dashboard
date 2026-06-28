import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow Dashboard',
  description: 'Task and project management dashboard for teams',
};

const nav = [
  { href: '/', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/team', label: 'Team' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">TF</span>
              TaskFlow
            </Link>
            <nav className="flex items-center gap-1">
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      {label}
    </Link>
  );
}
