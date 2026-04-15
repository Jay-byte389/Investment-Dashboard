'use client';

/**
 * StatCard.tsx — Reusable metric summary card with animated counter and trend indicator.
 */

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  gradient?: string;
  className?: string;
}

export default function StatCard({
  title, value, subtitle, icon, trend, trendValue, gradient, className,
}: StatCardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400';

  return (
    <div className={cn(
      'relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
      'hover:border-violet-200 hover:shadow-md transition-all duration-300 group overflow-hidden',
      className
    )}>
      {/* Gradient glow */}
      {gradient && (
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${gradient} rounded-2xl`} />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient ?? 'bg-slate-50'} border border-slate-100`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
