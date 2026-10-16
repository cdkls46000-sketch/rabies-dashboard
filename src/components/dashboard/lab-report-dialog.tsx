'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/types';
import { getLabPdfUrl } from '@/lib/pdf-utils';
import { 
  FileText, 
  ExternalLink, 
  Printer, 
  Copy, 
  Check, 
  Microscope, 
  Flame, 
  ShieldCheck, 
  Building2,
  Calendar,
  MapPin,
  Download
} from 'lucide-react';

interface LabReportDialogProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

export function LabReportDialog({ alert, isOpen, onClose, onNotify }: LabReportDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!alert) return null;

  const pdfUrl = getLabPdfUrl(alert.head_no);
  const headLabel = alert.head_no ? `หัวที่ ${alert.head_no}` : '';
  const sampleId = alert.sample_id || `KLS-69-${String(alert.head_no || '0').padStart(3, '0')}`;
  const dateStr = alert.date_thai || alert.lab_date || 'พ.ศ. 2569';
  const species = alert.animal_species || 'สัตว์';

  const handleOpenPdf = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    if (onNotify) {
      onNotify(`📄 เปิดเอกสารผลตรวจ Lab ${headLabel} เรียบร้อยแล้ว`);
    }
  };

  const handlePrint = () => {
    // Open in new tab and suggest print
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
    if (onNotify) {
      onNotify(`🖨️ เปิดเอกสารสำหรับสั่งพิมพ์ (Print) เรียบร้อยแล้ว`);
    }
  };

  const handleCopyDetails = () => {
    const text = [
      `🔬 ผลการตรวจชันสูตรทางห้องปฏิบัติการโรคพิษสุนัขบ้า [${headLabel}]`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 รหัสตัวอย่าง Lab: ${sampleId}`,
      `📍 พื้นที่เกิดเหตุ: ${alert.location}`,
      `📅 วันที่ยืนยันผล: ${dateStr}`,
      `🐕 ชนิดสัตว์: ${species}`,
      `🔬 ผลการตรวจ: ${alert.lab_result || 'ยืนยันผลบวก (Rabies Positive: DFA / RT-PCR +)'}`,
      `🏛️ หน่วยงานตรวจ: ${alert.lab_agency || 'ศวพ.ขอนแก่น (กรมปศุสัตว์) / สถาบันสุขภาพสัตว์แห่งชาติ'}`,
      `👥 ข้อมูลผู้สัมผัสโรค (คน): ${alert.exposures_count ? `${alert.exposures_count} ราย` : '0 ราย'} (ผู้ป่วยในคน = 0 ราย)`,
      `📄 ดาวน์โหลดเอกสาร PDF: ${typeof window !== 'undefined' ? window.location.origin : ''}${pdfUrl}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      if (onNotify) {
        onNotify(`📋 คัดลอกรายละเอียดผลตรวจ Lab ${headLabel} เรียบร้อยแล้ว`);
      }
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-[96vw] p-4 sm:p-6 rounded-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="space-y-1 pb-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 border border-red-200 shadow-2xs">
                <Microscope size={20} />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>ใบรายงานผลทางห้องปฏิบัติการ (Lab Report PDF)</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building2 size={12} className="text-slate-400" />
                  <span>ศูนย์วิจัยและพัฒนาการสัตวแพทย์ภาคตะวันออกเฉียงเหนือตอนบน (ศวพ.ขอนแก่น) กรมปศุสัตว์</span>
                </DialogDescription>
              </div>
            </div>

            <Badge variant="outline" className="hidden sm:inline-flex bg-red-50 text-red-700 border-red-200 font-mono text-xs">
              {sampleId}
            </Badge>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="space-y-3 py-2 overflow-y-auto flex-1 pr-1">
          {/* Metadata Cardlet */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {headLabel}: ผลบวก {species}
                </span>
                {alert.is_recent_1_month && (
                  <Badge className="bg-red-600 text-white text-[10px] flex items-center gap-1 font-semibold">
                    <Flame size={11} /> ในรอบ 1 เดือน
                  </Badge>
                )}
                <span className="text-slate-500 font-mono text-[11px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                  {sampleId}
                </span>
              </div>

              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <Calendar size={12} /> {dateStr}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
              <p className="text-slate-700 flex items-center gap-1.5 font-medium">
                <MapPin size={13} className="text-red-500 shrink-0" />
                <span><strong>สถานที่:</strong> {alert.location}</span>
              </p>
              <p className="text-red-700 font-semibold flex items-center gap-1.5">
                <Microscope size={13} className="text-red-600 shrink-0" />
                <span><strong>ผลวิเคราะห์:</strong> {alert.lab_result || 'ผลบวก (DFA / RT-PCR +)'}</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full">
              <Button
                type="button"
                size="sm"
                onClick={handleOpenPdf}
                className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 px-2.5 sm:px-3 gap-1.5 shadow-xs font-semibold cursor-pointer active:scale-95 col-span-2 sm:col-span-1"
              >
                <Download size={13} />
                <span className="sm:hidden">เปิดดู / โหลด PDF ตัวจริง</span>
                <span className="hidden sm:inline">เปิดดู / ดาวน์โหลดไฟล์ PDF ต้นฉบับ</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8 px-2.5 sm:px-3 text-xs text-slate-700 border-slate-300 hover:bg-slate-50 gap-1.5 cursor-pointer font-medium"
              >
                <Printer size={13} />
                <span>สั่งพิมพ์</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyDetails}
                className="h-8 px-2.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 gap-1.5 cursor-pointer font-medium"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700">คัดลอกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>คัดลอกสรุป</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-100 min-h-[420px] sm:min-h-[500px]">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-[420px] sm:h-[500px] border-0"
              title={`ใบรายงานผล Lab ${headLabel}`}
            />
          </div>

          {/* Footnote */}
          <div className="p-2.5 bg-blue-50/70 border border-blue-200/70 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
            <ShieldCheck size={14} className="text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              เอกสารรายงานผลตรวจวิเคราะห์ชันสูตรโรคสัตว์ ออกโดยหน่วยงานมาตรฐานสากล ศวพ.ขอนแก่น กรมปศุสัตว์ เชื่อมโยงข้อมูลผ่านระบบเฝ้าระวัง One Health จ.กาฬสินธุ์
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
