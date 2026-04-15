'use client';

/**
 * charts/IndustryPieChart.tsx
 * Pie chart showing deal distribution across industries.
 * Optimized for Premium White Theme.
 */

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8b5cf6','#6366f1','#10b981','#f59e0b','#3b82f6','#ec4899','#14b8a6','#f97316'];

interface Props {
  data: Record<string, number>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-slate-900 font-bold text-sm mb-1">{payload[0].name}</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
        <p className="text-slate-600 text-xs font-semibold">{payload[0].value} deals</p>
      </div>
    </div>
  );
};

export default function IndustryPieChart({ data }: Props) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" cy="50%"
          innerRadius={75} outerRadius={105}
          paddingAngle={4}
          dataKey="value"
          stroke="transparent"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: 20 }}
          formatter={(value) => <span className="text-slate-500 font-bold text-[11px] uppercase tracking-tighter ml-1">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
