'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Skull, 
  ShieldCheck, 
  Activity, 
  AlertOctagon,
  FileSearch
} from 'lucide-react';

export function QuarantineTracker() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="p-3.5 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <span>ระบบติดตามและกักสังเกตอาการสัตว์ 14 วัน (14-Day Quarantine Tracker)</span>
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              แนวทางปฏิบัติการร่วม One Health เมื่อสัตว์กัด/ข่วนคน ให้กักสัตว์ดูอาการ 10 - 14 วัน
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs w-fit">
            เกณฑ์กรมปศุสัตว์ & WHO
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0 space-y-4">
        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-blue-700 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Clock size={13} />
                <span>อยู่ระหว่างกักดูอาการ</span>
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-blue-900">18 <span className="text-xs font-normal text-blue-700">ตัว</span></p>
            <p className="text-[10px] text-blue-800">กักดูอาการในกรง/พื้นที่ปิด</p>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>กักครบ 14 วัน ปกติ</span>
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-700">412 <span className="text-xs font-normal text-emerald-800">ตัว</span></p>
            <p className="text-[10px] text-emerald-800">พ้นระยะสงสัย ปลอดภัย 91.6%</p>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>แสดงอาการสงสัย</span>
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-700">6 <span className="text-xs font-normal text-amber-800">ตัว</span></p>
            <p className="text-[10px] text-amber-800">เฝ้าระวังอาการทางประสาทใกล้ชิด</p>
          </div>

          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-red-700 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Skull size={13} />
                <span>ตายระหว่างกัก (ส่ง Lab)</span>
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-red-600">32 <span className="text-xs font-normal text-red-700">ตัว</span></p>
            <p className="text-[10px] text-red-800 font-semibold">ตรวจยืนยันผลบวก (100%)</p>
          </div>
        </div>

        {/* Clinical Observation Phases */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Activity size={14} className="text-blue-600" />
            <span>อาการสำคัญที่ต้องเฝ้าระวังระหว่างกัก 14 วัน (Clinical Signs):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                ระยะที่ 1: พฤติกรรมเปลี่ยน (1-3 วัน)
              </Badge>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                สัตว์นิสัยเปลี่ยนจากเชื่องเป็นดุ หรือจากปราดเปรียวเป็นซึม แอบในมุมมืด ม่านตาขยาย มีไข้ต่ำๆ
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 font-semibold">
                ระยะที่ 2: ดุร้ายกระวนกระวาย (2-4 วัน)
              </Badge>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                กัดทุกอย่างที่ขวางหน้า ลิ้นห้อย น้ำลายไหลย้อย กลืนลำบาก วิ่งไร้ทิศทาง ไม่กลัวคน
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 font-semibold">
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
