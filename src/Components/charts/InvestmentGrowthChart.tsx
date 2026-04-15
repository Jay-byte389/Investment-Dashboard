'use client';

/**
 * charts/InvestmentGrowthChart.tsx
 * Line chart showing cumulative funding raised over time.
 * Optimized for Premium White Theme.
 */

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { formatMonth, formatCompact } from '@/utils/formatters';

interface DataPoint {
  month: string;
  amount: number;
  cumulative: number;
}

interface Props { data: DataPoint[] }

// Custom tooltip for light mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">{formatMonth(label)}</p>
      <div className="space-y-1">
        <p className="text-violet-600 text-sm font-bold flex justify-between gap-4">
          <span className="text-slate-400 font-medium">Monthly:</span> {formatCompact(payload[0]?.value ?? 0)}
        </p>
        <p className="text-emerald-600 text-sm font-bold flex justify-between gap-4">
          <span className="text-slate-400 font-medium">Cumulative:</span> {formatCompact(payload[1]?.value ?? 0)}
        </p>
      </div>
    </div>
  );
};

export default function InvestmentGrowthChart({ data }: Props) {
  const formatted = data.map((d) => ({ ...d, monthLabel: formatMonth(d.month) }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis 
          dataKey="monthLabel" 
          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
          axisLine={false} 
          tickLine={false} 
          dy={10}
        />
        <YAxis
          tickFormatter={(v) => formatCompact(v)}
          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          axisLine={false} 
          tickLine={false}
          dx={-5}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingBottom: 20 }}
          formatter={(value) => <span className="text-slate-500 uppercase tracking-tighter ml-1">{value === 'amount' ? 'Monthly Raised' : 'Cumulative'}</span>}
        />
        <Area 
          type="monotone" 
          dataKey="amount" 
          name="amount"
          stroke="#8b5cf6" 
          strokeWidth={3} 
          fill="url(#colorAmount)" 
          dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Area 
          type="monotone" 
          dataKey="cumulative" 
          name="cumulative"
          stroke="#10b981" 
          strokeWidth={3} 
          fill="url(#colorCumulative)" 
          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}