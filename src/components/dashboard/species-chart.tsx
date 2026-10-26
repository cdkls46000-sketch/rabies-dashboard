'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { yearlySpeciesData } from '@/lib/mock-data';
import { useData } from '@/context/data-context';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SpeciesChart() {
  const { selectedYear, selectedDistrict, selectedDistrictName, alerts, isDistrictMatch } = useData();

  const activeSpecies = React.useMemo(() => {
    if (selectedDistrict === 'all') {
      const rawData = yearlySpeciesData[selectedYear] || [];
      return rawData.filter(d => d.value > 0);
    }

    const filteredAlerts = alerts.filter(a => (!a.year || a.year === selectedYear) && isDistrictMatch(a.district));
    let dogs = 0;
    let cows = 0;
    let cats = 0;
    let others = 0;

    filteredAlerts.forEach(a => {
      if (a.animal_species === 'สุนัข') dogs++;
      else if (a.animal_species === 'โค') cows++;
      else if (a.animal_species === 'แมว') cats++;
      else others++;
    });

    const list = [
      { name: 'สุนัข', value: dogs, color: '#ef4444' },
      { name: 'โค', value: cows, color: '#f59e0b' },
      { name: 'แมว', value: cats, color: '#3b82f6' },
      { name: 'อื่นๆ', value: others, color: '#8b5cf6' },
    ];
    return list.filter(d => d.value > 0);
  }, [selectedYear, selectedDistrict, alerts, isDistrictMatch]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">
          🥧 สัดส่วนประเภทสัตว์ที่ตรวจพบเชื้อ ({selectedDistrictName})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeSpecies.length === 0 ? (
          <div className="h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p>ไม่มีรายงานสัตว์ตรวจพบเชื้อในปี พ.ศ. {selectedYear}</p>
            <p className="text-[11px] text-slate-400 mt-1">ผลบวกทางห้องปฏิบัติการ = 0 ตัว</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeSpecies}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activeSpecies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} ตัว`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
