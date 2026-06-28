import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
  };
  const styles = {
    primary: 'bg-primary text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700',
    danger: 'bg-danger text-white shadow-sm shadow-red-200 hover:bg-red-700',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
    ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
  };
  return (
    <button className={`${base} ${sizes[size]} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
