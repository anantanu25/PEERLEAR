import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div
      className="inline-flex flex-wrap items-center gap-1 p-1 bg-stone-100 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] rounded-xl"
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors duration-150 ${
              active
                ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                : 'text-[#5F5D57] dark:text-slate-400 hover:text-[#141413] dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`ml-1.5 text-xs tabular-nums ${
                  active
                    ? 'text-[#5B4BFF] dark:text-[#9D94FF]'
                    : 'text-[#5F5D57] dark:text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
