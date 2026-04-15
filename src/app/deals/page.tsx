'use client';

/**
 * /deals — Deal Explorer
 * Debounced search + multi-filter + pagination + deal grid.
 */

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchDeals, setFilters, setPage } from '@/store/dealSlice';
import { useDebounce } from '@/hooks/useDebounce';
import FilterBar from '@/Components/FilterBar';
import DealCard from '@/Components/DealCard';
import { Loader2, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function DealsPage() {
  const dispatch = useAppDispatch();
  const { deals, total, totalPages, currentPage, loading, filters } = useAppSelector((s) => s.deals);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync debounced search to Redux filters
  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // Fetch whenever filters or page change
  useEffect(() => {
    dispatch(fetchDeals(filters));
  }, [filters, dispatch]);

  const handlePageChange = useCallback((p: number) => {
    dispatch(setPage(p));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex border-l-4 border-violet-600 pl-6 items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Deal Explorer</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {loading ? 'Analyzing dataset...' : `Showing ${total} premium opportunities`}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-2.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600')}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-2.5 rounded-lg transition-all', viewMode === 'list' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600')}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filter Bar container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <FilterBar searchValue={searchInput} onSearchChange={setSearchInput} />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">
          <Loader2 className="animate-spin text-violet-600" size={32} />
          <span>Refreshing Opportunities...</span>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-3xl">
          <p className="text-6xl mb-6 grayscale opacity-20">🔎</p>
          <p className="text-xl font-black text-slate-900">No deals match your criteria</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">Try broadening your search or resetting all filters.</p>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
        )}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-violet-600 hover:border-violet-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl shadow-inner border border-slate-200/50">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-slate-400 font-bold">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className={cn(
                      'w-10 h-10 rounded-xl text-xs font-black transition-all',
                      currentPage === p
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                        : 'text-slate-500 hover:text-slate-900'
                    )}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-violet-600 hover:border-violet-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
