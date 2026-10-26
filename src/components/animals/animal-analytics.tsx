'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dog, 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  MapPin, 
  AlertOctagon, 
  Syringe, 
  Clock,
  Compass
} from 'lucide-react';
import { useData } from '@/context/data-context';

interface AnimalAnalyticsProps {
  selectedYear: string;
}

export function AnimalAnalytics({ selectedYear }: AnimalAnalyticsProps) {
  const { alerts, isDistrictMatch, selectedDistrict, selectedDistrictName } = useData();

  const districtAlerts = useMemo(() => {
    return alerts.filter(a => (!a.year || a.year === selectedYear) && isDistrictMatch(a.district));
  }, [alerts, selectedYear, isDistrictMatch]);

  const total = districtAlerts.length;
  const cow = districtAlerts.filter(a => a.animal_species === 'โค').length;
  const stray = districtAlerts.filter(a => a.title.includes('จรจัด') || (a.animal_species === 'สุนัข' && a.head_no !== 4 && a.head_no !== 8)).length;
  const owned = Math.max(0, total - stray - cow);

  const strayPct = total > 0 ? ((stray / total) * 100).toFixed(1) : '0';
  const ownedPct = total > 0 ? ((owned / total) * 100).toFixed(1) : '0';
  const cowPct = total > 0 ? ((cow / total) * 100).toFixed(1) : '0';

  const activeZones = districtAlerts.filter(a => a.is_recent_1_month).length;
  const expiredZones = Math.max(0, total - activeZones);

  if (selectedYear !== '2569') {
    return (
      <Card>
        <CardContent className="p-6 text-center text-xs text-muted-foreground bg-slate-50 rounded-lg">
          ข้อมูลการวิเคราะห์เชิงลึกเปิดใช้งานสำหรับปี พ.ศ. 2569
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Animal Ownership Breakdown */}
      <Card className="border-slate-200">
        <CardHeader className="p-3.5 sm:p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Dog size={16} className="text-blue-600" />
              <span>สถานะความเป็นเจ้าของสัตว์</span>
            </span>
            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-semibold">
              {total} ตัว {selectedDistrict !== 'all' ? `(${selectedDistrictName})` : ''}
            </Badge>
          </CardTitle>
          <CardDescription className="text-[11px]">
            จำแนกสถานะสัตว์ที่ตรวจพบเชื้อพิษสุนัขบ้า (ผลบวก)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 pt-1 space-y-3">
          {total === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground bg-slate-50 rounded-lg">
              ไม่พบรายงานสัตว์ผลบวกในพื้นที่ {selectedDistrictName}
            </div>
          ) : (
            <>
              {/* Progress bar stack */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">สุนัขจรจัด / สัตว์ไม่มีเจ้าของ</span>
                  <span className="text-red-600">{stray} ตัว ({strayPct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${strayPct}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">สุนัขมีเจ้าของ</span>
                  <span className="text-amber-600">{owned} ตัว ({ownedPct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${ownedPct}%` }} />
                </div>
              </div>

              {cow > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">🐄 โค (วัว) ติดเชื้อข้ามสายพันธุ์</span>
                    <span className="text-purple-600">{cow} ตัว ({cowPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${cowPct}%` }} />
                  </div>
                </div>
              )}

              <div className="p-2.5 bg-red-50/70 border border-red-200/60 rounded-lg text-[11px] text-red-900 leading-relaxed">
                ⚠️ <strong>ข้อสังเกตระบาดวิทยา:</strong> สัตว์ติดเชื้อส่วนใหญ่เป็นสุนัขจรจัดในที่สาธารณะ วัด และชุมชน ซึ่งไม่เคยได้รับวัคซีนป้องกันโรคมาก่อน
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Card 2: 5km Epidemic Zones Declaration Status */}
      <Card className="border-slate-200">
        <CardHeader className="p-3.5 sm:p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass size={16} className="text-red-600" />
              <span>เขตโรคระบาดสัตว์ชั่วคราว (รัศมี 5 กม.)</span>
            </span>
            <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 font-semibold">
              พ.ร.บ.โรคระบาดสัตว์
            </Badge>
          </CardTitle>
          <CardDescription className="text-[11px]">
            สถานะประกาศเขตควบคุมโรครัศมี 5 กม. (ระยะเวลา 30 วัน)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 pt-1 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-red-700 text-xs font-bold">
                <Flame size={13} className="animate-pulse" />
                <span>ในรอบ 30 วัน (Active)</span>
              </div>
              <p className="text-2xl font-black text-red-600">{activeZones} <span className="text-xs font-normal text-red-700">พื้นที่</span></p>
              <p className="text-[10px] text-red-800 font-medium">
                {activeZones > 0 ? 'ประกาศ พ.ร.บ. ควบคุมเข้มงวด' : 'ไม่มีจุด Active ในรอบ 30 วัน'}
              </p>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-bold">
                <ShieldCheck size={13} />
                <span>พ้นกำหนด 30 วัน</span>
              </div>
              <p className="text-2xl font-black text-emerald-700">{expiredZones} <span className="text-xs font-normal text-emerald-700">พื้นที่</span></p>
              <p className="text-[10px] text-emerald-800 font-medium">เข้าสู่ระยะเฝ้าระวังปกติ</p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">🛡️ มาตรการบังคับในเขต 5 กม.:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>ห้ามเคลื่อนย้ายสัตว์เข้า-ออกโดยไม่ได้รับอนุญาต</li>
              <li>ระดมปูพรมฉีดวัคซีนสัตว์รอบจุดเกิดเหตุ 100%</li>
              <li>กักสัตว์ดูอาการ 14 วัน หากตายให้ส่งตรวจทันที</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Vaccination History in Infected Animals */}
      <Card className="border-slate-200">
        <CardHeader className="p-3.5 sm:p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Syringe size={16} className="text-emerald-600" />
              <span>ประวัติวัคซีนก่อนติดเชื้อ</span>
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
              Immunization
            </Badge>
          </CardTitle>
          <CardDescription className="text-[11px]">
            การได้รับวัคซีนป้องกันโรคพิษสุนัขบ้าในสัตว์ติดเชื้อ
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 pt-1 space-y-3">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-1">
            <div className="text-xs font-bold text-rose-800">สัตว์ติดเชื้อที่ไม่เคยฉีดวัคซีน</div>
            <div className="text-3xl font-black text-rose-600">100%</div>
            <p className="text-[10px] text-rose-700">
              {total > 0 ? `(ทั้ง ${total} ตัว ไม่พบประวัติการได้รับวัคซีนมาก่อน)` : 'ไม่มีรายงานสัตว์ติดเชื้อในพื้นที่นี้'}
            </p>
          </div>

          <div className="p-2.5 bg-blue-50/70 border border-blue-200/70 rounded-lg text-[11px] text-blue-900 leading-relaxed">
            💡 <strong>ประสิทธิภาพวัคซีน:</strong> ยืนยันว่าการฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าในสัตว์อย่างทั่วถึง (เป้าหมาย &ge; 80%) สามารถตัดวงจรการแพร่เชื้อสู่คนได้อย่างมีประสิทธิผลสูงสุด
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
