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
import { provinceRankData } from '@/lib/mock-data';

export default function ProvinceRankChart() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>📊 10 อันดับอำเภอพบเหตุการณ์สูงสุด (จ.กาฬสินธุ์)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={provinceRankData}
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
              <Tooltip />
              <Bar dataKey="cases" name="จำนวนเหตุการณ์ (สัมผัส+สัตว์)" fill="url(#colorCases)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
