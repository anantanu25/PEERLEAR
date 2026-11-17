import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl">
      <div className="w-12 h-12 rounded-2xl bg-[#5B4BFF]/10 text-[#5B4BFF] dark:text-[#9D94FF] flex items-center justify-center mb-4">
        {icon || <BookOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-display font-semibold text-[#141413] dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#5F5D57] dark:text-slate-400 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 text-sm font-medium rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] transition-colors whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
