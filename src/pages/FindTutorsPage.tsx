import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { peerLearnService } from '../services/peerLearnService';
import { SearchFilters } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterPanel } from '../components/ui/FilterPanel';
import { TutorCard } from '../components/ui/TutorCard';

const PAGE_SIZE = 6;

export function FindTutorsPage() {
  const {
    tutors,
    filters,
    setFilters,
    resetFilters,
    savedTutorIds,
    toggleSavedTutor,
    openTutorProfile,
    openBookingModal,
  } = useApp();

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loadingBrief, setLoadingBrief] = useState(false);

  const filteredTutors = useMemo(
    () => peerLearnService.filterAndSortTutors(tutors, filters),
    [tutors, filters]
  );

  useEffect(() => {
    setPage(1);
    setLoadingBrief(true);
    const t = window.setTimeout(() => setLoadingBrief(false), 140);
    return () => window.clearTimeout(t);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredTutors.length / PAGE_SIZE));
  const paginatedTutors = filteredTutors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Top Search / Sort Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
            Find a Peer Tutor
          </h1>
          <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400 tabular-nums">
            Showing {filteredTutors.length} verified & campus tutors
            {filters.subject !== 'All' ? ` for ${filters.subject}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#5F5D57] absolute left-3.5 top-3" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
              placeholder="Search name, college, topic..."
              aria-label="Search tutors"
              className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
            />
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as SearchFilters['sortBy'],
              }))
            }
            aria-label="Sort tutors"
            className="px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="rating">Sort: Highest rated</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="sessions">Most sessions</option>
          </select>

          <div className="hidden sm:flex items-center p-1 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-xl">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg ${
                layout === 'grid'
                  ? 'bg-[#5B4BFF] text-white'
                  : 'text-[#5F5D57] dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              aria-label="List view"
              className={`p-1.5 rounded-lg ${
                layout === 'list'
                  ? 'bg-[#5B4BFF] text-white'
                  : 'text-[#5F5D57] dark:text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-5 sticky top-24">
          <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} />
        </aside>

        <div className="lg:col-span-9 space-y-6">
          {loadingBrief ? (
            <div
              className={`grid gap-5 ${
                layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-60 rounded-2xl bg-stone-200/60 dark:bg-slate-800/60 animate-pulse border border-[#E6E4DF] dark:border-[#272B38]"
                />
              ))}
            </div>
          ) : paginatedTutors.length === 0 ? (
            <EmptyState
              title="No tutors match these filters"
              description="Try widening your hourly rate range, removing the college filter, or resetting to browse all 14 peer tutors."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          ) : (
            <>
              <div
                className={`grid gap-5 ${
                  layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {paginatedTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    layout={layout}
                    saved={savedTutorIds.includes(tutor.id)}
                    onToggleSave={toggleSavedTutor}
                    onViewProfile={openTutorProfile}
                    onBookSession={(id) => openBookingModal({ tutorId: id })}
                    onSubjectClick={(subj) =>
                      setFilters((prev) => ({ ...prev, subject: subj }))
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-[#E6E4DF] dark:border-[#272B38]">
                  <p className="text-xs text-[#5F5D57] dark:text-slate-400 tabular-nums">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPage(num)}
                        className={`w-8 h-8 text-xs font-semibold rounded-xl tabular-nums ${
                          num === page
                            ? 'bg-[#5B4BFF] text-white'
                            : 'bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] h-full overflow-y-auto bg-white dark:bg-[#171A23] p-5 border-r border-[#E6E4DF] dark:border-[#272B38]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6E4DF] dark:border-[#272B38]">
              <span className="font-display font-semibold text-base text-[#141413] dark:text-white">
                Filter Tutors
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} />
          </div>
        </div>
      )}
    </div>
  );
}
