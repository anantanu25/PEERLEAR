import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ALL_LANGUAGES, ALL_SUBJECTS, COLLEGES } from '../../data/mockData';
import { SearchFilters } from '../../types';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onReset: () => void;
}

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const YEARS = ['All', '2nd Year', '3rd Year', '4th Year', 'Masters', 'PhD'];

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-display font-semibold text-[#141413] dark:text-slate-100">
          Filters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B4BFF] dark:text-[#9D94FF] hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset all
        </button>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="filter-subject"
          className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2"
        >
          Subject
        </label>
        <select
          id="filter-subject"
          value={filters.subject}
          onChange={(e) => update('subject', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
        >
          <option value="All">All subjects</option>
          {ALL_SUBJECTS.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      {/* College */}
      <div>
        <label
          htmlFor="filter-college"
          className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2"
        >
          College
        </label>
        <select
          id="filter-college"
          value={filters.college}
          onChange={(e) => update('college', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
        >
          <option value="All">All colleges</option>
          {COLLEGES.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Max hourly price */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="filter-price"
            className="text-xs font-medium text-[#5F5D57] dark:text-slate-400"
          >
            Max hourly rate
          </label>
          <span className="text-xs font-mono font-semibold text-[#141413] dark:text-slate-100 tabular-nums">
            ${filters.maxPrice}/hr
          </span>
        </div>
        <input
          id="filter-price"
          type="range"
          min={8}
          max={35}
          step={1}
          value={filters.maxPrice}
          onChange={(e) => update('maxPrice', Number(e.target.value))}
          className="w-full accent-[#5B4BFF] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#5F5D57] dark:text-slate-500 tabular-nums mt-1">
          <span>$8</span>
          <span>$35+</span>
        </div>
      </div>

      {/* Session mode */}
      <div>
        <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
          Session mode
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {(['all', 'online', 'offline'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => update('mode', m)}
              className={`py-2 px-2 rounded-xl text-xs font-medium capitalize border transition-colors ${
                filters.mode === m
                  ? 'bg-[#5B4BFF] text-white border-[#5B4BFF]'
                  : 'bg-white dark:bg-[#1E222E] text-[#3E3D38] dark:text-slate-300 border-[#E6E4DF] dark:border-[#272B38]'
              }`}
            >
              {m === 'all' ? 'Both' : m === 'offline' ? 'Campus' : 'Online'}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum rating */}
      <div>
        <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
          Minimum rating
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Any', value: 0 },
            { label: '4.8+', value: 4.8 },
            { label: '4.9+', value: 4.9 },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => update('minRating', opt.value)}
              className={`py-2 px-2 rounded-xl text-xs font-medium tabular-nums border transition-colors ${
                filters.minRating === opt.value
                  ? 'bg-[#5B4BFF] text-white border-[#5B4BFF]'
                  : 'bg-white dark:bg-[#1E222E] text-[#3E3D38] dark:text-slate-300 border-[#E6E4DF] dark:border-[#272B38]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Day */}
      <div>
        <label
          htmlFor="filter-day"
          className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2"
        >
          Available on
        </label>
        <select
          id="filter-day"
          value={filters.availabilityDay}
          onChange={(e) => update('availabilityDay', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d === 'All' ? 'Any day' : d}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div>
        <label
          htmlFor="filter-lang"
          className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2"
        >
          Language
        </label>
        <select
          id="filter-lang"
          value={filters.language}
          onChange={(e) => update('language', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
        >
          <option value="All">Any language</option>
          {ALL_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Year of Study */}
      <div>
        <label
          htmlFor="filter-year"
          className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2"
        >
          Tutor year of study
        </label>
        <select
          id="filter-year"
          value={filters.yearOfStudy}
          onChange={(e) => update('yearOfStudy', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y === 'All' ? 'Any year' : y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
