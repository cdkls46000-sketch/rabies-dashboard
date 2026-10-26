'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/data-context';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

export function SessionTimeoutDialog() {
  const { 
    isSessionWarningOpen, 
    sessionRemainingSeconds, 
    extendSession, 
    logout 
  } = useData();

  const minutes = Math.floor(sessionRemainingSeconds / 60);
  const seconds = sessionRemainingSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <Dialog open={isSessionWarningOpen} onOpenChange={() => {}}>
      <DialogContent className="w-[92vw] sm:max-w-md p-5 sm:p-6 rounded-2xl">
        <DialogHeader className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
            เซสชันความปลอดภัยใกล้หมดอายุ
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600 leading-relaxed">
            เนื่องจากไม่มีการใช้งานระบบเป็นเวลานาน เพื่อความปลอดภัยตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) 
            ระบบจะตัดการเชื่อมต่อและปิดการแสดงผลชื่อผู้สัมผัสโรคโดยอัตโนมัติในอีก
          </DialogDescription>
        </DialogHeader>

        {/* Live Countdown Display */}
        <div className="my-3 p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-center space-y-1">
          <span className="text-xs font-semibold text-amber-900">เวลาที่เหลืออยู่</span>
          <div className="text-3xl font-extrabold text-amber-700 font-mono tracking-wider">
            {formattedTime}
          </div>
          <p className="text-[11px] text-amber-800">
            กรุณากด &quot;ต่อเวลาใช้งาน&quot; เพื่อทำงานต่อ หรือระบบจะนำท่านออกจากระบบเมื่อหมดเวลา
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => logout('เซสชันหมดอายุเนื่องจากไม่มีการใช้งาน')}
            className="w-full sm:w-1/2 h-9 text-xs text-slate-700 hover:text-rose-600 hover:bg-rose-50 border-slate-300 gap-1.5"
          >
            <LogOut size={14} />
            <span>ออกจากระบบตอนนี้</span>
          </Button>

          <Button
            type="button"
            onClick={extendSession}
            className="w-full sm:w-1/2 h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-sm shadow-blue-500/20 active:scale-98"
          >
            <RefreshCw size={14} />
            <span>ต่อเวลาใช้งาน</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
