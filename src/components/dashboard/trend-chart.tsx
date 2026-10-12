'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';

export default function TrendChart() {
  const { trendData, selectedYear } = useData();

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">📈 แนวโน้มสถานการณ์รายเดือน</CardTitle>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-semibold">
            ปี พ.ศ. {selectedYear}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          เปรียบเทียบจำนวนเคสรายงาน ผู้สัมผัสโรค และสัตว์ที่ตรวจพบเชื้อผลบวก (12 เดือน)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{
                top: 5,
                right: 30,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line 
                type="monotone" 
                dataKey="cases" 
                name="จำนวนเคสทั้งหมด" 
                stroke="#3b82f6" 
                strokeWidth={2}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="exposures" 
                name="ผู้สัมผัสโรค (คน)" 
                stroke="#f97316" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="positiveAnimals" 
                name="สัตว์ตรวจยืนยันผลบวก (+)" 
                stroke="#ef4444" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
