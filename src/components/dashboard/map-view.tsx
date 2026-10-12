'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';
import { Eye, EyeOff, Radio } from 'lucide-react';

// Dynamically import map component with ssr: false
const MapInner = dynamic(() => import('./map-inner'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-2">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs">กำลังโหลดแผนที่ GIS จ.กาฬสินธุ์...</span>
    </div>
  )
});

export default function MapView() {
  const { show5kmRadius, toggle5kmRadius, selectedYear, mapPoints } = useData();

  const activePointsCount = mapPoints.filter(p => !p.year || p.year === selectedYear).length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">🗺️ แผนที่พิกัดระบาดวิทยา (18 อำเภอ จ.กาฬสินธุ์)</CardTitle>
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                พ.ศ. {selectedYear}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              แสดงจุดเกิดเหตุระดับหมู่บ้านและพื้นที่ควบคุมโรคระบาดสัตว์ชั่วคราว
            </p>
          </div>

          {/* Toggle 5km Buffer Circle */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={show5kmRadius ? "default" : "outline"}
              onClick={toggle5kmRadius}
              className={`h-7 px-2.5 text-xs gap-1.5 transition-all ${
                show5kmRadius 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="สลับการแสดงผลวงรัศมีเฝ้าระวัง 5 กิโลเมตร"
            >
              <Radio className={`w-3.5 h-3.5 ${show5kmRadius ? 'animate-pulse' : ''}`} />
              <span>{show5kmRadius ? 'ซ่อนวงรัศมี 5 กม.' : 'แสดงวงรัศมี 5 กม.'}</span>
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block ring-2 ring-red-200"></span> 
              <span className="text-[11px] text-slate-700">ผลบวก (Lab Positive)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ring-2 ring-amber-200"></span> 
              <span className="text-[11px] text-slate-700">สัตว์สงสัย (Suspect)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ring-2 ring-blue-200"></span> 
              <span className="text-[11px] text-slate-700">ผู้สัมผัสโรค (Exposure)</span>
            </span>
          </div>

          <div className="text-[10px] text-slate-500">
            {show5kmRadius ? (
              <span className="text-emerald-700 font-medium">⭕ กำลังแสดงวงรัศมี 5,000 ม. ({activePointsCount} จุด)</span>
            ) : (
              <span className="text-slate-400">วงรัศมี 5 กม. ปิดอยู่</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full relative z-0">
          <MapInner />
        </div>
      </CardContent>
    </Card>
  );
}
