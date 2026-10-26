'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';
import { Radio } from 'lucide-react';

// Dynamically import map component with ssr: false
const MapInner = dynamic(() => import('./map-inner'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-2 rounded-md">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs">กำลังโหลดแผนที่ GIS จ.กาฬสินธุ์...</span>
    </div>
  )
});

export default function MapView() {
  const { 
    show5kmRadius, 
    toggle5kmRadius, 
    selectedYear, 
    mapPoints, 
    selectedDistrict, 
    selectedDistrictName, 
    setSelectedDistrict,
    isDistrictMatch
  } = useData();

  const activePoints = mapPoints.filter(p => {
    const matchYear = !p.year || p.year === selectedYear;
    const matchDistrict = isDistrictMatch(p.district);
    return matchYear && matchDistrict;
  });
  const activePointsCount = activePoints.length;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3.5 sm:p-5 pb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <CardTitle className="text-sm sm:text-base md:text-lg">
                🗺️ แผนที่พิกัดระบาดวิทยา ({selectedDistrictName})
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                พ.ศ. {selectedYear}
              </Badge>
              {selectedDistrict !== 'all' && (
                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 flex items-center gap-1 font-semibold">
                  <span>📍 กรองเฉพาะ: {selectedDistrictName}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedDistrict('all')} 
                    className="hover:text-red-700 font-bold cursor-pointer ml-0.5"
                    title="ล้างตัวกรองอำเภอ"
                  >
                    ✕
                  </button>
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              แสดงจุดเกิดเหตุระดับหมู่บ้านและพื้นที่ควบคุมโรคระบาดสัตว์ชั่วคราว ({activePointsCount} จุดพิกัด)
            </p>
          </div>

          {/* Toggle 5km Buffer Circle */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={show5kmRadius ? "default" : "outline"}
              onClick={toggle5kmRadius}
              className={`h-7 px-2.5 text-xs gap-1.5 transition-all active:scale-95 ${
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
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block ring-2 ring-red-200 shrink-0"></span> 
              <span className="text-[10px] sm:text-[11px] text-slate-700">ผลบวก</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ring-2 ring-amber-200 shrink-0"></span> 
              <span className="text-[10px] sm:text-[11px] text-slate-700">สัตว์สงสัย</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ring-2 ring-blue-200 shrink-0"></span> 
              <span className="text-[10px] sm:text-[11px] text-slate-700">ผู้สัมผัสโรค</span>
            </span>
          </div>

          <div className="text-[10px] text-slate-500">
            {show5kmRadius ? (
              <span className="text-emerald-700 font-medium">⭕ แสดงวงรัศมี 5,000 ม. ({activePointsCount} จุด)</span>
            ) : (
              <span className="text-slate-400">วงรัศมี 5 กม. ปิดอยู่</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-5 pt-0 sm:pt-0">
        <div className="h-[280px] sm:h-[350px] md:h-[400px] w-full relative z-0 rounded-md overflow-hidden border border-slate-200">
          <MapInner />
        </div>
      </CardContent>
    </Card>
  );
}
