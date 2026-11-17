import React from 'react';
import { Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function NotFoundPage() {
  const { navigate } = useApp();

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-[#5B4BFF]/10 text-[#5B4BFF] dark:text-[#9D94FF] flex items-center justify-center mx-auto">
        <Compass className="w-7 h-7" />
      </div>
      <p className="text-xs font-mono font-semibold text-[#5B4BFF] dark:text-[#9D94FF]">
        404 · Page not found
      </p>
      <h1 className="text-3xl font-display font-bold text-[#141413] dark:text-white">
        Looks like this study room moved
      </h1>
      <p className="text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed">
        The page or session link you requested isn’t available. Jump back to the homepage or browse verified student tutors.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('landing')}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]"
        >
          Back to Home
        </button>
        <button
          type="button"
          onClick={() => navigate('find-tutors')}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
        >
          Find Tutors
        </button>
      </div>
    </div>
  );
}
