'use client';

/**
 * /interests — My Investments / Saved Deals
 * Reads saved deals from Redux (persisted to localStorage).
 * Shows recommendation scores for saved deals.
 */

import { useEffect, useMemo, useState } from 'react';
import { Heart, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { removeDeal } from '@/store/savedDealsSlice';
import { fetchInvestors } from '@/store/investorSlice';
import { getRecommendedDeals } from '@/utils/scoring';
import { formatCompact, formatPercent, riskBadgeClass, industryIcon } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function InterestsPage() {
  const dispatch = useAppDispatch();
  const savedDeals = useAppSelector((s) => s.savedDeals.deals);
  const { investors } = useAppSelector((s) => s.investors);
  const { activeInvestorId } = useAppSelector((s) => s.ui);

  useEffect(() => { dispatch(fetchInvestors()); }, [dispatch]);

  const activeInvestor = useMemo(
    () => investors.find((i) => i.id === activeInvestorId),
    [investors, activeInvestorId]
  );

  const scoredDeals = useMemo(
    () => activeInvestor ? getRecommendedDeals(savedDeals, activeInvestor) : savedDeals.map((d) => ({ ...d, score: 0, matchReasons: [] })),
    [savedDeals, activeInvestor]
  );

  const totalInvestment = savedDeals.reduce((s, d) => s + d.investmentRequired, 0);
  const avgROI = savedDeals.length ? savedDeals.reduce((s, d) => s + d.roi, 0) / savedDeals.length : 0;

  if (savedDeals.length === 0) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-4xl">
        🔖
      </div>
      <h1 className="text-xl font-bold text-white">No Saved Deals Yet</h1>
      <p className="text-slate-400 max-w-sm">Browse deals and click the heart icon to save them to your watchlist.</p>
      <Link href="/deals" className="px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors">
        Explore Deals
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Heart size={22} className="text-rose-400" fill="currentColor" /> My Interests
        </h1>
        <p className="text-slate-400 text-sm mt-1">{savedDeals.length} saved deal{savedDeals.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Saved Deals', value: savedDeals.length, icon: <Heart size={18} className="text-rose-400" />, color: 'text-white' },
          { label: 'Total Investment Required', value: formatCompact(totalInvestment), icon: <DollarSign size={18} className="text-emerald-400" />, color: 'text-emerald-400' },
          { label: 'Average ROI', value: formatPercent(avgROI), icon: <TrendingUp size={18} className="text-amber-400" />, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-700/60 border border-slate-600/40">{s.icon}</div>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deal grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {scoredDeals.map((deal) => (
          <div key={deal.id} className="group relative rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 hover:border-violet-500/40 transition-all duration-300 flex flex-col gap-4">

            {/* Score badge */}
            {deal.score > 0 && (
              <div className="absolute top-4 right-12 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                ⭐ {deal.score}
              </div>
            )}

            {/* Remove button */}
            <button
              onClick={() => dispatch(removeDeal(deal.id))}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              aria-label="Remove from saved"
            >
              <Trash2 size={15} />
            </button>

            <div className="flex items-start gap-3 pr-16">
              <div className="w-10 h-10 rounded-xl bg-slate-700/80 flex items-center justify-center text-2xl border border-slate-600/40 shrink-0">
                {industryIcon(deal.industry)}
              </div>
              <div>
                <Link href={`/deals/${deal.id}`} className="font-bold text-white hover:text-violet-300 transition-colors block">
                  {deal.company}
                </Link>
                <span className={cn('text-xs px-2 py-0.5 rounded-full inline-block mt-0.5', riskBadgeClass(deal.risk))}>
                  {deal.risk} Risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">ROI</p>
                <p className="text-emerald-400 font-bold">{deal.roi}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Required</p>
                <p className="text-white font-semibold">{formatCompact(deal.investmentRequired)}</p>
              </div>
            </div>

            {deal.matchReasons.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {deal.matchReasons.slice(0, 2).map((r) => (
                  <span key={r} className="text-xs bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full border border-slate-600/40">{r}</span>
                ))}
              </div>
            )}

            <Link href={`/deals/${deal.id}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors mt-auto">
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
