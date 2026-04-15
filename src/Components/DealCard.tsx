'use client';

/**
 * DealCard.tsx
 * Displays a deal's key info. Used in /deals and /interests.
 * Business logic (save/unsave) delegated to Redux.
 */

import Link from 'next/link';
import { Heart, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Deal } from '@/types/deal';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleSaved } from '@/store/savedDealsSlice';
import {
  riskBadgeClass, industryIcon, formatCompact,
  fundingProgress, formatDate
} from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface DealCardProps {
  deal: Deal;
  score?: number;
  matchReasons?: string[];
}

export default function DealCard({ deal, score, matchReasons }: DealCardProps) {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector((s) => s.savedDeals.deals.some((d) => d.id === deal.id));
  const progress = fundingProgress(deal.fundingRaised, deal.investmentRequired);

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-5 hover:border-violet-200 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 overflow-hidden">
      {/* Score badge */}
      {score !== undefined && (
        <div className="absolute top-4 right-12 flex items-center gap-1 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          ⭐ {score}
        </div>
      )}

      {/* Save button */}
      <button
        onClick={() => dispatch(toggleSaved(deal))}
        aria-label={isSaved ? 'Unsave deal' : 'Save deal'}
        className={cn(
          'absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200',
          isSaved
            ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
            : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
        )}
      >
        <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 pr-16">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
          {industryIcon(deal.industry)}
        </div>
        <div className="min-w-0">
          <Link
            href={`/deals/${deal.id}`}
            className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors truncate block text-base"
          >
            {deal.company}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block border', riskBadgeClass(deal.risk))}>
              {deal.risk}
            </span>
            <span className="text-xs text-slate-500">{deal.industry}</span>
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-50">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            <TrendingUp size={11} /> ROI
          </div>
          <span className="text-emerald-600 font-bold text-sm">{deal.roi}%</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            <DollarSign size={11} /> Required
          </div>
          <span className="text-slate-900 font-bold text-sm">{formatCompact(deal.investmentRequired)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            <Users size={11} /> Investors
          </div>
          <span className="text-slate-900 font-bold text-sm">{deal.investorCount}</span>
        </div>
      </div>

      {/* Funding progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-500">Progress</span>
          <span className="text-violet-600">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>{formatCompact(deal.fundingRaised)} raised</span>
          <span>Goal: {formatCompact(deal.investmentRequired)}</span>
        </div>
      </div>

      {/* Match reasons / Description */}
      {matchReasons && matchReasons.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {matchReasons.slice(0, 2).map((r) => (
            <span key={r} className="text-[10px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-full border border-slate-100 font-medium">
              {r}
            </span>
          ))}
        </div>
      ) : deal.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
          {deal.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{formatDate(deal.createdAt)}</span>
        <Link
          href={`/deals/${deal.id}`}
          className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
        >
          View Details <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}

const ArrowUpRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l10-10M7 7h10v10"/></svg>
);
