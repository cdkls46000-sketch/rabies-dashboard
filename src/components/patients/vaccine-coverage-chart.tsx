'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VaccineCoverageChartProps {
  data: {
    dose: string;
    percentage: number;
  }[];
}

export function VaccineCoverageChart({ data }: VaccineCoverageChartProps) {
  return (
    <ResponsiveContainer width="100%" height={290}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="dose" tick={{ fontSize: 12, fill: '#475569' }} tickLine={false} />
        <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
        <Tooltip 
          formatter={(value: any) => [`${value}%`, 'ความครอบคลุม']}
          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
        />
        <defs>
          <linearGradient id="colorDose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <Bar dataKey="percentage" fill="url(#colorDose)" radius={[6, 6, 0, 0]} barSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}
