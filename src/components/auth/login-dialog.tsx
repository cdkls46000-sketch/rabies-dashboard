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
import { useData } from '@/context/data-context';
import { Shield, ShieldAlert, Lock, UserCheck, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';

export function LoginDialog() {
  const { 
    isLoginOpen, 
    setIsLoginOpen, 
    login, 
    loginDemo, 
    loginReason 
  } = useData();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);
      if (!success) {
        setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (ทดสอบ: juthamas / Juthamas@2569 หรือ kongrit / Kongrit@2569)');
      } else {
        setUsername('');
        setPassword('');
      }
    }, 200);
  };

  const handleDemoLogin = (role: 'officer' | 'admin') => {
    setError(null);
    loginDemo(role);
    setUsername('');
    setPassword('');
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="w-[96vw] sm:max-w-md p-4 sm:p-6 rounded-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                เข้าสู่ระบบสำหรับเจ้าหน้าที่
              </DialogTitle>
              <p className="text-[11px] text-slate-500 font-medium">
                ระบบเฝ้าระวังโรคพิษสุนัขบ้า สสจ.กาฬสินธุ์ (PDPA Secured)
              </p>
            </div>
          </div>
          <DialogDescription className="sr-only">
            เข้าสู่ระบบเพื่อปลดล็อคการดูชื่อเต็มตาม PDPA และบันทึกเคสใหม่
          </DialogDescription>
        </DialogHeader>

        {/* Reason banner if triggered by a protected action */}
        {loginReason && (
          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block text-amber-950">ต้องยืนยันตัวตนเจ้าหน้าที่</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">{loginReason}</p>
            </div>
          </div>
        )}

        {/* Quick Demo Login One-Click Section */}
        <div className="p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>เข้าสู่ระบบด่วน 1 คลิก (สำหรับเจ้าหน้าที่ / ทดสอบ)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin('officer')}
              className="p-2.5 bg-white hover:bg-blue-50/60 border border-blue-200 rounded-lg text-left transition-all hover:border-blue-400 active:scale-98 shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  จบ
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">คุณจุฑามาศ บัวลอย</p>
                  <p className="text-[10px] text-slate-500 truncate">จนท. ควบคุมโรค สสจ.</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 bg-white hover:bg-indigo-50/60 border border-indigo-200 rounded-lg text-left transition-all hover:border-indigo-400 active:scale-98 shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  คว
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">คุณคงฤทธิ์ วันจรูญ</p>
                  <p className="text-[10px] text-slate-500 truncate">หัวหน้ากลุ่มงาน (Admin)</p>
                </div>
              </div>
            </button>
          </div>

          {/* Generated Credential Reference Box */}
          <div className="p-2 bg-white/80 border border-blue-200/60 rounded-lg text-[10px] text-slate-600 space-y-0.5">
            <div className="font-semibold text-blue-900 flex items-center gap-1">
              <KeyRound size={11} className="text-blue-600" />
              <span>รหัสผ่านเริ่มต้นที่ระบบสร้างให้ (เปลี่ยนได้ทีหลัง):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-slate-600 font-mono">
              <p>• จุฑามาศ: <span className="text-blue-700 font-bold">Juthamas@2569</span></p>
              <p>• คงฤทธิ์: <span className="text-indigo-700 font-bold">Kongrit@2569</span></p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2 text-slate-400 font-medium">หรือกรอกบัญชีผู้ใช้</span>
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="font-bold">❌</span>
              <span>{error}</span>
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
                required
              />
              <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">รหัสผ่าน (Password)</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="เช่น Juthamas@2569 หรือ Kongrit@2569"
                className="h-9 text-xs pl-8 pr-8 font-medium"
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
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 gap-1.5 shadow-md shadow-blue-500/20 active:scale-98 transition-all"
            >
              <UserCheck size={15} />
              {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ (Sign In)'}
            </Button>
          </div>
        </form>

        {/* PDPA legal note */}
        <div className="text-[10px] text-slate-400 leading-tight pt-2 border-t border-slate-100 flex items-start gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            ระบบนี้คุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) 
            ข้อมูลชื่อ-สกุล และประวัติการรักษาจะถูกปกปิดเป็นความลับสำหรับสาธารณะ และเปิดเผยให้เฉพาะเจ้าหน้าที่สาธารณสุขผู้มีหน้าที่เท่านั้น
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
