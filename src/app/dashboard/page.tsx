'use client';

/**
 * /dashboard — Investor Dashboard
 * Shows summary metrics, charts, and top recommended deals.
 */

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { TrendingUp, DollarSign, BarChart2, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchDashboardMetrics, fetchGrowthData } from '@/store/dealSlice';
import { fetchInvestors } from '@/store/investorSlice';
import { getRecommendedDeals } from '@/utils/scoring';
import { formatCompact, formatPercent } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import StatCard from '@/Components/StatCard';
import DealCard from '@/Components/DealCard';

// Lazy-load heavy chart components
const InvestmentGrowthChart = dynamic(() => import('@/Components/charts/InvestmentGrowthChart'), { ssr: false });
const IndustryPieChart      = dynamic(() => import('@/Components/charts/IndustryPieChart'),      { ssr: false });
const RiskROIChart          = dynamic(() => import('@/Components/charts/RiskROIChart'),           { ssr: false });

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
    <h3 className="text-[10px] font-black text-slate-400 border-b border-slate-50 pb-3 uppercase tracking-[0.2em] mb-6">{title}</h3>
    {children}
  </div>
);

const LoadingPulse = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-slate-100 rounded w-1/3" />
    <div className="h-8 bg-slate-100 rounded w-2/3" />
  </div>
);

export default function DashboardPage() {
  const dispatch   = useAppDispatch();
  const { metrics, growthData, metricsLoading } = useAppSelector((s) => s.deals);
  const { investors }   = useAppSelector((s) => s.investors);
  const { activeInvestorId } = useAppSelector((s) => s.ui);
  const savedDeals = useAppSelector((s) => s.savedDeals.deals);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
    dispatch(fetchGrowthData());
    dispatch(fetchInvestors());
  }, [dispatch]);

  const activeInvestor = useMemo(
    () => investors.find((i) => i.id === activeInvestorId),
    [investors, activeInvestorId]
  );

  // Load all deals for recommendations directly
  const [allDeals, setAllDeals] = useState<import('@/types/deal').Deal[]>([]);
  useEffect(() => {
    import('@/Services/dealService').then(({ getDeals }) =>
      getDeals({ limit: 100, page: 1 }).then((r) => setAllDeals(r.data))
    );
  }, []);

  const recommendations = useMemo(
    () => (activeInvestor && allDeals.length ? getRecommendedDeals(allDeals, activeInvestor).slice(0, 3) : []),
    [activeInvestor, allDeals]
  );

  return (
    <div className="space-y-10">

      {/* Page header */}
      <div className="flex flex-col gap-1 border-l-4 border-violet-600 pl-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Investment Dashboard</h1>
        <p className="text-slate-500 text-sm font-medium">
          Welcome back, <span className="text-violet-600 font-bold">{activeInvestor?.name ?? 'Amit Shah'}</span>
          {' '}· {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {metricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <LoadingPulse />
            </div>
          ))
        ) : metrics ? (
          <>
            <StatCard
              title="Total Active Deals"
              value={metrics.totalDeals}
              subtitle="Across all industries"
              icon={<BarChart2 size={24} className="text-violet-600" />}
              gradient="bg-violet-50"
              trend="up" trendValue="+12%"
            />
            <StatCard
              title="Total Funding Raised"
              value={formatCompact(metrics.totalFundingRaised)}
              subtitle="Committed across all deals"
              icon={<DollarSign size={24} className="text-emerald-600" />}
              gradient="bg-emerald-50"
              trend="up" trendValue="+8.3%"
            />
            <StatCard
              title="Average ROI"
              value={formatPercent(metrics.avgROI)}
              subtitle="Portfolio average return"
              icon={<TrendingUp size={24} className="text-amber-600" />}
              gradient="bg-amber-50"
              trend="up" trendValue="+2.1%"
            />
            <StatCard
              title="Saved Deals"
              value={savedDeals.length}
              subtitle="In your watchlist"
              icon={<ShieldCheck size={24} className="text-rose-600" />}
              gradient="bg-rose-50"
              trend="neutral"
            />
          </>
        ) : null}
      </section>

      {/* Charts Row 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartCard title="Capital Accumulation Trend">
            {growthData.length > 0
              ? <InvestmentGrowthChart data={growthData} />
              : <div className="h-[280px] flex items-center justify-center text-slate-400">Loading chart…</div>
            }
          </ChartCard>
        </div>
        <ChartCard title="Sector Distribution">
          {metrics
            ? <IndustryPieChart data={metrics.industryDistribution} />
            : <div className="h-[280px] flex items-center justify-center text-slate-400">Loading…</div>
          }
        </ChartCard>
      </section>

      {/* Charts Row 2 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartCard title="Risk Tier Allocation">
          {metrics
            ? <RiskROIChart riskDistribution={metrics.riskDistribution} />
            : <div className="h-[280px] flex items-center justify-center text-slate-400">Loading…</div>
          }
        </ChartCard>

        {/* Risk breakdown text summary */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
          <h3 className="text-[10px] font-black text-slate-400 border-b border-slate-50 pb-3 uppercase tracking-[0.2em] mb-8">Performance Summary</h3>
          {metrics ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full content-center">
              {[
                { label: 'Low Risk', value: metrics.riskDistribution.Low, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', desc: 'Secure capital preservation' },
                { label: 'Medium Risk', value: metrics.riskDistribution.Medium, color: 'bg-amber-50 text-amber-600 border-amber-100', desc: 'Balanced growth focus' },
                { label: 'High Risk', value: metrics.riskDistribution.High, color: 'bg-rose-50 text-rose-600 border-rose-100', desc: 'Aggressive upside potential' },
              ].map((r) => (
                <div key={r.label} className={cn("flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow", r.color)}>
                  <p className="font-black text-3xl">{r.value}</p>
                  <div className="text-center">
                    <span className="font-bold text-xs uppercase tracking-widest">{r.label}</span>
                    <p className="text-[10px] opacity-70 mt-1 max-w-[100px]">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <LoadingPulse />}
        </div>
      </section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="pt-4">
          <div className="flex items-end justify-between mb-8 border-b-2 border-slate-50 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Smart Matches</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Personalized opportunities based on your strategy</p>
            </div>
            <Link href="/deals" className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-widest">
              Explore All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((deal) => (
              <DealCard key={deal.id} deal={deal} score={deal.score} matchReasons={deal.matchReasons} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
