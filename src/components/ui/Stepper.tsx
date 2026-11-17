import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((label, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;
          return (
            <li key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold tabular-nums shrink-0 border transition-colors ${
                    completed
                      ? 'bg-[#5B4BFF] border-[#5B4BFF] text-white'
                      : active
                        ? 'bg-[#5B4BFF]/10 border-[#5B4BFF] text-[#5B4BFF] dark:text-[#9D94FF]'
                        : 'bg-stone-100 dark:bg-slate-800 border-stone-300 dark:border-slate-700 text-[#5F5D57] dark:text-slate-400'
                  }`}
                >
                  {completed ? <Check className="w-3.5 h-3.5" /> : index + 1}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                    active || completed
                      ? 'text-[#141413] dark:text-slate-100'
                      : 'text-[#5F5D57] dark:text-slate-500 hidden sm:inline'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mx-3 ${
                    completed ? 'bg-[#5B4BFF]' : 'bg-[#E6E4DF] dark:bg-[#272B38]'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
