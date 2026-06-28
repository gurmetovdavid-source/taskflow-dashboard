import { SelectHTMLAttributes } from 'react';

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
      {...props}
    />
  );
}
