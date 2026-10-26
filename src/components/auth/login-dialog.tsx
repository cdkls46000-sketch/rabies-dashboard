'use client';

import React, { useState, useEffect } from 'react';
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
import { OtpChallenge } from '@/lib/security';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Smartphone, 
  Clock, 
  ArrowLeft, 
  RotateCw, 
  AlertTriangle,
  Send,
  Building2
} from 'lucide-react';

export function LoginDialog() {
  const { 
    isLoginOpen, 
    setIsLoginOpen, 
    loginStep1, 
    loginStep2, 
    resendOtpChallenge,
    loginReason 
  } = useData();

  // Step state: 1 = Password, 2 = 2FA OTP
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // 2FA state
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(60);

  // Lockout state
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Feedback & loading
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isLoginOpen) {
      setStep(1);
      setUsername('');
      setPassword('');
      setOtpCode('');
      setError(null);
      setAttemptsRemaining(null);
      setChallenge(null);
      setIsLoading(false);
    }
  }, [isLoginOpen]);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLocked || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          setIsLocked(false);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockoutSeconds]);

  // 2FA OTP countdown timer
  useEffect(() => {
    if (step !== 2 || !challenge) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((challenge.expiresAt - now) / 1000));
      setOtpRemainingSeconds(remaining);
      if (remaining === 0) {
        setError('รหัส OTP หมดอายุแล้ว กรุณากดปุ่มขอรหัส OTP ใหม่');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, challenge]);

  // Handle Step 1 (Username & Password verification)
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginStep1(username, password);
      setIsLoading(false);

      if (result.isLocked) {
        setIsLocked(true);
        setLockoutSeconds(result.remainingSeconds || 300);
        setError(`⚠️ ตรวจพบลักษณะการสุ่มรหัสผ่าน บัญชีถูกระงับชั่วคราว ${Math.ceil((result.remainingSeconds || 300) / 60)} นาที`);
        return;
      }

      if (!result.success || !result.challenge) {
        setError(result.error || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
        if (result.attemptsRemaining !== undefined) {
          setAttemptsRemaining(result.attemptsRemaining);
        }
        return;
      }

      // Step 1 Success -> Proceed to Step 2 (2FA OTP)
      setChallenge(result.challenge);
      setOtpRemainingSeconds(60);
      setOtpCode('');
      setStep(2);
      setError(null);
    }, 350);
  };

  // Handle Step 2 (2FA OTP verification)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginStep2(challenge, otpCode);
      setIsLoading(false);

      if (!result.success) {
        setError(result.error || 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      } else {
        // Logged in successfully! Dialog will automatically close via context
      }
    }, 350);
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    if (!challenge) return;
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const newChallenge = resendOtpChallenge(challenge.username);
      setIsLoading(false);
      if (newChallenge) {
        setChallenge(newChallenge);
        setOtpRemainingSeconds(60);
        setOtpCode('');
      } else {
        setError('ไม่สามารถส่งรหัส OTP ใหม่ได้ กรุณาลองใหม่อีกครั้ง');
      }
    }, 300);
  };

  const selectUser = (selectedUsername: string) => {
    setUsername(selectedUsername);
    setPassword('');
    setError(null);
    setAttemptsRemaining(null);
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="w-[96vw] sm:max-w-md p-4 sm:p-6 rounded-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                  {step === 1 ? 'เข้าสู่ระบบความปลอดภัยสูง' : 'การยืนยันตัวตนสองชั้น (2FA)'}
                </DialogTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-semibold">
                  {step === 1 ? 'Step 1/2' : 'Step 2/2'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                ระบบเฝ้าระวังโรคพิษสุนัขบ้า สสจ.กาฬสินธุ์ (PDPA & CyberSec Level 4)
              </p>
            </div>
          </div>
          <DialogDescription className="sr-only">
            เข้าสู่ระบบด้วยการยืนยันตัวตนหลายปัจจัย (Multi-Factor Authentication)
          </DialogDescription>
        </DialogHeader>

        {/* Reason banner if triggered by a protected action */}
        {loginReason && step === 1 && (
          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block text-amber-950">ต้องยืนยันตัวตนเจ้าหน้าที่</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">{loginReason}</p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 1: Username & Salted Cryptographic Password Verification  */}
        {/* ============================================================== */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Lockout Warning Banner */}
            {isLocked && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-700">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                  <span>ระบบระงับการเข้าสู่ระบบชั่วคราว (Brute-Force Lockout)</span>
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  เนื่องจากมีการระบุรหัสผ่านไม่ถูกต้องเกิน 5 ครั้ง บัญชีนี้ถูกระงับเพื่อป้องกันการโจมตี
                </p>
                <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg border border-rose-200">
                  <Clock size={14} className="text-rose-600" />
                  <span className="text-xs font-bold text-rose-700 font-mono">
                    ปลดล็อคอัตโนมัติใน: {Math.floor(lockoutSeconds / 60)}:{(lockoutSeconds % 60).toString().padStart(2, '0')} นาที
                  </span>
                </div>
              </div>
            )}

            {/* Official Personnel Selector */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building2 size={13} className="text-blue-600" />
                  <span>เลือกบัญชีเจ้าหน้าที่ผู้มีสิทธิ์ใช้งาน:</span>
                </span>
                <span className="text-[10px] text-slate-400">คลิกเพื่อเลือกชื่อผู้ใช้</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => selectUser('juthamas')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    username === 'juthamas'
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      จบ
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">คุณจุฑามาศ บัวลอย</p>
                      <p className="text-[10px] text-slate-500 truncate">จนท. ควบคุมโรค สสจ.</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectUser('kongrit')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    username === 'kongrit'
                      ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                      คว
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">คุณคงฤทธิ์ วันจรูญ</p>
                      <p className="text-[10px] text-slate-500 truncate">หัวหน้ากลุ่มงาน (Admin)</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 1 Form */}
            <form onSubmit={handleStep1Submit} className="space-y-3.5">
              {error && !isLocked && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold block">{error}</span>
                    {attemptsRemaining !== null && attemptsRemaining > 0 && (
                      <span className="text-[11px] text-rose-700">
                        โอกาสที่เหลือ: {attemptsRemaining} ครั้ง ก่อนระบบระงับการเข้าสู่ระบบ 5 นาที
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">ชื่อผู้ใช้งาน (Username)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="เช่น juthamas หรือ kongrit"
                    className="h-9 text-xs pl-8 font-medium"
                    disabled={isLocked}
                    required
                  />
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-700">รหัสผ่าน (Password)</Label>
                  <span className="text-[10px] text-slate-400">Salted SHA-256 เข้ารหัสลับ</span>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านความปลอดภัยสูง"
                    className="h-9 text-xs pl-8 pr-8 font-medium"
                    disabled={isLocked}
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading || isLocked || !username.trim() || !password.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 gap-1.5 shadow-md shadow-blue-500/20 active:scale-98 transition-all"
                >
                  <UserCheck size={15} />
                  <span>{isLoading ? 'กำลังตรวจสอบรหัสผ่าน...' : 'ตรวจสอบรหัสผ่านและรับ OTP (Next)'}</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: Two-Factor Authentication (2FA OTP Verification)       */}
        {/* ============================================================== */}
        {step === 2 && challenge && (
          <div className="space-y-4">
            {/* Security Challenge Card */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 to-blue-50/90 rounded-xl border border-indigo-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold text-indigo-950">
                    ยืนยันตัวตนด้วยรหัส OTP 6 หลัก
                  </span>
                </div>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300 font-mono text-[10px] font-bold">
                  {challenge.ref}
                </Badge>
              </div>

              <p className="text-[11px] text-indigo-800 leading-relaxed">
                ระบบได้ส่งรหัส One-Time Password (OTP) สำหรับยืนยันตัวตนเจ้าหน้าที่ไปยังหมายเลขโทรศัพท์ทางการ{' '}
                <strong className="text-indigo-950 font-semibold">{challenge.phoneMasked}</strong>
              </p>

              {/* Progress Bar of OTP Validity */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-indigo-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> อายุรหัส OTP
                  </span>
                  <span className="font-mono font-bold text-indigo-950">
                    {otpRemainingSeconds} วินาที
                  </span>
                </div>
                <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000"
                    style={{ width: `${(otpRemainingSeconds / 60) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Official Government SMS Dispatch Notification (Live Gateway Simulator) */}
            <div className="p-3 bg-slate-900 text-white rounded-xl shadow-md border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <Send size={12} />
                  <span>SMS ราชการ สสจ.กาฬสินธุ์ (Gov Gateway)</span>
                </span>
                <span className="text-[10px] text-slate-400">สดเมื่อสักครู่</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                [สธ. กาฬสินธุ์] รหัส OTP ยืนยันตัวตนของท่านคือ <strong className="text-amber-300 text-sm font-bold tracking-widest">{challenge.code}</strong> (Ref: {challenge.ref}) ห้ามเปิดเผยแก่บุคคลอื่น
              </p>
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setOtpCode(challenge.code)}
                  className="text-[11px] text-blue-300 hover:text-blue-200 underline font-semibold cursor-pointer"
                >
                  ⚡ คลิกที่นี่เพื่อกรอกรหัส OTP อัตโนมัติ ({challenge.code})
                </button>
              </div>
            </div>

            {/* Step 2 Form */}
            <form onSubmit={handleStep2Submit} className="space-y-3.5">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">กรอกรหัส OTP 6 หลัก</Label>
                <Input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="h-11 text-center font-mono text-lg font-bold tracking-widest border-2 focus:border-indigo-600"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                  className="h-9 text-xs text-slate-600 gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>เปลี่ยนบัญชี</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={isLoading || otpRemainingSeconds > 45}
                  className="h-9 text-xs text-indigo-700 hover:bg-indigo-50 gap-1 cursor-pointer"
                  title="ขอรับรหัส OTP ใหม่อีกครั้ง"
                >
                  <RotateCw size={13} />
                  <span>ขอรหัสใหม่</span>
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6 || otpRemainingSeconds === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 gap-1.5 shadow-md shadow-indigo-500/20 active:scale-98 transition-all"
                >
                  <ShieldCheck size={15} />
                  <span>{isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันรหัส OTP'}</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* PDPA legal note */}
        <div className="text-[10px] text-slate-400 leading-tight pt-2 border-t border-slate-100 flex items-start gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            ระบบนี้ควบคุมความปลอดภัยตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และ พ.ร.บ. ไซเบอร์ฯ
            ทุกการเข้าถึงจะถูกบันทึกประวัติ (Audit Log) ตามมาตรฐานความปลอดภัยสารสนเทศ สธ.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
