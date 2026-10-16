'use client';

import React, { useState } from 'react';
import { 
  PhoneCall, 
  Bike, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User, 
  Send,
  MessageSquare,
  FileCheck
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
import { Textarea } from '@/components/ui/textarea';
import { PatientListItem } from '@/types';
import { useData } from '@/context/data-context';

interface FollowUpTrackerDialogProps {
  patient: PatientListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FollowUpTrackerDialog({ patient, open, onOpenChange }: FollowUpTrackerDialogProps) {
  const { updatePatient } = useData();
  const [resultStatus, setResultStatus] = useState<string>('rescheduled');
  const [followUpNotes, setFollowUpNotes] = useState<string>('');
  const [isCopiedVhv, setIsCopiedVhv] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!patient) return null;

  const handleCopyVhvMessage = () => {
    const text = `🚨 ด่วน! ขอให้ อสม. ช่วยติดตามผู้สัมผัสโรคพิษสุนัขบ้า (ขาดนัดฉีดวัคซีน)
👤 ชื่อผู้ป่วย: ${patient.name} (อายุ ${patient.age} ปี)
📍 ที่อยู่: ${patient.village_name || ''} ${patient.subdistrict || ''} ${patient.district || ''}
📞 เบอร์ติดต่อ: ${patient.phone || '08X-XXX-XXXX'}
🩸 บาดแผล: WHO Category ${patient.wound_category} (สัมผัสสัตว์: ${patient.animal_species || 'สุนัข'})
💉 สถานะล่าสุด: ${patient.vaccine_status} (เลยกำหนดนัดฉีด)

⚠️ กรุณาแจ้งผู้ป่วยให้รีบมาติดต่อรับวัคซีนที่ รพ.สต. หรือ รพ. ใกล้บ้านโดยด่วนที่สุด เนื่องจากโรคพิษสุนัขบ้าหากมีอาการแล้วจะรักษาไม่หาย`;

    navigator.clipboard.writeText(text);
    setIsCopiedVhv(true);
    setTimeout(() => setIsCopiedVhv(false), 2500);
  };

  const handleSaveTracking = () => {
    let newStatus = patient.follow_up_status;
    let newVaccineStatus = patient.vaccine_status;

    if (resultStatus === 'completed_other') {
      newStatus = 'completed';
      newVaccineStatus = `${patient.vaccine_status} (ฉีด รพ.อื่น)`;
    } else if (resultStatus === 'rescheduled') {
      newStatus = 'pending';
    }

    const updatedNotes = [
      patient.notes || '',
      `[ติดตามเมื่อ ${new Date().toLocaleDateString('th-TH')}]: ${
        resultStatus === 'rescheduled' ? 'ติดต่อได้ นัดมาฉีดใหม่' :
        resultStatus === 'completed_other' ? 'รับบริการ รพ.อื่นแล้ว' :
        resultStatus === 'vhv_sent' ? 'ประสาน อสม. เคาะบ้าน' : 'ติดต่อไม่ได้'
      } ${followUpNotes ? `- ${followUpNotes}` : ''}`
    ].filter(Boolean).join(' | ');

    updatePatient(patient.hn, {
      follow_up_status: newStatus,
      vaccine_status: newVaccineStatus,
      notes: updatedNotes
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-4 sm:p-6">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <PhoneCall size={20} />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
                <span>ติดตามผู้ขาดนัด / เลยกำหนดฉีด</span>
                <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-800 border-rose-300 animate-pulse">
                  Active Tracing
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                บันทึกการติดตามทางโทรศัพท์หรือประสาน อสม. เคาะประตูบ้าน
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 pt-2 text-xs">
          {/* Patient Card Header */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-slate-900 text-sm">{patient.name}</strong>
                <span className="text-slate-500 text-xs ml-1.5">({patient.age} ปี | HN: {patient.hn})</span>
              </div>
              <Badge className="bg-rose-600 text-white text-[10px]">
                เลยกำหนดนัด
              </Badge>
            </div>

            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              <span>{patient.village_name || ''} {patient.subdistrict || ''} {patient.district || ''}</span>
            </div>

            <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span>สถานะเดิม: <strong>{patient.vaccine_status}</strong></span>
              <span className="text-rose-700 font-bold">Category {patient.wound_category}</span>
            </div>
          </div>

          {/* Quick Tracing Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Phone Call */}
            <a
              href={`tel:${patient.phone || '043811000'}`}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors cursor-pointer active:scale-98"
            >
              <PhoneCall size={15} className="text-emerald-700" />
              <span>โทรติดต่อด่วน ({patient.phone || 'โทรศัพท์'})</span>
            </a>

            {/* 2. Dispatch VHV / อสม. */}
            <button
              type="button"
              onClick={handleCopyVhvMessage}
              className="p-2.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-300 text-blue-900 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors cursor-pointer active:scale-98"
            >
              <Bike size={16} className="text-blue-700" />
              <span>{isCopiedVhv ? 'คัดลอกส่ง อสม. แล้ว ✓' : 'ส่งข้อมูลให้ อสม. เคาะบ้าน'}</span>
            </button>
          </div>

          {/* Tracking Result Form */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold text-slate-800">
              ผลการติดตามและข้อสรุปการให้บริการ
            </Label>
            <select
              value={resultStatus}
              onChange={(e) => setResultStatus(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rescheduled">📞 ติดต่อได้แล้ว — นัดหมายมาฉีดใหม่พรุ่งนี้ (เลื่อนนัด)</option>
              <option value="vhv_sent">🛵 ประสาน อสม. และทีม รพ.สต. ลงพื้นที่เคาะประตูบ้าน</option>
              <option value="completed_other">🏥 ไปรับบริการฉีดต่อที่โรงพยาบาล/คลินิกอื่นแล้ว</option>
              <option value="unreachable">❌ โทรไม่ติด / ติดต่อไม่ได้ (จะโทรซ้ำใน 24 ชม.)</option>
              <option value="refused">⚠️ ผู้ป่วยหรือญาติปฏิเสธการฉีดวัคซีนต่อเนื่อง</option>
            </select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-800 mb-1 block">
              บันทึกเพิ่มเติม (Notes)
            </Label>
            <Textarea
              placeholder="ระบุรายละเอียด เช่น ชื่อ อสม. ที่รับเรื่อง, วันที่นัดหมายใหม่, หรือเหตุผล..."
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              className="h-18 text-xs resize-none"
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              ยกเลิก
            </Button>
            <Button
              size="sm"
              onClick={handleSaveTracking}
              disabled={savedSuccess}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 px-4"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  <span>บันทึกสำเร็จ</span>
                </>
              ) : (
                <>
                  <FileCheck size={14} />
                  <span>บันทึกผลการติดตาม</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
