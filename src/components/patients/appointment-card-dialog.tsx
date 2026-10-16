'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  User, 
  Syringe,
  QrCode,
  Hospital
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PatientListItem } from '@/types';

interface AppointmentCardDialogProps {
  patient: PatientListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentCardDialog({ patient, open, onOpenChange }: AppointmentCardDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!patient) return null;

  // Determine doses status
  const currentStatus = patient.vaccine_status || '';
  const isCompleted = patient.follow_up_status === 'completed' || currentStatus.includes('ครบชุด');
  const isOverdue = patient.follow_up_status === 'overdue';

  // Doses schedule array
  const doses = [
    { dose: 'เข็มที่ 1 (Day 0)', desc: 'วันแรกที่สัมผัสโรค', status: 'done', detail: patient.rig_given ? 'วัคซีน + RIG' : 'วัคซีน PEP' },
    { dose: 'เข็มที่ 2 (Day 3)', desc: 'วันที่ 3 หลังสัมผัส', status: currentStatus.includes('เข็ม 1') ? 'pending' : 'done', detail: 'กระตุ้นภูมิคุ้มกัน' },
    { dose: 'เข็มที่ 3 (Day 7)', desc: 'วันที่ 7 หลังสัมผัส', status: currentStatus.includes('เข็ม 3') || currentStatus.includes('เข็ม 4') || isCompleted ? 'done' : 'pending', detail: 'สร้างภูมิคุ้มกันระดับสูง' },
    { dose: 'เข็มที่ 4 (Day 14)', desc: 'วันที่ 14 หลังสัมผัส', status: currentStatus.includes('เข็ม 4') || isCompleted ? 'done' : 'pending', detail: 'TRC ID ครั้งที่ 4' },
    { dose: 'เข็มที่ 5 (Day 28)', desc: 'วันที่ 28 หลังสัมผัส', status: isCompleted ? 'done' : 'pending', detail: 'Essen IM หรือนัดประเมิน' },
  ];

  const handleCopyLine = () => {
    const text = `🎫 ใบนัดฉีดวัคซีนป้องกันโรคพิษสุนัขบ้า (PEP)
👤 ผู้สัมผัสโรค: ${patient.name} (HN: ${patient.hn})
🏥 สถานพยาบาล: ${patient.hospital || 'รพ.สต. / โรงพยาบาลใน จ.กาฬสินธุ์'}
📍 ที่อยู่: ${patient.village_name || ''} ${patient.subdistrict || ''} ${patient.district || ''}
🩸 บาดแผล: Category ${patient.wound_category} (สัมผัส: ${patient.animal_species || 'สุนัข'})
📅 วันที่สัมผัส: ${patient.exposure_date}
💉 สถานะวัคซีน: ${patient.vaccine_status}

ตารางนัดหมาย:
• Day 0: เข็มที่ 1 (ได้รับแล้ว ${patient.rig_given ? '+ RIG' : ''})
• Day 3: เข็มที่ 2
• Day 7: เข็มที่ 3
• Day 14: เข็มที่ 4
• Day 28: เข็มที่ 5 (สิ้นสุดสูตร)

⚠️ ข้อควรปฏิบัติ:
1. กรุณามาฉีดให้ตรงวันนัดทุกครั้ง หากเลยนัดต้องรีบมาทันที
2. งดดื่มสุราและของมึนเมาทุกชนิด
3. สังเกตอาการสัตว์อย่างน้อย 10 วัน`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 print:p-0 print:border-none print:shadow-none">
        <DialogHeader className="pb-2 border-b print:border-none">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Syringe size={20} />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg">
                  ใบนัดฉีดวัคซีนป้องกันโรคพิษสุนัขบ้า (PEP Card)
                </DialogTitle>
                <DialogDescription className="text-xs">
                  ระบบส่งต่อและติดตามผู้สัมผัสโรค สำนักงานสาธารณสุขจังหวัดกาฬสินธุ์
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs ${
              isCompleted ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
              isOverdue ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse' :
              'bg-blue-50 text-blue-800 border-blue-300'
            }`}>
              {isCompleted ? '✓ ฉีดครบชุดแล้ว' : isOverdue ? '⚠️ เลยกำหนดนัด' : '⏳ อยู่ระหว่างฉีดตามนัด'}
            </Badge>
          </div>
        </DialogHeader>

        {/* The Printable Appointment Card Container */}
        <div className="space-y-4 pt-2 text-xs">
          {/* Card Frame */}
          <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-2xl border-2 border-slate-300/80 shadow-xs space-y-3.5 print:border-slate-800 print:shadow-none">
            {/* Header of the Official Card */}
            <div className="flex items-start justify-between border-b pb-3 border-slate-200">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  RABIES POST-EXPOSURE PROPHYLAXIS CARD
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 mt-0.5">
                  <Hospital size={16} className="text-blue-700" />
                  <span>{patient.hospital || 'รพ.สต. ในเครือข่าย สสจ.กาฬสินธุ์'}</span>
                </h3>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>HN: <strong className="text-slate-800">{patient.hn}</strong></span>
                  <span>•</span>
                  <span>จ.กาฬสินธุ์</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold inline-block ${
                  patient.wound_category === 'III' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  patient.wound_category === 'II' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  WHO Category {patient.wound_category}
                </span>
                {patient.rig_given && (
                  <div className="text-[10px] text-rose-700 font-bold mt-1">
                    ✓ ได้รับ RIG แล้ว
                  </div>
                )}
              </div>
            </div>

            {/* Patient & Incident Details */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">ชื่อ-นามสกุล</span>
                  <strong className="text-slate-900 text-xs sm:text-sm">{patient.name}</strong>
                  <span className="text-slate-500 text-[11px] ml-1">({patient.age} ปี)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ที่อยู่</span>
                  <span className="text-slate-700 text-[11px]">
                    {patient.village_name || ''} {patient.subdistrict || ''} {patient.district || ''}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-right sm:text-left">
                <div>
                  <span className="text-[10px] text-slate-400 block">วันที่สัมผัสโรค</span>
                  <strong className="text-slate-900">{patient.exposure_date}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">สัตว์ที่สัมผัส</span>
                  <span className="text-slate-700 text-[11px]">
                    {patient.animal_species || 'สุนัข'} ({patient.exposure_type === 'bite' ? 'ถูกกัด' : patient.exposure_type === 'scratch' ? 'ถูกข่วน' : 'เลียแผล'})
                  </span>
                </div>
              </div>
            </div>

            {/* Vaccination Progress Timeline */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>ตารางนัดหมายและการฉีดวัคซีน (PEP Protocol)</span>
                <span className="text-[10px] text-slate-500">สถานะ: {patient.vaccine_status}</span>
              </div>

              <div className="space-y-1.5">
                {doses.map((d, idx) => {
                  const isDone = d.status === 'done';
                  return (
                    <div 
                      key={d.dose}
                      className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs transition-colors ${
                        isDone 
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div>
                          <strong className={isDone ? 'text-emerald-900' : 'text-slate-800'}>
                            {d.dose}
                          </strong>
                          <span className="text-[10px] text-slate-400 ml-1.5 hidden sm:inline">
                            ({d.desc})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {d.detail}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isDone ? 'ฉีดแล้ว' : 'รอรับบริการ'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Precautions */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle size={13} className="text-amber-700 shrink-0" />
                <span>คำแนะนำสำคัญสำหรับผู้สัมผัสโรค</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-[11px]">
                <li>ต้องมาฉีดวัคซีนให้ตรงตามวันนัดทุกครั้ง <strong>หากเกินกำหนดนัดต้องรีบติดต่อเจ้าหน้าที่ทันที</strong></li>
                <li>งดดื่มเครื่องดื่มที่มีแอลกอฮอล์ทุกชนิดตลอดระยะเวลาการฉีดวัคซีน</li>
                <li>กักขังสังเกตอาการสัตว์ที่กัดอย่างน้อย 10 วัน หากสัตว์มีอาการผิดปกติหรือตาย ให้แจ้งเจ้าหน้าที่ทันที</li>
              </ul>
            </div>

            {/* Digital Verification Footnote */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>ระบบ One Health สสจ.กาฬสินธุ์ ยืนยันข้อมูลถูกต้อง</span>
              </div>
              <span>พิมพ์เมื่อ: {new Date().toLocaleDateString('th-TH')}</span>
            </div>
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLine}
              className="text-xs gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
            >
              <Share2 size={13} />
              <span>{copied ? 'คัดลอกข้อความ LINE แล้ว ✓' : 'ส่งข้อมูลเข้า LINE'}</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs gap-1.5"
              >
                <Printer size={13} />
                <span>พิมพ์ใบนัด (Print)</span>
              </Button>
              <Button
                size="sm"
                onClick={() => onOpenChange(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
              >
                ปิดหน้าต่าง
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
