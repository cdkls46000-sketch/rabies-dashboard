'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Skull, 
  Activity,
  Calendar,
  FastForward,
  RotateCcw,
  Search,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  ListFilter,
  Check,
  User,
  MapPin
} from 'lucide-react';
import { useData } from '@/context/data-context';
import { 
  initialQuarantineAnimals, 
  calculateQuarantineProgress, 
  computeQuarantineSummary 
} from '@/lib/quarantine-data';
import { QuarantineAnimal } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { kalasinDistricts } from '@/lib/mock-data';

const BASE_SYSTEM_DATE = new Date('2026-10-26T12:00:00');

export function QuarantineTracker() {
  const { selectedDistrict, selectedDistrictName } = useData();

  // สถานะสัตว์ทั้งหมด (โหลดจาก localStorage หรือเริ่มต้นด้วย initial data)
  const [animals, setAnimals] = useState<QuarantineAnimal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kalasin_quarantine_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return initialQuarantineAnimals;
  });

  // บันทึกลง localStorage เมื่อข้อมูลเปลี่ยน
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalasin_quarantine_v1', JSON.stringify(animals));
    }
  }, [animals]);

  // การจำลองวันเวลา (+0 วัน, +1 วัน, +3 วัน, +7 วัน, +14 วัน)
  const [simulatedDays, setSimulatedDays] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'registry'>('overview');
  const [registryFilter, setRegistryFilter] = useState<'all' | 'active' | 'completed' | 'symptomatic' | 'dead'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);

  // คำนวณวันที่อ้างอิง ณ ขณะนี้ (Base Date + Simulated Days)
  const referenceDate = useMemo(() => {
    const d = new Date(BASE_SYSTEM_DATE);
    d.setDate(d.getDate() + simulatedDays);
    return d;
  }, [simulatedDays]);

  // สรุปสถิติไดนามิก 4 กล่อง โดยส่ง referenceDate และ selectedDistrict เข้าไปประมวลผล
  const summary = useMemo(() => {
    return computeQuarantineSummary(animals, referenceDate, selectedDistrict);
  }, [animals, referenceDate, selectedDistrict]);

  // คำนวณรายชื่อสัตว์พร้อมความคืบหน้ารายตัว
  const evaluatedAnimals = useMemo(() => {
    return summary.filteredAnimals.map(animal => {
      const progress = calculateQuarantineProgress(animal, referenceDate);
      return {
        ...animal,
        progress,
      };
    });
  }, [summary.filteredAnimals, referenceDate]);

  // กรองตามแท็บย่อยและการค้นหา
  const displayedAnimals = useMemo(() => {
    return evaluatedAnimals.filter(item => {
      // ตัวกรองหมวดหมู่
      if (registryFilter !== 'all' && item.progress.category !== registryFilter) {
        return false;
      }
      // ค้นหา
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(q);
        const matchName = (item.animalName || '').toLowerCase().includes(q);
        const matchBreed = item.breed.toLowerCase().includes(q);
        const matchDistrict = item.district.toLowerCase().includes(q);
        const matchOwner = item.ownerName.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchBreed && !matchDistrict && !matchOwner) {
          return false;
        }
      }
      return true;
    });
  }, [evaluatedAnimals, registryFilter, searchQuery]);

  // ฟอร์มเพิ่มสัตว์ตัวใหม่
  const [newCode, setNewCode] = useState(`Q-2569-${String(animals.length + 1).padStart(3, '0')}`);
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState<'dog' | 'cat' | 'cattle' | 'other'>('dog');
  const [newBreed, setNewBreed] = useState('ไทยพันธุ์ทาง');
  const [newOwnership, setNewOwnership] = useState<'owned' | 'stray'>('owned');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newDistrict, setNewDistrict] = useState(selectedDistrict !== 'all' ? selectedDistrict : 'อ.เมืองกาฬสินธุ์');
  const [newSubdistrict, setNewSubdistrict] = useState('ต.ในเมือง');
  const [newNotes, setNewNotes] = useState('');

  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const todayIso = BASE_SYSTEM_DATE.toISOString().split('T')[0];
    const newAnimal: QuarantineAnimal = {
      id: `Q-2569-${Date.now()}`,
      code: newCode,
      animalName: newName || (newOwnership === 'owned' ? 'สัตว์เลี้ยง' : 'สัตว์จรจัด'),
      species: newSpecies,
      speciesLabel: newSpecies === 'dog' ? 'สุนัข (Dog)' : newSpecies === 'cat' ? 'แมว (Cat)' : 'โค/วัว',
      breed: newBreed || 'ไม่ระบุพันธุ์',
      ownership: newOwnership,
      ownerName: newOwnership === 'owned' ? (newOwnerName || 'เจ้าของสัตว์') : 'ไม่มีเจ้าของ (อบต./เทศบาลดูแล)',
      district: newDistrict,
      subdistrict: newSubdistrict,
      startDate: todayIso,
      quarantineDays: 14,
      clinicalStatus: 'normal',
      notes: newNotes || 'กักสังเกตอาการ 14 วันหลังก่อเหตุสัมผัสคน',
    };

    setAnimals(prev => [newAnimal, ...prev]);
    setIsAddAnimalOpen(false);
    setNewName('');
    setNewOwnerName('');
    setNewNotes('');
    setNewCode(`Q-2569-${String(animals.length + 2).padStart(3, '0')}`);
  };

  // เปลี่ยนสถานะอาการสัตว์รายตัว
  const updateAnimalStatus = (id: string, newStatus: 'normal' | 'symptomatic' | 'dead') => {
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, clinicalStatus: newStatus } : a));
  };

  // แปลงวันที่แบบไทย
  const formatThaiDate = (d: Date) => {
    return d.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="rounded-2xl border-slate-200/90 shadow-xs overflow-hidden bg-white">
      {/* ส่วนหัวการ์ดพร้อมสวิตช์แท็บ & แท็บจำลองวัน */}
      <CardHeader className="p-4 sm:p-5 pb-3.5 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs shrink-0 mt-0.5">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  ระบบติดตามและกักสังเกตอาการสัตว์ 14 วัน
                </CardTitle>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-800 border border-blue-200">
                  Dynamic 14-Day Quarantine Engine
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>คำนวณไดนามิกตามวันที่จริง</span>
                </span>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
                แนวทาง One Health เมื่อสัตว์กัด/ข่วน ให้กักดูอาการ 10-14 วัน — ตัวเลขจะปรับลด/เพิ่มอัตโนมัติเมื่อครบกำหนดเวลา
              </CardDescription>
            </div>
          </div>

          {/* สวิตช์สลับมุมมอง Overview vs Registry */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl self-start lg:self-center shrink-0 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity size={13} />
              <span>ภาพรวมสถิติ</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('registry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'registry'
                  ? 'bg-white text-blue-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter size={13} />
              <span>ทะเบียนสัตว์กักกัน ({summary.filteredAnimals.length})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Date Simulator Controls Bar (แถบจำลองเลื่อนวันเพื่อทดสอบระบบ Dynamic) */}
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 text-xs">
            <Calendar size={14} className="text-blue-700 shrink-0" />
            <span className="font-semibold text-slate-700">วันที่ประมวลผลระบบ:</span>
            <span className="font-black text-blue-900 bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs">
              {formatThaiDate(referenceDate)}
            </span>
            {simulatedDays > 0 ? (
              <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 h-5">
                จำลองเวลา +{simulatedDays} วัน
              </Badge>
            ) : (
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[10px] px-1.5 py-0 h-5">
                วันปัจจุบัน (Real-time)
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">ทดสอบเลื่อนวัน:</span>
            <button
              type="button"
              onClick={() => setSimulatedDays(prev => prev + 1)}
              className="px-2 py-1 rounded bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
              title="เลื่อนวันไปข้างหน้า 1 วัน เพื่อดูสัตว์ที่กักครบ 14 วัน ย้ายกลุ่มอัตโนมัติ"
            >
              <FastForward size={11} />
              <span>+1 วัน</span>
            </button>
            <button
              type="button"
              onClick={() => setSimulatedDays(prev => prev + 3)}
              className="px-2 py-1 rounded bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <FastForward size={11} />
              <span>+3 วัน</span>
            </button>
            <button
              type="button"
              onClick={() => setSimulatedDays(prev => prev + 7)}
              className="px-2 py-1 rounded bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <FastForward size={11} />
              <span>+7 วัน</span>
            </button>
            <button
              type="button"
              onClick={() => setSimulatedDays(prev => prev + 14)}
              className="px-2 py-1 rounded bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <FastForward size={11} />
              <span>+14 วัน</span>
            </button>
            {simulatedDays > 0 && (
              <button
                type="button"
                onClick={() => setSimulatedDays(0)}
                className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>รีเซ็ตเป็นวันนี้</span>
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 space-y-4">
        {/* Dynamic Alert Banner เมื่อมีการเลื่อนวัน */}
        {simulatedDays > 0 && (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-xl text-xs flex items-center justify-between gap-2 shadow-2xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600 shrink-0" />
              <span className="text-slate-800 leading-snug">
                <strong>กลไกการปรับสถานะอัตโนมัติ (Auto-Graduation):</strong> เมื่อเวลาเดินหน้าไป +{simulatedDays} วัน สัตว์ที่กักสะสมครบ 14 วัน และไม่มีอาการผิดปกติ จะถูกย้ายจาก <strong>"อยู่ระหว่างกัก"</strong> ไปบวกเพิ่มที่ <strong>"กักครบ 14 วัน ปกติ"</strong> โดยอัตโนมัติ
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('registry')}
              className="text-blue-700 hover:text-blue-900 font-bold underline shrink-0 cursor-pointer"
            >
              ดูรายชื่อสัตว์ &gt;
            </button>
          </div>
        )}

        {/* 4 Stats Grid: Dynamic Calculation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Box 1: อยู่ระหว่างกัก */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/90 via-white to-blue-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-blue-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-blue-100 text-blue-700">
                  <Clock size={12} />
                </div>
                <span>อยู่ระหว่างกัก</span>
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                Active &lt; 14 วัน
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                {summary.active}
              </span>
              <span className="text-xs font-semibold text-blue-700">ตัว</span>
            </div>
            <p className="text-[11px] text-blue-800/90 font-medium">
              กักดูอาการในกรง/พื้นที่ปิด ({selectedDistrict === 'all' ? '18 อำเภอ' : selectedDistrictName})
            </p>
          </div>

          {/* Box 2: กักครบ 14 วัน ปกติ */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={12} />
                </div>
                <span>กักครบ 14 วัน</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                ปกติ {summary.safePercent}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                {summary.completed.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-700">ตัว</span>
            </div>
            <p className="text-[11px] text-emerald-800/90 font-medium">
              พ้นระยะสงสัย ปลอดภัย (Auto-Graduated)
            </p>
          </div>

          {/* Box 3: แสดงอาการสงสัย */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-amber-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-amber-100 text-amber-700">
                  <AlertTriangle size={12} />
                </div>
                <span>แสดงอาการสงสัย</span>
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                Watch &amp; Isolate
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
                {summary.symptomatic}
              </span>
              <span className="text-xs font-semibold text-amber-700">ตัว</span>
            </div>
            <p className="text-[11px] text-amber-800/90 font-medium">
              แยกกรงเดี่ยว เฝ้าระวังอาการทางประสาท
            </p>
          </div>

          {/* Box 4: ตายระหว่างกัก */}
          <div className="relative overflow-hidden rounded-2xl border border-red-200/90 bg-gradient-to-br from-red-50/90 via-white to-rose-50/30 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-2xl" />
            <div className="flex items-center justify-between text-red-800 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-red-100 text-red-700">
                  <Skull size={12} />
                </div>
                <span>ตายระหว่างกัก</span>
              </span>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                ผลบวก 100%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-red-950 tracking-tight">
                {summary.dead}
              </span>
              <span className="text-xs font-semibold text-red-700">ตัว</span>
            </div>
            <p className="text-[11px] text-red-800/90 font-medium">
              ส่งตรวจหัวสัตว์ที่ ศวพ. ยืนยันเชื้อ
            </p>
          </div>
        </div>

        {/* Tab 1: Overview & Clinical Signs */}
        {activeTab === 'overview' && (
          <div className="p-4 bg-gradient-to-r from-slate-50 via-slate-50/60 to-blue-50/20 border border-slate-200/80 rounded-2xl space-y-2.5 text-xs">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity size={16} className="text-blue-600" />
                <span className="text-sm font-bold">อาการสำคัญที่ต้องเฝ้าระวังระหว่างกัก 14 วัน (Clinical Signs)</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('registry')}
                className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>เปิดดูประวัติสัตว์ทั้ง {summary.filteredAnimals.length} ตัว</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs hover:shadow-xs transition-all">
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-bold px-2 py-0.5">
                  ระยะที่ 1: พฤติกรรมเปลี่ยน (1-3 วัน)
                </Badge>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  สัตว์นิสัยเปลี่ยนจากเชื่องเป็นดุ หรือจากปราดเปรียวเป็นซึม แอบในมุมมืด ม่านตาขยาย มีไข้ต่ำๆ
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs hover:shadow-xs transition-all">
                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 font-bold px-2 py-0.5">
                  ระยะที่ 2: ดุร้ายกระวนกระวาย (2-4 วัน)
                </Badge>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  กัดทุกอย่างที่ขวางหน้า ลิ้นห้อย น้ำลายไหลย้อย กลืนลำบาก วิ่งไร้ทิศทาง ไม่กลัวคน
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs hover:shadow-xs transition-all">
                <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 font-bold px-2 py-0.5">
                  ระยะที่ 3: อัมพาตและเสียชีวิต (1-2 วัน)
                </Badge>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  ขาหลังอ่อนแรง เดินโซเซ ขากรรไกรตก ลุกไม่ขึ้น ชัก และตายในที่สุดภายใน 10 วันนับแต่เริ่มแสดงอาการ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Individual Animal Registry with Search, Filter & Quick Actions */}
        {activeTab === 'registry' && (
          <div className="space-y-3 pt-1">
            {/* Action Bar: Search, Category Filters, and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="ค้นหารหัสสัตว์, ชื่อ, พันธุ์, เจ้าของ หรือตำบล..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs bg-slate-50/70 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => setIsAddAnimalOpen(true)}
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1 shadow-2xs"
                >
                  <PlusCircle size={14} />
                  <span>บันทึกสัตว์กักตัวใหม่</span>
                </Button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setRegistryFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                  registryFilter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ทั้งหมด ({evaluatedAnimals.length})
              </button>
              <button
                type="button"
                onClick={() => setRegistryFilter('active')}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                  registryFilter === 'active'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-blue-50/70 text-blue-700 border-blue-200 hover:bg-blue-100/50'
                }`}
              >
                อยู่ระหว่างกัก ({summary.active})
              </button>
              <button
                type="button"
                onClick={() => setRegistryFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                  registryFilter === 'completed'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-emerald-50/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50'
                }`}
              >
                กักครบ 14 วัน ปกติ ({evaluatedAnimals.filter(a => a.progress.category === 'completed').length})
              </button>
              <button
                type="button"
                onClick={() => setRegistryFilter('symptomatic')}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                  registryFilter === 'symptomatic'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-amber-50/70 text-amber-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                แสดงอาการสงสัย ({summary.symptomatic})
              </button>
              <button
                type="button"
                onClick={() => setRegistryFilter('dead')}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                  registryFilter === 'dead'
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-red-50/70 text-red-700 border-red-200 hover:bg-red-100/50'
                }`}
              >
                ตายระหว่างกัก ({evaluatedAnimals.filter(a => a.progress.category === 'dead').length})
              </button>
            </div>

            {/* Animals Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {displayedAnimals.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  ไม่พบข้อมูลสัตว์ตามเงื่อนไขที่เลือก
                </div>
              ) : (
                displayedAnimals.map((item) => {
                  const { progress } = item;
                  const isCompleted = progress.category === 'completed';
                  const isActive = progress.category === 'active';
                  const isSymptomatic = progress.category === 'symptomatic';
                  const isDead = progress.category === 'dead';

                  const badgeStyle = isCompleted 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : isSymptomatic
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : isDead
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200';

                  const cardBorder = isCompleted
                    ? 'border-emerald-200/80 bg-gradient-to-br from-white via-white to-emerald-50/20'
                    : isSymptomatic
                    ? 'border-amber-300 bg-gradient-to-br from-white via-white to-amber-50/30'
                    : isDead
                    ? 'border-red-300 bg-gradient-to-br from-white via-white to-red-50/20'
                    : 'border-blue-200/80 bg-gradient-to-br from-white via-white to-blue-50/20';

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border ${cardBorder} shadow-2xs hover:shadow-xs transition-all space-y-2.5 relative flex flex-col justify-between`}
                    >
                      <div>
                        {/* Top Code & Status */}
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.code}
                          </span>
                          <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${badgeStyle}`}>
                            {progress.statusLabel}
                          </Badge>
                        </div>

                        {/* Animal Info */}
                        <div className="mt-1.5">
                          <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                            <span>{item.animalName || item.breed}</span>
                            <span className="text-xs font-semibold text-slate-500">{item.speciesLabel}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                            <MapPin size={11} className="text-slate-400 shrink-0" />
                            <span>{item.village ? `${item.village} ` : ''}{item.subdistrict} {item.district}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <User size={11} className="text-slate-400 shrink-0" />
                            <span>{item.ownerName} ({item.ownership === 'owned' ? 'มีเจ้าของ' : 'จรจัด'})</span>
                          </div>
                        </div>

                        {/* 14-Day Progress Bar (สำหรับกลุ่มกักดูอาการ) */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="text-slate-600">
                              เริ่มกัก: {new Date(item.startDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                            </span>
                            {isActive && (
                              <span className="text-blue-700 font-bold">
                                วันที่ {progress.daysElapsed} / 14 วัน (เหลืออีก {progress.daysRemaining} วัน)
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                <Check size={12} /> ครบ 14 วันแล้ว
                              </span>
                            )}
                            {isSymptomatic && (
                              <span className="text-amber-700 font-bold">
                                แสดงอาการวันที่ {progress.daysElapsed}
                              </span>
                            )}
                            {isDead && (
                              <span className="text-red-700 font-bold">
                                ตายส่งตรวจ Lab
                              </span>
                            )}
                          </div>

                          {/* Visual Progress Bar */}
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isCompleted
                                  ? 'bg-emerald-500'
                                  : isSymptomatic
                                  ? 'bg-amber-500'
                                  : isDead
                                  ? 'bg-red-500'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                              }`}
                              style={{ width: `${progress.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Note / Symptoms */}
                        {(item.symptomDetails || item.notes) && (
                          <p className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-2 leading-relaxed">
                            {item.symptomDetails ? `⚠️ อาการ: ${item.symptomDetails}` : item.notes}
                          </p>
                        )}
                      </div>

                      {/* Quick Status Control Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                        <span className="text-[10px] text-slate-400">เปลี่ยนสถานะ:</span>
                        <div className="flex items-center gap-1">
                          {item.clinicalStatus !== 'normal' && (
                            <button
                              type="button"
                              onClick={() => updateAnimalStatus(item.id, 'normal')}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium cursor-pointer"
                            >
                              ปกติ
                            </button>
                          )}
                          {item.clinicalStatus !== 'symptomatic' && (
                            <button
                              type="button"
                              onClick={() => updateAnimalStatus(item.id, 'symptomatic')}
                              className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold cursor-pointer"
                            >
                              พบอาการ
                            </button>
                          )}
                          {item.clinicalStatus !== 'dead' && (
                            <button
                              type="button"
                              onClick={() => updateAnimalStatus(item.id, 'dead')}
                              className="px-1.5 py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-bold cursor-pointer"
                            >
                              สัตว์ตาย
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal เพิ่มสัตว์กักตัวรายใหม่ */}
      <Dialog open={isAddAnimalOpen} onOpenChange={setIsAddAnimalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2 text-blue-700 font-bold">
              <PlusCircle size={18} />
              <span>บันทึกสัตว์เข้ากักสังเกตอาการ 14 วัน</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              ระบบจะเริ่มนับวันกักตัว (Day 1 ถึง Day 14) ตามมาตรฐาน One Health กรมปศุสัตว์
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAnimal} className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs">รหัสติดตามสัตว์</Label>
                <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} className="h-8 text-xs font-mono font-bold" required />
              </div>
              <div>
                <Label className="text-xs">ชื่อสัตว์ / ลักษณะเด่น</Label>
                <Input placeholder="เช่น เจ้าด่าง, สุนัขจรสีดำ" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs">ชนิดสัตว์</Label>
                <Select value={newSpecies} onValueChange={(v) => { if (v) setNewSpecies(v as any); }}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">สุนัข (Dog)</SelectItem>
                    <SelectItem value="cat">แมว (Cat)</SelectItem>
                    <SelectItem value="cattle">โค / กระบือ (Cattle)</SelectItem>
                    <SelectItem value="other">สัตว์อื่น</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">สายพันธุ์</Label>
                <Input placeholder="เช่น ไทยพันธุ์ทาง" value={newBreed} onChange={(e) => setNewBreed(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs">สถานะความเป็นเจ้าของ</Label>
                <Select value={newOwnership} onValueChange={(v) => { if (v) setNewOwnership(v as any); }}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">มีเจ้าของ (กักที่บ้าน)</SelectItem>
                    <SelectItem value="stray">สัตว์จรจัด (กักที่ศูนย์ อปท.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">ชื่อเจ้าของ / ผู้ดูแล</Label>
                <Input 
                  placeholder={newOwnership === 'owned' ? 'ชื่อ-สกุล เจ้าของ' : 'ระบุ อบต./เทศบาล ที่รับกัก'} 
                  value={newOwnerName} 
                  onChange={(e) => setNewOwnerName(e.target.value)} 
                  className="h-8 text-xs" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs">อำเภอ</Label>
                <Select value={newDistrict} onValueChange={(v) => { if (v) setNewDistrict(v); }}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kalasinDistricts.map(d => (
                      <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">ตำบล</Label>
                <Input placeholder="เช่น ต.หลุบ" value={newSubdistrict} onChange={(e) => setNewSubdistrict(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>

            <div>
              <Label className="text-xs">หมายเหตุ / เหตุการณ์กัด</Label>
              <Input placeholder="เช่น กัดคนเดินผ่านหน้าบ้าน ล่ามโซ่ในพื้นที่ปิด" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} className="h-8 text-xs" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddAnimalOpen(false)}>
                ยกเลิก
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                บันทึกเข้าสู่ระบบกักตัว
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
