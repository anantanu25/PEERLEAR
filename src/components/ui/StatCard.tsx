import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: 'default' | 'indigo' | 'amber' | 'emerald';
}

export function StatCard({ label, value, subtext, accent = 'default' }: StatCardProps) {
  const valueTone =
    accent === 'indigo'
      ? 'text-[#5B4BFF] dark:text-[#9D94FF]'
      : accent === 'amber'
        ? 'text-amber-600 dark:text-amber-400'
        : accent === 'emerald'
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-[#141413] dark:text-slate-100';

  return (
    <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-5">
      <p className="text-xs font-medium text-[#5F5D57] dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-display font-bold tabular-nums ${valueTone}`}>{value}</p>
      {subtext && (
        <p className="mt-1 text-xs text-[#5F5D57] dark:text-slate-400">{subtext}</p>
      )}
    </div>
  );
}
