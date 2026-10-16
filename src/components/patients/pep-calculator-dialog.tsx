'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldAlert, 
  ShieldCheck, 
  Syringe, 
  Calendar, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Copy, 
  RotateCcw,
  Stethoscope
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
import { Label } from '@/components/ui/label';

interface PepCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PepCalculatorDialog({ open, onOpenChange }: PepCalculatorDialogProps) {
  // Input states
  const todayStr = new Date().toISOString().split('T')[0];
  const [exposureDate, setExposureDate] = useState<string>(todayStr);
  const [woundSeverity, setWoundSeverity] = useState<'cat1' | 'cat2' | 'cat3'>('cat3');
  const [animalStatus, setAnimalStatus] = useState<'owned_alive' | 'dead' | 'stray'>('owned_alive');
  const [previousVaccine, setPreviousVaccine] = useState<'naive' | 'booster_less_3m' | 'booster_more_3m'>('naive');
  const [copied, setCopied] = useState(false);

  // Helper date calculation
  const addDays = (baseDateStr: string, days: number): string => {
    try {
      const d = new Date(baseDateStr);
      d.setDate(d.getDate() + days);
      const day = d.getDate();
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      const month = thaiMonths[d.getMonth()];
      const year = d.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    } catch {
      return '-';
    }
  };

  // Determine Category and Protocol
  const isRigRequired = woundSeverity === 'cat3' && previousVaccine === 'naive';
  const isBooster = previousVaccine !== 'naive';

  // Schedule dates
  const schedule = isBooster
    ? previousVaccine === 'booster_less_3m'
      ? [{ day: 'Day 0', label: 'ฉีดกระตุ้นเข็มที่ 1', date: addDays(exposureDate, 0), detail: 'IM 1 จุด หรือ ID 1 จุด (ไม่ต้องให้ RIG)' }]
      : [
          { day: 'Day 0', label: 'ฉีดกระตุ้นเข็มที่ 1', date: addDays(exposureDate, 0), detail: 'IM 1 จุด หรือ ID 1 จุด (ไม่ต้องให้ RIG)' },
          { day: 'Day 3', label: 'ฉีดกระตุ้นเข็มที่ 2', date: addDays(exposureDate, 3), detail: 'IM 1 จุด หรือ ID 1 จุด' },
        ]
    : [
        { day: 'Day 0', label: 'เข็มที่ 1', date: addDays(exposureDate, 0), detail: isRigRequired ? 'วัคซีน + ให้ RIG รอบแผล' : 'เฉพาะวัคซีน' },
        { day: 'Day 3', label: 'เข็มที่ 2', date: addDays(exposureDate, 3), detail: 'วัคซีนตามสูตร' },
        { day: 'Day 7', label: 'เข็มที่ 3', date: addDays(exposureDate, 7), detail: 'วัคซีนตามสูตร' },
        { day: 'Day 14', label: 'เข็มที่ 4 (TRC ครั้งที่ 4)', date: addDays(exposureDate, 14), detail: 'TRC ID ครั้งที่ 4 หรือ Essen IM เข็ม 4' },
        { day: 'Day 28', label: 'เข็มที่ 5 (Essen IM)', date: addDays(exposureDate, 28), detail: 'กรณีใช้สูตร Essen IM 5 เข็ม' },
      ];

  const handleCopySummary = () => {
    const catLabel = woundSeverity === 'cat1' ? 'Category I' : woundSeverity === 'cat2' ? 'Category II' : 'Category III';
    const rigText = isRigRequired ? 'จำเป็นต้องได้รับ RIG ฉีดรอบแผล' : 'ไม่ต้องให้ RIG';
    const text = `📋 ผลการประเมินความเสี่ยงและแผนการให้วัคซีน PEP (One Health กาฬสินธุ์)
- วันที่สัมผัสโรค: ${addDays(exposureDate, 0)}
- การประเมินแผล: ${catLabel}
- ข้อบ่งชี้ RIG: ${rigText}
- แผนการฉีด: ${isBooster ? 'ฉีดกระตุ้น (Booster)' : 'สูตรเต็ม TRC ID / Essen IM'}
- ตารางนัดหมาย:
${schedule.map(s => `  • ${s.day} (${s.date}): ${s.label} [${s.detail}]`).join('\n')}
*คำแนะนำสัตว์: ${animalStatus === 'owned_alive' ? 'กักขังสังเกตอาการ 10 วัน' : 'ส่งหัวตรวจ Lab ศวพ.ขอนแก่นทันที'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setExposureDate(todayStr);
    setWoundSeverity('cat3');
    setAnimalStatus('owned_alive');
    setPreviousVaccine('naive');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Calculator size={20} />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
                <span>เครื่องมือประเมินระดับแผล & คำนวณวันนัด PEP</span>
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-300">
                  WHO & Thai CPG
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                ระบบช่วยแพทย์/พยาบาลประเมิน Category, ข้อบ่งชี้ RIG, และคำนวณวันนัดหมายตามมาตรฐาน
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Section 1: Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {/* วันที่สัมผัส */}
            <div>
              <Label className="text-xs font-semibold flex items-center gap-1.5 mb-1 text-slate-800">
                <Calendar size={14} className="text-blue-600" />
                <span>วันที่สัมผัสโรค (Day 0)</span>
              </Label>
              <input
                type="date"
                value={exposureDate}
                onChange={(e) => setExposureDate(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ประวัติวัคซีนเดิม */}
            <div>
              <Label className="text-xs font-semibold flex items-center gap-1.5 mb-1 text-slate-800">
                <Syringe size={14} className="text-emerald-600" />
                <span>ประวัติการได้รับวัคซีนในอดีต</span>
              </Label>
              <select
                value={previousVaccine}
                onChange={(e) => setPreviousVaccine(e.target.value as any)}
                className="w-full h-8 px-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="naive">ไม่เคยฉีด หรือฉีดไม่ครบ 3 เข็ม</option>
                <option value="booster_less_3m">เคยฉีดครบ ในช่วงไม่เกิน 3 เดือน</option>
                <option value="booster_more_3m">เคยฉีดครบ เกิน 3 เดือนขึ้นไป</option>
              </select>
            </div>

            {/* ลักษณะบาดแผล */}
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-slate-800">
                <AlertTriangle size={14} className="text-amber-600" />
                <span>ลักษณะบาดแผลและการสัมผัส (WHO Category)</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWoundSeverity('cat1')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    woundSeverity === 'cat1'
                      ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-600 text-blue-950'
                      : 'border-slate-200 bg-white hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Category I</span>
                    <Badge variant="outline" className="text-[9px] bg-blue-100 text-blue-800">เสี่ยงต่ำ</Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">สัมผัส/เลียผิวหนังปกติ ไม่มีแผล</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWoundSeverity('cat2')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    woundSeverity === 'cat2'
                      ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-500 text-amber-950'
                      : 'border-slate-200 bg-white hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Category II</span>
                    <Badge variant="outline" className="text-[9px] bg-amber-100 text-amber-800">เสี่ยงปานกลาง</Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">รอยข่วน แผลถลอก ไม่มีเลือดออก</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWoundSeverity('cat3')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    woundSeverity === 'cat3'
                      ? 'border-rose-600 bg-rose-50/80 ring-1 ring-rose-600 text-rose-950'
                      : 'border-slate-200 bg-white hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Category III</span>
                    <Badge variant="outline" className="text-[9px] bg-rose-100 text-rose-800 font-bold">เสี่ยงสูงมาก</Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">แผลลึก เลือดออก เลียเยื่อบุ/แผล สัตว์ผลบวก</div>
                </button>
              </div>
            </div>

            {/* สถานะสัตว์ */}
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5 mb-1 text-slate-800">
                <Stethoscope size={14} className="text-purple-600" />
                <span>สถานะและพฤติกรรมสัตว์</span>
              </Label>
              <select
                value={animalStatus}
                onChange={(e) => setAnimalStatus(e.target.value as any)}
                className="w-full h-8 px-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="owned_alive">มีเจ้าของ มีชีวิตปกติ (สามารถกักขังดูอาการได้ 10 วัน)</option>
                <option value="dead">สัตว์ตาย / ถูกฆ่าตาย (ต้องส่งตัดหัวตรวจ Lab ศวพ.ขอนแก่น)</option>
                <option value="stray">สัตว์จรจัด / หนีหายไป / ไม่ทราบประวัติและแหล่งที่อยู่</option>
              </select>
            </div>
          </div>

          {/* Section 2: Clinical Decision Summary */}
          <div className="p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 rounded-xl border border-blue-200 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-blue-950 text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-blue-700" />
                <span>สรุปแนวทางการรักษา (Clinical Decision Support)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <Badge className={
                  woundSeverity === 'cat1' ? 'bg-blue-600 text-white' :
                  woundSeverity === 'cat2' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                }>
                  {woundSeverity === 'cat1' ? 'WHO Category I' : woundSeverity === 'cat2' ? 'WHO Category II' : 'WHO Category III'}
                </Badge>
                {isRigRequired ? (
                  <Badge className="bg-rose-700 text-white animate-pulse">
                    ⚠️ ต้องให้ RIG รอบแผล
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-white text-slate-700 border-slate-300">
                    ไม่ต้องให้ RIG
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white/90 rounded-lg border border-blue-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">💉 สูตรการฉีดวัคซีนแนะนำ</span>
                <p className="text-slate-900 font-semibold text-xs">
                  {isBooster
                    ? previousVaccine === 'booster_less_3m'
                      ? 'ฉีดกระตุ้น 1 เข็ม (Booster Day 0)'
                      : 'ฉีดกระตุ้น 2 เข็ม (Booster Day 0, 3)'
                    : woundSeverity === 'cat1'
                    ? 'ไม่จำเป็นต้องฉีดวัคซีน (ล้างแผลอย่างเดียว)'
                    : 'สูตร TRC ID (2-2-2-0-2) หรือ Essen IM (Day 0, 3, 7, 14, 28)'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isBooster ? 'ผู้ป่วยมีภูมิคุ้มกันเดิม ให้ฉีดกระตุ้นเพื่อกระตุ้น Memory B cells' : 'ฉีดเข้ากล้ามเนื้อ (IM) บริเวณ Deltoid หรือฉีดเข้าในผิวหนัง (ID)'}
                </p>
              </div>

              <div className="p-2.5 bg-white/90 rounded-lg border border-blue-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">🧪 ข้อบ่งชี้ Rabies Immunoglobulin (RIG)</span>
                <p className={`font-semibold text-xs ${isRigRequired ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {isRigRequired ? 'จำเป็นต้องได้รับ RIG ฉีดแทรกซึมรอบบาดแผล Day 0' : 'ไม่มีข้อบ่งชี้การให้ RIG'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isRigRequired ? 'คำนวณ ERIG 40 IU/kg หรือ HRIG 20 IU/kg ฉีดรอบแผลทุกแผล ยาที่เหลือฉีดเข้ากล้าม' : 'แผล Category I, II หรือผู้ที่เคยฉีดวัคซีนครบในอดีต ไม่ต้องให้ RIG'}
                </p>
              </div>
            </div>

            {/* การจัดการสัตว์ */}
            <div className="p-2 bg-amber-50/90 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
              <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>การติดตามสัตว์: </strong>
                {animalStatus === 'owned_alive'
                  ? 'กักขังดูอาการสัตว์อย่างใกล้ชิด 10 วัน หากพ้น 10 วันสัตว์ยังปกติ แข็งแรง กินอาหารได้ สามารถพิจารณาหยุดฉีดวัคซีนเข็มถัดไปได้'
                  : 'ประสานปศุสัตว์อำเภอทันทีเพื่อสอบสวนโรคในสัตว์ และติดตามผู้สัมผัสร่วมคนอื่นๆ'}
              </div>
            </div>
          </div>

          {/* Section 3: Calculated Schedule Table */}
          {woundSeverity !== 'cat1' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-600" />
                  <span>ตารางคำนวณวันนัดฉีดวัคซีน PEP</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  คำนวณนับจากวันที่สัมผัส: {addDays(exposureDate, 0)}
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2 px-3 text-left w-20">ครั้งที่/วัน</th>
                      <th className="py-2 px-3 text-left">กำหนดวันนัด</th>
                      <th className="py-2 px-3 text-left">รายละเอียดการให้ยา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {schedule.map((s, idx) => (
                      <tr key={s.day} className={idx === 0 ? 'bg-blue-50/40 font-semibold' : ''}>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[10px]">
                            {s.day}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-blue-900 font-bold">
                          {s.date}
                        </td>
                        <td className="py-2 px-3 text-slate-600 text-[11px]">
                          {s.label} — <span className="text-slate-500">{s.detail}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs gap-1 text-slate-600"
            >
              <RotateCcw size={12} />
              <span>เริ่มคำนวณใหม่</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                className="text-xs gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Copy size={13} />
                <span>{copied ? 'คัดลอกเรียบร้อยแล้ว ✓' : 'คัดลอกผลการประเมิน'}</span>
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
