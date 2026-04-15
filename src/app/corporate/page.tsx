'use client';

/**
 * /corporate — Corporate Dashboard
 * Funding metrics, investor breakdown, and trend chart.
 * Optimized for Premium White Theme.
 */

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Users, DollarSign, TrendingUp, BarChart3, Percent, ChevronRight, Globe, Download, Zap, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCorporateMetrics } from '@/store/investorSlice';
import { formatCompact, formatPercent } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import StatCard from '@/Components/StatCard';

const IndustryPieChart    = dynamic(() => import('@/Components/charts/IndustryPieChart'),    { ssr: false });
const CorporateTrendChart = dynamic(() => import('@/Components/charts/CorporateTrendChart'), { ssr: false });

// Generate simulated monthly trend for corporate view
function generateTrendData(totalInvestors: number, totalFunding: number) {
  return Array.from({ length: 8 }, (_, i) => {
    const factor = 0.5 + (i + 1) * 0.07;
    return {
      label: `Month ${i + 1}`,
      investors: Math.round(totalInvestors * factor),
      funding:   Math.round(totalFunding   * factor),
    };
  });
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
    <h3 className="text-[10px] font-black text-slate-400 border-b border-slate-50 pb-3 uppercase tracking-[0.2em] mb-6">{title}</h3>
    {children}
  </div>
);

export default function CorporatePage() {
  const dispatch = useAppDispatch();
  const { corporateMetrics, metricsLoading } = useAppSelector((s) => s.investors);

  useEffect(() => { dispatch(fetchCorporateMetrics()); }, [dispatch]);

  const trendData = useMemo(
    () => corporateMetrics
      ? generateTrendData(corporateMetrics.totalInvestors, corporateMetrics.totalFundingCommitted)
      : [],
    [corporateMetrics]
  );

  if (metricsLoading || !corporateMetrics) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4 text-slate-400 font-black uppercase tracking-widest text-xs">
      <Loader2 className="animate-spin text-violet-600" size={32} />
      <span>Assembling Insights...</span>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex border-l-4 border-violet-600 pl-6 items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Intelligence</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Aggregated institutional insights and ecosystem flow</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all">
             <Download size={16} /> Export Report
           </button>
        </div>
      </div>

      {/* High-level stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Investors"
          value={corporateMetrics.totalInvestors}
          subtitle="Active on platform"
          icon={<Users size={24} className="text-violet-600" />}
          gradient="bg-violet-50"
          trend="up" trendValue="+3 this month"
        />
        <StatCard
          title="Funding Committed"
          value={formatCompact(corporateMetrics.totalFundingCommitted)}
          subtitle="Total across platform"
          icon={<DollarSign size={24} className="text-emerald-600" />}
          gradient="bg-emerald-50"
          trend="up" trendValue="+12.4%"
        />
        <StatCard
          title="Avg. Budget"
          value={formatCompact(corporateMetrics.avgBudget)}
          subtitle="Per investor capacity"
          icon={<BarChart3 size={24} className="text-amber-600" />}
          gradient="bg-amber-50"
        />
        <StatCard
          title="Active Deals"
          value={corporateMetrics.totalActiveDeals}
          subtitle="In-progress assets"
          icon={<Zap size={24} className="text-indigo-600" />}
          gradient="bg-indigo-50"
        />
        <StatCard
          title="Success Rate"
          value={formatPercent(corporateMetrics.conversionRate)}
          subtitle="Lead → Commitment"
          icon={<Percent size={24} className="text-rose-600" />}
          gradient="bg-rose-50"
          trend={corporateMetrics.conversionRate >= 70 ? 'up' : 'neutral'}
        />
      </section>

      {/* Charts section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <ChartCard title="Platform Funding & participant Trends">
            <CorporateTrendChart data={trendData} />
          </ChartCard>
        </div>
        <div className="lg:col-span-2">
          <ChartCard title="Industry Interest Distribution">
            <IndustryPieChart data={corporateMetrics.industryInterest} />
          </ChartCard>
        </div>
      </section>

      {/* Risk Preference Breakdown */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 space-y-8">
        <h3 className="text-[10px] font-black text-slate-400 border-b border-slate-50 pb-3 uppercase tracking-[0.2em]">Risk Sentiment Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(corporateMetrics.riskBreakdown).map(([risk, count]) => {
            const pct = Math.round((count / corporateMetrics.totalInvestors) * 100);
            const classes: Record<string, string> = { 
              Low: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
              Medium: 'bg-amber-50 text-amber-600 border-amber-100', 
              High: 'bg-rose-50 text-rose-600 border-rose-100' 
            };
            const barColors: Record<string, string> = { Low: 'bg-emerald-500', Medium: 'bg-amber-500', High: 'bg-rose-500' };
            
            return (
              <div key={risk} className={cn("rounded-2xl border p-6 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow", classes[risk])}>
                <div className={cn("w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl font-black bg-white shadow-sm")}>
                  {count}
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-widest">{risk} Risk</p>
                  <p className="text-[10px] opacity-70 mt-1">{pct}% of investor pool</p>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden border border-white/20">
                  <div className={cn("h-full rounded-full transition-all duration-1000", barColors[risk])} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
