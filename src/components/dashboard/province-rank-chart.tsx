'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { yearlyProvinceRankData, kalasinSubdistricts } from '@/lib/mock-data';
import { useData } from '@/context/data-context';
import { HelpCircle } from 'lucide-react';

type ViewMode = 'all' | 'animals' | 'patients';

export default function ProvinceRankChart() {
  const { selectedYear, selectedDistrict, selectedDistrictName, isDistrictMatch, patients, alerts } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const currentRankData = useMemo(() => {
    if (selectedDistrict === 'all') {
      return yearlyProvinceRankData[selectedYear] || [];
    }

    // Drill down to subdistricts in this selected district!
    const subList = kalasinSubdistricts[selectedDistrictName] || [];
    const districtAlerts = alerts.filter(a => (!a.year || a.year === selectedYear) && isDistrictMatch(a.district));
    const districtPatients = patients.filter(p => (p.year === selectedYear || (!p.year && selectedYear === '2569')) && isDistrictMatch(p.district));

    const result = subList.map(sub => {
      const cleanSub = sub.replace(/^ต\./, '').trim();
      const posCount = districtAlerts.filter(a => a.subdistrict?.includes(cleanSub) || a.location?.includes(cleanSub)).length;
      const expCount = districtPatients.filter(p => p.subdistrict?.includes(cleanSub) || p.village_name?.includes(cleanSub)).length;
      return {
        province: sub,
        cases: posCount + expCount,
        positiveAnimals: posCount,
        exposures: expCount,
      };
    });

    return result.filter(r => r.cases > 0);
  }, [selectedYear, selectedDistrict, selectedDistrictName, isDistrictMatch, alerts, patients]);

  // Sort data based on selected view mode
  const sortedData = useMemo(() => {
    if (!currentRankData.length) return [];
    const copy = [...currentRankData];
    if (viewMode === 'animals') {
      return copy.sort((a, b) => (b.positiveAnimals || 0) - (a.positiveAnimals || 0));
    }
    if (viewMode === 'patients') {
      return copy.sort((a, b) => (b.exposures || 0) - (a.exposures || 0));
    }
    return copy.sort((a, b) => b.cases - a.cases);
  }, [currentRankData, viewMode]);

  const totalCases = useMemo(() => currentRankData.reduce((acc, c) => acc + (c.cases || 0), 0), [currentRankData]);
  const totalAnimals = useMemo(() => currentRankData.reduce((acc, c) => acc + (c.positiveAnimals || 0), 0), [currentRankData]);
  const totalExposures = useMemo(() => currentRankData.reduce((acc, c) => acc + (c.exposures || 0), 0), [currentRankData]);

  return (
    <Card className="w-full h-full flex flex-col justify-between">
      <CardHeader className="pb-2 p-3.5 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <span>{selectedDistrict === 'all' ? '📊 การกระจายรายอำเภอ (จ.กาฬสินธุ์)' : `📊 การกระจายรายตำบล (${selectedDistrictName})`}</span>
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {selectedDistrict === 'all' ? (
                <>แยกตาม <strong>🔴 สัตว์ตรวจพบเชื้อ (Lab +)</strong> และ <strong>🔵 ผู้สัมผัสโรค (PEP)</strong></>
              ) : (
                <>เจาะลึกเฉพาะพื้นที่ <strong>{selectedDistrictName}</strong> แยกตามตำบล</>
              )}
            </CardDescription>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs self-start sm:self-center">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รวมทั้งหมด ({totalCases})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('animals')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'animals'
                  ? 'bg-white text-red-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
              สัตว์พบเชื้อ ({totalAnimals})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('patients')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'patients'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              ผู้สัมผัสโรค ({totalExposures})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0 space-y-3">
        {sortedData.length === 0 ? (
          <div className="h-[280px] w-full flex flex-col items-center justify-center text-muted-foreground text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p>ไม่มีรายงานเหตุการณ์ในปี พ.ศ. {selectedYear}</p>
            <p className="text-[11px] text-slate-400 mt-1">จำนวนเหตุการณ์รวม = 0 เคส</p>
          </div>
        ) : (
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 25,
                  left: 80,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="province" type="category" tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-md text-xs space-y-1">
                          <p className="font-bold text-slate-900 border-b pb-1">{data.province}</p>
                          <div className="flex items-center justify-between gap-4 text-red-600 pt-0.5">
                            <span>🔴 สัตว์ตรวจพบเชื้อ (Lab +):</span>
                            <span className="font-bold">{data.positiveAnimals || 0} ตัว</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-blue-600">
                            <span>🔵 ผู้สัมผัสโรค (รับวัคซีน PEP):</span>
                            <span className="font-bold">{data.exposures || 0} ราย</span>
                          </div>
                          <div className="pt-1 mt-1 border-t border-slate-100 flex items-center justify-between gap-4 font-bold text-slate-800">
                            <span>📊 รวมเหตุการณ์เฝ้าระวัง:</span>
                            <span>{data.cases} เคส</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                
                {viewMode === 'all' && (
                  <>
                    <Bar 
                      dataKey="positiveAnimals" 
                      name="🔴 สัตว์ตรวจพบเชื้อ (ตัว)" 
                      fill="#ef4444" 
                      stackId="a" 
                      barSize={18} 
                    />
                    <Bar 
                      dataKey="exposures" 
                      name="🔵 ผู้สัมผัสโรค (ราย)" 
                      fill="#3b82f6" 
                      stackId="a" 
                      radius={[0, 4, 4, 0]} 
                      barSize={18} 
                    />
                  </>
                )}

                {viewMode === 'animals' && (
                  <Bar 
                    dataKey="positiveAnimals" 
                    name="🔴 สัตว์ตรวจพบเชื้อ (ตัว)" 
                    fill="#ef4444" 
                    radius={[0, 4, 4, 0]} 
                    barSize={18} 
                  />
                )}

                {viewMode === 'patients' && (
                  <Bar 
                    dataKey="exposures" 
                    name="🔵 ผู้สัมผัสโรคที่ได้รับวัคซีน PEP (ราย)" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]} 
                    barSize={18} 
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* กล่องคำอธิบายชัดเจน ไม่ให้ผู้ใช้สับสน */}
        <div className="p-2.5 bg-slate-50/90 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-[11px]">
            <HelpCircle size={14} className="text-blue-600 shrink-0" />
            <span>คำอธิบายความหมายของตัวเลขในกราฟนี้:</span>
          </div>
          <div className="text-[11px] leading-relaxed text-slate-600 space-y-0.5">
            <p>• <strong>🔴 สัตว์ตรวจพบเชื้อ (Lab +):</strong> คือสัตว์ที่ส่งตรวจสมองและยืนยันผลบวก (สะสม 32 ตัว พบมากที่สุดที่ <strong>อ.ยางตลาด 13 ตัว</strong> และ <strong>อ.เมือง 8 ตัว</strong>)</p>
            <p>• <strong>🔵 ผู้สัมผัสโรค:</strong> คือคนถูกกัด/ข่วน/สัมผัสสารคัดหลั่ง แล้วเข้ารับการฉีดวัคซีน PEP (สะสม 133 ราย พบมากที่สุดที่ <strong>อ.หนองกุงศรี 52 ราย</strong> จากคลัสเตอร์ชำแหละเนื้อ)</p>
            <p>• <strong>📊 รวมเหตุการณ์:</strong> คือผลรวม (สัตว์ 32 + คน 133 = 165 เคส) <u>ไม่ใช่ผู้ป่วยในคน</u> (จังหวัดกาฬสินธุ์ไม่มีผู้ป่วยโรคพิษสุนัขบ้า ผู้ป่วย = 0 ราย)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
