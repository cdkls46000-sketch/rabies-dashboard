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
import { 
  formatSingleScreenLineMessage,
  formatFullAlertMessage, 
  getLineWebShareUrl, 
  getLineAppDeepLink,
  shareNative 
} from '@/lib/line-share';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageCircle, 
  Smartphone,
  FileText,
  ShieldCheck, 
  Flame 
} from 'lucide-react';

interface LineShareDialogProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

export function LineShareDialog({ alert, isOpen, onClose, onNotify }: LineShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'compact' | 'full'>('compact');

  if (!alert) return null;

  const compactMessage = formatSingleScreenLineMessage(alert);
  const fullMessage = formatFullAlertMessage(alert);
  const activeMessage = mode === 'compact' ? compactMessage : fullMessage;

  const webShareUrl = getLineWebShareUrl(alert);
  const appDeepLink = getLineAppDeepLink(alert);

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(activeMessage).then(() => {
          setCopied(true);
          if (onNotify) {
            const modeLabel = mode === 'compact' ? 'กระชับ (หน้าเดียว ไม่ติด See more)' : 'ฉบับเต็มทางการ';
            onNotify(`📋 คัดลอกข้อความ${modeLabel} หัวที่ ${alert.head_no || ''} แล้ว นำไปกดวาง (Ctrl+V) ใน LINE ได้ทันที`);
          }
          setTimeout(() => setCopied(false), 3000);
        }).catch(() => {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    } catch {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = activeMessage;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      if (onNotify) {
        onNotify(`📋 คัดลอกข้อความหัวที่ ${alert.head_no || ''} เรียบร้อยแล้ว`);
      }
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleOpenLineApp = () => {
    handleCopy();
    window.location.href = appDeepLink;
  };

  const handleOpenLineWeb = () => {
    handleCopy();
    window.open(webShareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    const success = await shareNative(alert);
    if (success && onNotify) {
      onNotify('📲 แชร์ข้อมูลเข้าสู่ LINE เรียบร้อยแล้ว');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg w-[95vw] p-4 sm:p-6 rounded-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Share2 size={16} />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                แชร์รายงานเหตุการณ์เข้ากลุ่ม LINE
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                ส่งต่อข้อมูลเตือนภัยโรคพิษสุนัขบ้าและผลตรวจ Lab เข้าสู่กลุ่มปฏิบัติการ
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Cardlet header */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-900 text-sm">
              หัวที่ {alert.head_no}: ผลบวก {alert.animal_species || 'สัตว์'}
            </span>
            {alert.is_recent_1_month && (
              <Badge className="bg-red-600 text-white text-[10px] flex items-center gap-1 font-semibold">
                <Flame size={11} /> ในรอบ 1 เดือน
              </Badge>
            )}
          </div>
          <p className="text-slate-600 text-[11px]">
            📍 {alert.location} | วันที่: {alert.date_thai || 'พ.ศ. 2569'}
          </p>
          <p className="text-red-700 font-semibold text-[11px]">
            🔬 ผล Lab: {alert.lab_result || 'ยืนยันผลบวก (DFA/RT-PCR +)'}
          </p>
        </div>

        {/* Message Format Selector (Tabs) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">รูปแบบข้อความสำหรับส่ง LINE:</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {mode === 'compact' ? '✓ ไม่ติด See more' : 'ฉบับทางการ'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setMode('compact')}
              className={`py-1.5 px-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'compact'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone size={13} className="text-emerald-600" />
              <span>หน้าเดียว (ไม่ติด See more)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('full')}
              className={`py-1.5 px-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'full'
                  ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={13} className="text-blue-600" />
              <span>ฉบับเต็มทางการ</span>
            </button>
          </div>
        </div>

        {/* Message preview textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-[11px] text-slate-500">
              {mode === 'compact' 
                ? '📱 ข้อความ 7 บรรทัดพอดีหน้าจอ LINE (ผู้รับไม่ต้องกด See more):' 
                : '📄 ข้อความฉบับยาวระบุรายละเอียดทุกหัวข้อ:'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-600" />
                  <span className="text-emerald-600">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>คัดลอก</span>
                </>
              )}
            </button>
          </div>
          <textarea
            readOnly
            value={activeMessage}
            rows={mode === 'compact' ? 7 : 8}
            className={`w-full text-[11px] font-mono p-2.5 rounded-lg text-slate-800 focus:outline-none resize-none leading-relaxed transition-colors ${
              mode === 'compact'
                ? 'bg-emerald-50/40 border border-emerald-200'
                : 'bg-slate-50 border border-slate-200'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Main Copy Button */}
          <Button
            type="button"
            onClick={handleCopy}
            className={`w-full text-white text-xs h-9 font-semibold gap-1.5 shadow-xs cursor-pointer active:scale-98 ${
              mode === 'compact'
                ? 'bg-[#06C755] hover:bg-[#05b34c]'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} className="text-white" />
                <span>คัดลอกเรียบร้อยแล้ว (กด Ctrl+V ในแชต LINE ได้ทันที)</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>
                  {mode === 'compact'
                    ? '📋 คัดลอกข้อความหน้าเดียว (ไม่ติด See more)'
                    : '📋 คัดลอกรายงานฉบับเต็ม'}
                </span>
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Open LINE Desktop App */}
            <Button
              type="button"
              onClick={handleOpenLineApp}
              variant="outline"
              className="border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 text-xs h-9 font-semibold gap-1.5 shadow-2xs cursor-pointer active:scale-98"
              title="เปิดแอปพลิเคชัน LINE ที่ติดตั้งอยู่บนเครื่องคอมพิวเตอร์หรือมือถือ"
            >
              <MessageCircle size={14} className="text-[#06C755]" />
              <span>เปิดแอป LINE บนเครื่อง</span>
            </Button>

            {/* Open LINE Web Share */}
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenLineWeb}
              className="border-slate-300 hover:bg-slate-50 text-slate-700 text-xs h-9 font-semibold gap-1.5 cursor-pointer active:scale-98"
              title="เปิดหน้าต่างแชร์ทางการของ LINE ผ่านเว็บบราวเซอร์"
            >
              <ExternalLink size={14} />
              <span>เปิด LINE Web Share</span>
            </Button>
          </div>

          {/* Native Mobile Share Sheet (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleNativeShare}
              className="w-full text-xs h-8 text-slate-700 font-medium gap-1.5 cursor-pointer"
            >
              <Share2 size={13} />
              <span>แชร์ผ่านระบบมือถือ (เลือกส่งเข้าแอป LINE)</span>
            </Button>
          )}
        </div>

        {/* Helpful Footnote */}
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] space-y-1">
          <p className="font-semibold flex items-center gap-1 text-emerald-950">
            <ShieldCheck size={13} className="text-emerald-700 shrink-0" />
            <span>เคล็ดลับการส่งข้อความหน้าเดียว (ไม่ติด See more):</span>
          </p>
          <p className="text-emerald-800 leading-relaxed">
            ระบบจัดรูปแบบข้อความไว้เพียง <strong>7 บรรทัด</strong> พอดีกับขนาดหน้าต่างแชต LINE ทุกขนาด เมื่อคัดลอกแล้วนำไปกด <strong>Ctrl + V (วาง)</strong> ส่งในกลุ่ม ผู้รับจะมองเห็นข้อมูลสำคัญครบทุกมิติได้ทันทีโดยไม่ต้องคลิกคำว่า <em>See more</em> ครับ
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
