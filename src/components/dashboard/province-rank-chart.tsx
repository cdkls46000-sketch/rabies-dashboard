'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { yearlyProvinceRankData } from '@/lib/mock-data';
import { useData } from '@/context/data-context';

export default function ProvinceRankChart() {
  const { selectedYear } = useData();
  const currentRankData = yearlyProvinceRankData[selectedYear] || [];

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">📊 อันดับอำเภอพบเหตุการณ์สูงสุด (จ.กาฬสินธุ์)</CardTitle>
      </CardHeader>
      <CardContent>
        {currentRankData.length === 0 ? (
          <div className="h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p>ไม่มีรายงานเหตุการณ์ในปี พ.ศ. {selectedYear}</p>
            <p className="text-[11px] text-slate-400 mt-1">จำนวนเหตุการณ์รวม = 0 เคส</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentRankData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 80,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="province" type="category" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value} เคส`, 'รายงานเหตุการณ์']} />
                <Bar dataKey="cases" name="จำนวนเหตุการณ์ (สัมผัส+สัตว์)" fill="url(#colorCases)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
