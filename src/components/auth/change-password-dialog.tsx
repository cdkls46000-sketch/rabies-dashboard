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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';
import { validatePasswordStrength } from '@/lib/security';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export function ChangePasswordDialog() {
  const { 
    isChangePasswordOpen, 
    setIsChangePasswordOpen, 
    currentUser, 
    changePassword 
  } = useData();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validation = validatePasswordStrength(newPassword);

  const handleReset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      handleReset();
    }
    setIsChangePasswordOpen(open);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('กรุณาระบุรหัสผ่านปัจจุบัน');
      return;
    }

    if (!validation.passed) {
      setError('รหัสผ่านใหม่ยังไม่ผ่านเกณฑ์ความปลอดภัยขั้นต่ำ กรุณาตรวจสอบเงื่อนไขด้านล่าง');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (currentPassword === newPassword) {
      setError('รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = changePassword(currentPassword, newPassword);
      setIsLoading(false);

      if (!res.success) {
        setError(res.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาตรวจสอบรหัสผ่านปัจจุบัน');
      } else {
        setSuccess(true);
        setTimeout(() => {
          handleClose(false);
        }, 1800);
      }
    }, 400);
  };

  if (!currentUser) return null;

  return (
    <Dialog open={isChangePasswordOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[96vw] sm:max-w-md p-4 sm:p-6 rounded-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                เปลี่ยนรหัสผ่านบัญชีเจ้าหน้าที่
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                สำหรับ {currentUser.name} ({currentUser.position})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {success ? (
          <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-emerald-950">
              เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              รหัสผ่านใหม่ของท่านได้รับการเข้ารหัสลับ Salted SHA-256 บันทึกสู่ฐานข้อมูลเรียบร้อยแล้ว
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">รหัสผ่านปัจจุบัน</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านปัจจุบันเพื่อยืนยันสิทธิ์"
                  className="h-9 text-xs pl-8 pr-8"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowCurrent(p => !p)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">รหัสผ่านใหม่ (ต้องปลอดภัยสูง)</Label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="กำหนดรหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                  className="h-9 text-xs pl-8 pr-8"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowNew(p => !p)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">ระดับความปลอดภัย:</span>
                    <Badge 
                      variant="outline"
                      className={`text-[10px] font-bold ${
                        validation.score <= 1 ? 'bg-rose-50 text-rose-700 border-rose-300' :
                        validation.score === 2 ? 'bg-amber-50 text-amber-700 border-amber-300' :
                        validation.score === 3 ? 'bg-blue-50 text-blue-700 border-blue-300' :
                        'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      {validation.strengthLabel}
                    </Badge>
                  </div>

                  {/* Progress bars */}
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-all ${validation.score >= 1 ? (validation.score === 1 ? 'bg-rose-500' : 'bg-blue-500') : 'bg-slate-200'}`} />
                    <div className={`rounded-full transition-all ${validation.score >= 2 ? (validation.score === 2 ? 'bg-amber-500' : 'bg-blue-500') : 'bg-slate-200'}`} />
                    <div className={`rounded-full transition-all ${validation.score >= 3 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                    <div className={`rounded-full transition-all ${validation.score >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  </div>

                  {/* Policy Checklist */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {validation.checks.minLength ? (
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={13} className="text-slate-400 shrink-0" />
                      )}
                      <span className={validation.checks.minLength ? 'text-emerald-800 font-medium' : 'text-slate-600'}>
                        ความยาวอย่างน้อย 8 ตัวอักษร
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {validation.checks.hasUpper && validation.checks.hasLower ? (
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={13} className="text-slate-400 shrink-0" />
                      )}
                      <span className={validation.checks.hasUpper && validation.checks.hasLower ? 'text-emerald-800 font-medium' : 'text-slate-600'}>
                        มีทั้งตัวพิมพ์ใหญ่ (A-Z) และตัวพิมพ์เล็ก (a-z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {validation.checks.hasNumber ? (
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={13} className="text-slate-400 shrink-0" />
                      )}
                      <span className={validation.checks.hasNumber ? 'text-emerald-800 font-medium' : 'text-slate-600'}>
                        มีตัวเลข (0-9) อย่างน้อย 1 ตัว
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {validation.checks.hasSpecial ? (
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={13} className="text-slate-400 shrink-0" />
                      )}
                      <span className={validation.checks.hasSpecial ? 'text-emerald-800 font-medium' : 'text-slate-600'}>
                        มีอักขระพิเศษ (@, #, $, %, !, *, ?) อย่างน้อย 1 ตัว
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">ยืนยันรหัสผ่านใหม่อีกครั้ง</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้งให้ตรงกัน"
                  className="h-9 text-xs pl-8 pr-8"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleClose(false)}
                className="h-9 text-xs"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !validation.passed || newPassword !== confirmPassword}
                className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-sm"
              >
                <ShieldCheck size={14} />
                <span>{isLoading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}</span>
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
