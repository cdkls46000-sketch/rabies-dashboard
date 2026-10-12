'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LabSummary {
  positive: number;
  positivePercent: number;
  negative: number;
  negativePercent: number;
  pending: number;
  pendingPercent: number;
}

interface LabResultsChartProps {
  data: LabSummary;
}

const COLORS = {
  positive: '#ef4444',
  negative: '#22c55e',
  pending: '#eab308'
};

export function LabResultsChart({ data }: LabResultsChartProps) {
  const chartData = [
    { name: 'ผลบวก', value: data.positive, color: COLORS.positive },
    { name: 'ผลลบ', value: data.negative, color: COLORS.negative },
    { name: 'รอผล Lab', value: data.pending, color: COLORS.pending }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
