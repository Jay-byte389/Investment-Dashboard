'use client';

/**
 * FilterBar.tsx
 * Multi-filter bar for the Deal Explorer.
 * Optimized for a premium white theme.
 */

import { useState, useCallback } from 'react';
import { X, Search, Filter, TrendingUp, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFilters, resetFilters } from '@/store/dealSlice';
import { RiskLevel } from '@/types/deal';
import { cn } from '@/utils/cn';

const INDUSTRIES = ['Tech', 'Healthcare', 'Finance', 'Agriculture', 'Education', 'Automobile', 'Real Estate', 'Energy'];
const RISK_LEVELS: RiskLevel[] = ['Low', 'Medium', 'High'];

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
}

export default function FilterBar({ searchValue, onSearchChange }: FilterBarProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.deals.filters);
  const [showFilters, setShowFilters] = useState(false);

  const handleClear = useCallback(() => {
    dispatch(resetFilters());
    onSearchChange('');
  }, [dispatch, onSearchChange]);

  const hasActiveFilters =
    !!filters.risk || !!filters.industry || (filters.minRoi ?? 0) > 0 || (filters.maxInvestment ?? 0) > 0 || !!searchValue;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search deals, companies, or industries..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm',
              showFilters
                ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 ring-2 ring-violet-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm" />
            )}
            <ChevronDown size={14} className={cn('transition-transform duration-300', showFilters && 'rotate-180')} />
          </button>

          <button
            onClick={handleClear}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm group"
            title="Clear all filters"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Industry Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  <SlidersHorizontal size={10} /> Industry
                </label>
                <select
                  value={filters.industry ?? 'All'}
                  onChange={(e) => dispatch(setFilters({ industry: e.target.value === 'All' ? undefined : e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all appearance-none cursor-pointer shadow-sm"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  <option value="All">All Industries</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {/* Risk Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  <TrendingUp size={10} /> Risk Level
                </label>
                <select
                  value={filters.risk ?? 'All'}
                  onChange={(e) => dispatch(setFilters({ risk: e.target.value === 'All' ? undefined : (e.target.value as RiskLevel) }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all appearance-none cursor-pointer shadow-sm"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  <option value="All">Any Risk</option>
                  {RISK_LEVELS.map((r) => <option key={r} value={r}>{r} Risk</option>)}
                </select>
              </div>

              {/* Min ROI Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min ROI</label>
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100 shadow-sm">{filters.minRoi ?? 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={filters.minRoi ?? 0}
                  onChange={(e) => dispatch(setFilters({ minRoi: +e.target.value }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 block mt-3"
                />
              </div>

              {/* Max Investment */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  Max Investment
                </label>
                <select
                  value={filters.maxInvestment ?? ''}
                  onChange={(e) => dispatch(setFilters({ maxInvestment: e.target.value ? +e.target.value : undefined }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all appearance-none cursor-pointer shadow-sm"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  <option value="">Any Amount</option>
                  <option value="30000">≤ $30K</option>
                  <option value="50000">≤ $50K</option>
                  <option value="75000">≤ $75K</option>
                  <option value="100000">≤ $100K</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
