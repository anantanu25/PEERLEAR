import React from 'react';

interface SubjectChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function SubjectChip({ label, active = false, onClick, size = 'sm' }: SubjectChipProps) {
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${sizeClass} rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors duration-150 border ${
          active
            ? 'bg-[#5B4BFF] text-white border-[#5B4BFF]'
            : 'bg-stone-100/80 dark:bg-slate-800/80 text-[#3E3D38] dark:text-slate-200 border-stone-200 dark:border-slate-700 hover:border-[#5B4BFF]/50 hover:text-[#5B4BFF] dark:hover:text-[#9D94FF]'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={`${sizeClass} rounded-lg font-medium whitespace-nowrap shrink-0 bg-stone-100 dark:bg-slate-800/90 text-[#3E3D38] dark:text-slate-300 border border-stone-200/80 dark:border-slate-700/80`}
    >
      {label}
    </span>
  );
}
