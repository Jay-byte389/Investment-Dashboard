'use client';

/**
 * /deals/[id] — Deal Detail Page
 * Tabs: Overview, Financials, Risk Analysis.
 * Optimized for Premium White Theme.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, Heart, Building2, TrendingUp, DollarSign,
  Users, Calendar, ShieldCheck, ChevronRight, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { getDealById } from '@/Services/dealService';
import { Deal } from '@/types/deal';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleSaved } from '@/store/savedDealsSlice';
import {
  riskBadgeClass, industryIcon, formatCompact, formatPercent,
  formatDate, fundingProgress, riskColor
} from '@/utils/formatters';
import { cn } from '@/utils/cn';

const InvestmentGrowthChart = dynamic(() => import('@/Components/charts/InvestmentGrowthChart'), { ssr: false });

// Generate simulated ROI projection data for this deal
function generateROIProjection(deal: Deal) {
  return Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const factor = 1 + (deal.roi / 100) * (i + 1);
    const invested = deal.fundingRaised;
    return {
      month: `${year}`,
      amount:     Math.round(invested * (factor - 1)),
      cumulative: Math.round(invested * factor),
    };
  });
}

const TABS = ['Overview', 'Financials', 'Risk Analysis'] as const;
type Tab = typeof TABS[number];

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector((s) => s.savedDeals.deals.some((d) => d.id === +id));

  const [deal, setDeal]     = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [tab, setTab]       = useState<Tab>('Overview');

  useEffect(() => {
    setLoading(true);
    getDealById(+id)
      .then(setDeal)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4 text-slate-400 font-black uppercase tracking-widest text-xs">
      <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      <span>Fetching Deep Insights...</span>
    </div>
  );

  if (error || !deal) return (
    <div className="text-center py-40">
      <p className="text-7xl mb-6 grayscale opacity-20">🔍</p>
      <h2 className="text-2xl font-black text-slate-900">Opportunity Not Found</h2>
      <button onClick={() => router.push('/deals')} className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
        ← Return to Explorer
      </button>
    </div>
  );

  const progress    = fundingProgress(deal.fundingRaised, deal.investmentRequired);
  const roiProjection = generateROIProjection(deal);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back
        </button>
        <button
          onClick={() => dispatch(toggleSaved(deal))}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm',
            isSaved
              ? 'border-rose-200 bg-rose-50 text-rose-600 shadow-rose-100'
              : 'border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 bg-white'
          )}
        >
          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          {isSaved ? 'Saved to Interests' : 'Save opportunity'}
        </button>
      </div>

      {/* Hero Header Section */}
      <div className="relative rounded-[2.5rem] bg-white border border-slate-200 p-8 md:p-12 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 opacity-[0.03] rounded-full -mr-32 -mt-32" />
        
        <div className="relative flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-5xl shrink-0 shadow-inner">
            {industryIcon(deal.industry)}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{deal.company}</h1>
              <span className={cn('text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border shadow-sm', riskBadgeClass(deal.risk))}>
                {deal.risk} Risk
              </span>
            </div>
            <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
              {deal.description || `A premium investment opportunity in the ${deal.industry} sector with a projected ${deal.roi}% ROI.`}
            </p>
            <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-violet-500" /> Listed {formatDate(deal.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Building2 size={16} className="text-violet-500" /> {deal.industry}</span>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 shrink-0 w-full lg:w-48">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center shadow-sm">
              <p className="text-2xl font-black text-emerald-600 leading-none">{formatPercent(deal.roi)}</p>
              <p className="text-[10px] uppercase font-bold text-emerald-600/60 tracking-widest mt-1">Expected ROI</p>
            </div>
            <div className="bg-violet-50 border border-violet-100 p-4 rounded-2xl text-center shadow-sm">
              <p className="text-2xl font-black text-violet-600 leading-none">{formatCompact(deal.investmentRequired)}</p>
              <p className="text-[10px] uppercase font-bold text-violet-600/60 tracking-widest mt-1">Capital Goal</p>
            </div>
          </div>
        </div>

        {/* Funding Bar */}
        <div className="mt-12 space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Commitment</p>
               <p className="text-2xl font-black text-slate-900">{formatCompact(deal.fundingRaised)} <span className="text-slate-400 text-sm font-bold">/ {formatCompact(deal.investmentRequired)}</span></p>
            </div>
            <span className="text-3xl font-black text-violet-600 tracking-tighter">{progress}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
            <span>Minimum Entry: $10,000</span>
            <span>{deal.investorCount} Participants active</span>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pt-4">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300',
                tab === t 
                  ? 'bg-violet-600 text-white shadow-xl shadow-violet-200 -translate-y-1' 
                  : 'bg-white text-slate-400 border border-transparent hover:bg-slate-50 hover:text-slate-600'
              )}
            >
              {t}
              {tab === t && <ChevronRight size={18} />}
            </button>
          ))}
          <div className="mt-8 p-6 rounded-3xl bg-amber-50 border border-amber-100 text-amber-900 space-y-3">
             <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" /> <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Limited Capacity</span></div>
             <p className="text-xs font-bold leading-relaxed">This deal is currently 85% subscribed. Final commitments close in 4 days.</p>
          </div>
        </div>

        {/* Dynamic Panel */}
        <div className="lg:col-span-3">
           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-sm min-h-[500px]">
              
              {tab === 'Overview' && (
                <div className="space-y-10">
                  <div className="flex items-center gap-3 mb-8">
                     <Building2 className="text-violet-600" size={24} />
                     <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Key Deal Vitials</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { icon: <Building2 size={18} />, label: 'Sector / Vertical', value: deal.industry, color: 'text-violet-600' },
                      { icon: <ShieldCheck size={18} />, label: 'Risk Rating', value: deal.risk, color: riskColor(deal.risk) },
                      { icon: <TrendingUp size={18} />, label: 'Target Yield', value: `${deal.roi}%`, color: 'text-emerald-600' },
                      { icon: <DollarSign size={18} />, label: 'Subscription Goal', value: formatCompact(deal.investmentRequired), color: 'text-amber-600' },
                      { icon: <Users size={18} />, label: 'LP Count', value: deal.investorCount, color: 'text-indigo-600' },
                      { icon: <Calendar size={18} />, label: 'Lifecycle Stage', value: 'Seed A (Listing)', color: 'text-slate-500' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-violet-200 transition-all group">
                        <div className={cn("p-3 rounded-xl bg-white shadow-sm border border-slate-100 transition-transform group-hover:scale-110", item.color)}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                          <p className="text-slate-900 font-bold text-base">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'Financials' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <DollarSign className="text-emerald-600" size={24} />
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Yield Projections</h2>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-200">Simulated Data</span>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <InvestmentGrowthChart data={roiProjection} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {roiProjection.map((p, i) => (
                      <div key={p.month} className="rounded-2xl bg-white border border-slate-100 p-5 text-center shadow-sm hover:border-emerald-200 transition-colors">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Year {i+1}</p>
                        <p className="text-slate-900 font-black text-lg leading-none">{formatCompact(p.cumulative)}</p>
                        <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold mt-2">
                           <ArrowUpRight size={10} />
                           <span className="text-[10px]">{formatCompact(p.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'Risk Analysis' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-600 font-medium">
                  <div className="flex items-center gap-3">
                     <AlertTriangle className="text-amber-500" size={24} />
                     <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Vulnerability Matrix</h2>
                  </div>

                  <div className="space-y-8">
                    {[
                      { label: 'Market Volatility', score: deal.risk === 'High' ? 85 : deal.risk === 'Medium' ? 55 : 30, color: 'bg-rose-500', icon: '📈' },
                      { label: 'Liquidity Depth', score: deal.risk === 'High' ? 75 : deal.risk === 'Medium' ? 40 : 20, color: 'bg-amber-500', icon: '💧' },
                      { label: 'Platform Execution Risk', score: 100 - progress, color: 'bg-violet-500', icon: '⚙️' },
                      { label: 'Target Success Probability', score: 95 - (deal.roi / 2), color: 'bg-emerald-500', icon: '🎯' },
                    ].map((r) => (
                      <div key={r.label} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <span className="text-xl">{r.icon}</span>
                             <span className="font-bold text-slate-700">{r.label}</span>
                          </div>
                          <span className="text-lg font-black text-slate-900 leading-none">{r.score}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex p-0.5">
                          <div className={cn("h-full rounded-full transition-all duration-1000", r.color)} style={{ width: `${r.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={cn('rounded-3xl p-8 border-2 shadow-sm relative overflow-hidden',
                    deal.risk === 'Low' ? 'border-emerald-100 bg-emerald-50/30' :
                    deal.risk === 'Medium' ? 'border-amber-100 bg-amber-50/30' :
                    'border-rose-100 bg-rose-50/30'
                  )}>
                    {/* Background icon decoration */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-8xl opacity-10 grayscale">
                      {deal.risk === 'Low' ? '🛡️' : deal.risk === 'Medium' ? '⚖️' : '🚨'}
                    </div>
                    
                    <div className="relative z-10">
                      <h4 className={cn('text-lg font-black uppercase tracking-tight mb-4', riskColor(deal.risk))}>
                        Institutional Policy Verdict
                      </h4>
                      <p className="text-slate-600 leading-relaxed max-w-xl">
                        {deal.risk === 'Low' && 'Platform Audit suggests significant factor margin. Historical data consistently indicates resilient performance across cycles. Ideal for low-volatility portfolio segments.'}
                        {deal.risk === 'Medium' && 'Performance correlates moderately with macro-sector shifts. Risk mitigated by high tangible asset backing and secondary market liquidity.'}
                        {deal.risk === 'High' && 'Extreme upside potential necessitates sophisticated risk management. Exposure should be capped at 5-8% of total portfolio assets.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
