'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Skull, 
  Activity 
} from 'lucide-react';

export function QuarantineTracker() {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden bg-white">
      <CardHeader className="p-4 sm:p-5 pb-3.5 bg-gradient-to-r from-slate-50 via-white to-blue-50/20 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-blue-100 text-blue-700 shadow-2xs shrink-0 mt-0.5">
              <Clock size={20} />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>ระบบติดตามและกักสังเกตอาการสัตว์ 14 วัน</span>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  14-Day Quarantine Tracker
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
                แนวทางปฏิบัติการร่วม One Health เมื่อสัตว์กัด/ข่วนคน ให้กักสัตว์ดูอาการ 10 - 14 วัน ในพื้นที่ปิด
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50/80 text-blue-700 border-blue-200 text-xs w-fit font-medium shrink-0 shadow-2xs">
            เกณฑ์กรมปศุสัตว์ & WHO
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 space-y-4">
        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Box 1 */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/90 via-white to-blue-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-blue-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-blue-100 text-blue-700">
                  <Clock size={12} />
                </div>
                <span>อยู่ระหว่างกัก</span>
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">18</span>
              <span className="text-xs font-semibold text-blue-700">ตัว</span>
            </div>
            <p className="text-[11px] text-blue-800/90 font-medium">กักดูอาการในกรง/พื้นที่ปิด</p>
          </div>

          {/* Box 2 */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={12} />
                </div>
                <span>กักครบ 14 วัน</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">ปกติ 91.6%</span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">412</span>
              <span className="text-xs font-semibold text-emerald-700">ตัว</span>
            </div>
            <p className="text-[11px] text-emerald-800/90 font-medium">พ้นระยะสงสัย ปลอดภัย</p>
          </div>

          {/* Box 3 */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-amber-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-amber-100 text-amber-700">
                  <AlertTriangle size={12} />
                </div>
                <span>แสดงอาการสงสัย</span>
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Watch</span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">6</span>
              <span className="text-xs font-semibold text-amber-700">ตัว</span>
            </div>
            <p className="text-[11px] text-amber-800/90 font-medium">เฝ้าระวังอาการทางประสาท</p>
          </div>

          {/* Box 4 */}
          <div className="relative overflow-hidden rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50/90 via-white to-rose-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-red-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-red-100 text-red-700">
                  <Skull size={12} />
                </div>
                <span>ตายระหว่างกัก</span>
              </span>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">ผลบวก 100%</span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-red-950 tracking-tight">32</span>
              <span className="text-xs font-semibold text-red-700">ตัว</span>
            </div>
            <p className="text-[11px] text-red-800/90 font-medium">ส่งตรวจ Lab ยืนยันเชื้อ</p>
          </div>
        </div>

        {/* Clinical Observation Phases */}
        <div className="p-4 bg-gradient-to-r from-slate-50 via-slate-50/60 to-blue-50/20 border border-slate-200/80 rounded-2xl space-y-2.5 text-xs">
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity size={16} className="text-blue-600" />
              <span className="text-sm font-bold">อาการสำคัญที่ต้องเฝ้าระวังระหว่างกัก 14 วัน (Clinical Signs)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal hidden md:inline">
              หากสัตว์แสดงอาการหรือตาย ให้รายงานเจ้าหน้าที่ปศุสัตว์ทันที
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs hover:shadow-xs transition-all">
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-bold px-2 py-0.5">
                ระยะที่ 1: พฤติกรรมเปลี่ยน (1-3 วัน)
              </Badge>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                สัตว์นิสัยเปลี่ยนจากเชื่องเป็นดุ หรือจากปราดเปรียวเป็นซึม แอบในมุมมืด ม่านตาขยาย มีไข้ต่ำๆ
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs hover:shadow-xs transition-all">
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 font-bold px-2 py-0.5">
                ระยะที่ 2: ดุร้ายกระวนกระวาย (2-4 วัน)
              </Badge>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                กัดทุกอย่างที่ขวางหน้า ลิ้นห้อย น้ำลายไหลย้อย กลืนลำบาก วิ่งไร้ทิศทาง ไม่กลัวคน
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs hover:shadow-xs transition-all">
              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 font-bold px-2 py-0.5">
                ระยะที่ 3: อัมพาตและเสียชีวิต (1-2 วัน)
              </Badge>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                ขาหลังอ่อนแรง เดินโซเซ ขากรรไกรตก ลุกไม่ขึ้น ชัก และตายในที่สุดภายใน 10 วันนับแต่เริ่มแสดงอาการ
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
