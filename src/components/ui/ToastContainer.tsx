import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'error'
            ? AlertCircle
            : toast.type === 'info'
              ? Info
              : CheckCircle2;
        const iconColor =
          toast.type === 'error'
            ? 'text-red-500'
            : toast.type === 'warning'
              ? 'text-amber-500'
              : toast.type === 'info'
                ? 'text-[#5B4BFF] dark:text-[#9D94FF]'
                : 'text-emerald-600 dark:text-emerald-400';

        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 p-4 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl shadow-lg"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                {toast.title}
              </p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-[#5F5D57] dark:text-slate-400">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-md text-[#5F5D57] hover:text-[#141413] dark:text-slate-400 dark:hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
