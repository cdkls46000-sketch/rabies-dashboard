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
  Sparkles, 
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

  if (!alert) return null;

  const fullMessage = formatFullAlertMessage(alert);
  const webShareUrl = getLineWebShareUrl(alert);
  const appDeepLink = getLineAppDeepLink(alert);

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(fullMessage).then(() => {
          setCopied(true);
          if (onNotify) {
            onNotify(`📋 คัดลอกข้อความหัวที่ ${alert.head_no || ''} เรียบร้อยแล้ว นำไปกดวาง (Ctrl+V) ใน LINE ได้ทันที`);
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
      textarea.value = fullMessage;
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
    // Copy full text first
    handleCopy();
    // Open LINE app via deep link
    window.location.href = appDeepLink;
  };

  const handleOpenLineWeb = () => {
    // Copy full text first
    handleCopy();
    // Open official LINE web share (pure URL without text to prevent HTTP 400)
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
      <DialogContent className="max-w-lg w-[95vw] p-4 sm:p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
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

        {/* Message preview textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold flex items-center gap-1">
              <Sparkles size={13} className="text-blue-600" />
              ข้อความรายงานฉบับเต็มที่จัดรูปแบบแล้ว:
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
            value={fullMessage}
            rows={7}
            className="w-full text-[11px] font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Option 1: Direct copy (Recommended for PC users who already have LINE open) */}
          <Button
            type="button"
            onClick={handleCopy}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold gap-1.5 shadow-xs cursor-pointer active:scale-98"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-300" />
                <span>คัดลอกรายงานฉบับเต็มแล้ว (กด Ctrl+V ใน LINE ได้ทันที)</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>📋 คัดลอกข้อความฉบับเต็ม (แนะนำสำหรับเปิดใน LINE บนคอม)</span>
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Option 2: Open LINE Desktop App */}
            <Button
              type="button"
              onClick={handleOpenLineApp}
              className="bg-[#06C755] hover:bg-[#05b34c] text-white text-xs h-9 font-semibold gap-1.5 shadow-xs cursor-pointer active:scale-98"
              title="เปิดแอปพลิเคชัน LINE ที่ติดตั้งอยู่บนเครื่องคอมพิวเตอร์หรือมือถือ"
            >
              <MessageCircle size={14} />
              <span>เปิดแอป LINE บนเครื่อง</span>
            </Button>

            {/* Option 3: Open LINE Web Share */}
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenLineWeb}
              className="border-slate-300 hover:bg-slate-50 text-slate-700 text-xs h-9 font-semibold gap-1.5 cursor-pointer active:scale-98"
              title="เปิดหน้าต่างแชร์ทางการของ LINE ผ่านเว็บบราวเซอร์ (ไม่มี Error 400)"
            >
              <ExternalLink size={14} />
              <span>เปิด LINE Web Share</span>
            </Button>
          </div>

          {/* Option 4: Native Mobile Share Sheet (if supported) */}
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
            <span>วิธีส่งเข้ากลุ่ม LINE ที่สะดวกที่สุดบนคอมพิวเตอร์ (PC):</span>
          </p>
          <p className="text-emerald-800 leading-relaxed">
            เมื่อกดปุ่ม <strong>&apos;คัดลอกข้อความฉบับเต็ม&apos;</strong> แล้ว ให้สลับไปยังหน้าต่าง LINE บนคอมพิวเตอร์ที่เปิดอยู่ เปิดห้องแชตกลุ่ม แล้วกด <strong>Ctrl + V (วาง)</strong> และกดส่งได้ทันทีครับ
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
