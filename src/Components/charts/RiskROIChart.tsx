'use client';

/**
 * charts/RiskROIChart.tsx
 * Bar chart showing deal count per risk level.
 * Optimized for Premium White Theme.
 */

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts';

const RISK_COLORS: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f43f5e',
};

interface Props {
  riskDistribution: { Low: number; Medium: number; High: number };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-slate-900 font-bold text-sm mb-1">{label} Risk</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS[label] }} />
        <p style={{ color: RISK_COLORS[label] }} className="text-xs font-bold uppercase tracking-tight">
          {payload[0].value} deals
        </p>
      </div>
    </div>
  );
};

export default function RiskROIChart({ riskDistribution }: Props) {
  const data = [
    { name: 'Low', value: riskDistribution.Low },
    { name: 'Medium', value: riskDistribution.Medium },
    { name: 'High', value: riskDistribution.High },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="40%">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          dx={-5}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', radius: 8 }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={RISK_COLORS[entry.name]} className="hover:opacity-80 transition-opacity cursor-pointer" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}