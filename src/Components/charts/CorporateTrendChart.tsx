'use client';

/**
 * charts/CorporateTrendChart.tsx
 * Line chart of investor count / funding trend for Corporate dashboard.
 * Optimized for Premium White Theme.
 */

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { formatCompact } from '@/utils/formatters';

interface DataPoint {
  label: string;
  investors: number;
  funding: number;
}

interface Props { data: DataPoint[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-bold text-sm flex justify-between gap-4">
          <span className="text-slate-500 font-medium">{p.name}:</span>
          {p.dataKey === 'funding' ? formatCompact(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function CorporateTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis 
          dataKey="label" 
          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
          axisLine={false} 
          tickLine={false} 
          dy={10}
        />
        <YAxis 
          yAxisId="left"  
          tick={{ fill: '#94a3b8', fontSize: 11 }} 
          axisLine={false} 
          tickLine={false} 
          dx={-5}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          tickFormatter={(v) => formatCompact(v)} 
          tick={{ fill: '#94a3b8', fontSize: 11 }} 
          axisLine={false} 
          tickLine={false} 
          dx={5}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          align="right" 
          wrapperStyle={{ paddingBottom: 20 }}
          formatter={(v) => <span className="text-slate-500 text-[11px] font-bold uppercase tracking-tighter ml-1">{v}</span>} 
        />
        <Line 
          yAxisId="left"  
          type="monotone" 
          dataKey="investors" 
          name="Investors" 
          stroke="#8b5cf6" 
          strokeWidth={3} 
          dot={{ fill: '#8b5cf6', r: 4, stroke: '#fff', strokeWidth: 2 }} 
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="funding" 
          name="Funding" 
          stroke="#10b981" 
          strokeWidth={3} 
          dot={{ fill: '#10b981', r: 4, stroke: '#fff', strokeWidth: 2 }} 
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
