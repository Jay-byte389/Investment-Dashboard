"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "PropTech", value: 20 },
  { name: "CleanTech", value: 18 },
  { name: "HealthTech", value: 18 },
  { name: "Cybersecurity", value: 16 },
  { name: "SaaS", value: 13 }
];

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export default function IndustryChart() {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border">
      <h2 className="font-semibold mb-4">Industry Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
