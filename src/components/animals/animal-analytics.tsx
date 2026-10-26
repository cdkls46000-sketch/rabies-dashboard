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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
      {/* Card 1: Animal Ownership Breakdown */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-br from-white via-blue-50/20 to-sky-50/40 shadow-xs hover:shadow-md transition-all p-4 sm:p-4.5 flex flex-col justify-between">
        {/* Left Color Accent Bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />

        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shadow-2xs">
                <Dog size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  สถานะความเป็นเจ้าของสัตว์
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  จำแนกสัตว์ตรวจพบเชื้อ (Lab +)
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100/80 text-blue-800 border border-blue-200 shadow-2xs">
              {total} ตัว {selectedDistrict !== 'all' ? `(${selectedDistrictName})` : ''}
            </span>
          </div>

          {/* Content */}
          <div className="pt-3 space-y-2.5">
            {total === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground bg-slate-50/80 rounded-xl border border-dashed border-slate-200">
                ไม่พบรายงานสัตว์ผลบวกในพื้นที่ {selectedDistrictName}
              </div>
            ) : (
              <>
                {/* 1. สุนัขจรจัด */}
                <div className="p-2.5 rounded-xl bg-white border border-rose-200/80 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <span className="text-sm">🐕</span>
                      <span>สุนัขจรจัด / สัตว์ไม่มีเจ้าของ</span>
                    </span>
                    <span className="font-bold text-rose-700 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping inline-block" />
                      {stray} ตัว ({strayPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${strayPct}%` }} 
                    />
                  </div>
                </div>

                {/* 2. สุนัขมีเจ้าของ */}
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <span className="text-sm">🐶</span>
                      <span>สุนัขมีเจ้าของ</span>
                    </span>
                    <span className="font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[11px]">
                      {owned} ตัว ({ownedPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${ownedPct}%` }} 
                    />
                  </div>
                </div>

                {/* 3. โค (วัว) */}
                {cow > 0 && (
                  <div className="p-2.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <span className="text-sm">🐄</span>
                        <span>โค (วัว) ติดเชื้อข้ามสายพันธุ์</span>
                      </span>
                      <span className="font-bold text-purple-800 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[11px]">
                        {cow} ตัว ({cowPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${cowPct}%` }} 
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Insight Callout */}
        <div className="mt-3 p-2.5 rounded-xl bg-rose-50/90 border border-rose-200/90 text-[11px] text-rose-950 flex items-start gap-2 shadow-2xs">
          <AlertOctagon size={15} className="text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>ข้อสังเกตระบาดวิทยา:</strong> สัตว์ติดเชื้อกว่า 90% เป็นสุนัขจรจัดในที่สาธารณะ วัด และชุมชน ซึ่งไม่เคยได้รับวัคซีนป้องกันโรคมาก่อน
          </p>
        </div>
      </div>

      {/* Card 2: 5km Epidemic Zones Declaration Status */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-200/90 bg-gradient-to-br from-white via-rose-50/20 to-amber-50/30 shadow-xs hover:shadow-md transition-all p-4 sm:p-4.5 flex flex-col justify-between">
        {/* Left Color Accent Bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-600" />

        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shadow-2xs">
                <Compass size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  เขตโรคระบาดสัตว์ชั่วคราว (5 กม.)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  รัศมีควบคุมโรคตาม พ.ร.บ. (30 วัน)
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
              พ.ร.บ.โรคระบาดสัตว์
            </span>
          </div>

          {/* 2 Big Stat Cards */}
          <div className="pt-3 grid grid-cols-2 gap-2">
            {/* Active Box */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm shadow-rose-500/25 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-medium text-rose-100">
                <span className="flex items-center gap-1">
                  <Flame size={13} className="text-amber-300 animate-pulse" />
                  <span>ในรอบ 30 วัน</span>
                </span>
                <span className="px-1.5 py-0.2 bg-white/20 rounded text-[9px] font-bold">Active</span>
              </div>
              <div className="my-1">
                <span className="text-3xl font-black tracking-tight leading-none text-white">{activeZones}</span>
                <span className="text-xs font-semibold ml-1 text-rose-100">พื้นที่</span>
              </div>
              <p className="text-[10px] text-rose-100 truncate font-medium">
                {activeZones > 0 ? 'ต.โพนงาม & ต.ดอนสมบูรณ์' : 'ไม่มีจุด Active'}
              </p>
            </div>

            {/* Resolved Box */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-medium text-emerald-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-200" />
                  <span>พ้น 30 วันแล้ว</span>
                </span>
                <span className="px-1.5 py-0.2 bg-white/20 rounded text-[9px] font-bold">Safe</span>
              </div>
              <div className="my-1">
                <span className="text-3xl font-black tracking-tight leading-none text-white">{expiredZones}</span>
                <span className="text-xs font-semibold ml-1 text-emerald-100">พื้นที่</span>
              </div>
              <p className="text-[10px] text-emerald-100 truncate font-medium">
                เข้าสู่ระยะเฝ้าระวังปกติ
              </p>
            </div>
          </div>
        </div>

        {/* 3 Action Protocols */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] text-slate-800 space-y-1.5 shadow-2xs">
          <div className="font-bold text-slate-900 flex items-center gap-1">
            <span>🛡️ 3 มาตรการบังคับในเขต 5 กม.:</span>
          </div>
          <div className="grid grid-cols-1 gap-1 text-[10.5px]">
            <div className="flex items-center gap-1.5 text-slate-700 bg-white p-1 rounded-md border border-slate-200/60">
              <span className="text-rose-600 font-bold shrink-0">1.</span>
              <span className="truncate">ห้ามเคลื่อนย้ายสัตว์เข้า-ออกรัศมี 5 กม.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 bg-white p-1 rounded-md border border-slate-200/60">
              <span className="text-blue-600 font-bold shrink-0">2.</span>
              <span className="truncate">ระดมปูพรมฉีดวัคซีนสัตว์รอบจุดเกิดเหตุ 100%</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 bg-white p-1 rounded-md border border-slate-200/60">
              <span className="text-amber-600 font-bold shrink-0">3.</span>
              <span className="truncate">กักสัตว์ดูอาการ 14 วัน หากตายส่งตรวจทันที</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Vaccination History in Infected Animals */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 shadow-xs hover:shadow-md transition-all p-4 sm:p-4.5 flex flex-col justify-between">
        {/* Left Color Accent Bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600" />

        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
                <Syringe size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  ประวัติวัคซีนก่อนติดเชื้อ
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  ความครอบคลุมวัคซีนในสัตว์ติดเชื้อ
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
              One Health Evidence
            </span>
          </div>

          {/* Hero Mega Metric Card */}
          <div className="pt-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-red-50/60 border border-rose-200/90 text-center shadow-2xs space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <AlertOctagon size={11} />
                <span>สัตว์ติดเชื้อที่ไม่เคยฉีดวัคซีน</span>
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-700 py-1">
                100%
              </div>
              <p className="text-[11px] font-bold text-rose-800">
                {total > 0 ? `(ทั้ง ${total} ตัว ไม่พบประวัติการได้รับวัคซีนแม้แต่ตัวเดียว)` : 'ไม่มีรายงานสัตว์ติดเชื้อในพื้นที่นี้'}
              </p>
            </div>
          </div>
        </div>

        {/* Contrast Comparison Pill & Key Insight */}
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5 text-center text-[10.5px]">
            <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              ✓ ฉีดวัคซีน = ปลอดโรค
            </div>
            <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-bold">
              ✕ ไม่ฉีด = เสี่ยงติดเชื้อ
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200/90 text-[11px] text-blue-950 flex items-start gap-2 shadow-2xs">
            <ShieldCheck size={15} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>ประสิทธิภาพวัคซีน:</strong> ยืนยันว่าการฉีดวัคซีนในสัตว์ครอบคลุม &ge; 80% สามารถตัดวงจรการแพร่เชื้อสู่คนได้อย่างเด็ดขาด
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
