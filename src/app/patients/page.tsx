'use client';

import React, { useState, useMemo } from 'react';
import KpiCard from '@/components/dashboard/kpi-card';
import { 
  Activity, 
  AlertTriangle, 
  AlertCircle, 
  MapPin, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2,
  ShieldCheck, 
  ShieldAlert, 
  Syringe, 
  Home, 
  Lock, 
  LogIn,
  Calculator,
  PhoneCall,
  Clock,
  Link2,
  Building2,
  CheckCircle2,
  Share2,
  FileText
} from 'lucide-react';
import { yearlyVaccineCoverageData, kalasinDistricts } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { VaccineCoverageChart } from '@/components/patients/vaccine-coverage-chart';
import { PepCalculatorDialog } from '@/components/patients/pep-calculator-dialog';
import { AppointmentCardDialog } from '@/components/patients/appointment-card-dialog';
import { FollowUpTrackerDialog } from '@/components/patients/follow-up-tracker-dialog';
import { PatientListItem } from '@/types';
import { useData } from '@/context/data-context';

export default function PatientsPage() {
  const { 
    patients, 
    categoryCount, 
    setEditingPatient, 
    setIsNewCaseOpen, 
    deletePatient,
    isPdpaActive,
    togglePdpa,
    getDisplayName,
    selectedYear,
    currentUser,
    isLoggedIn,
    setIsLoginOpen,
    setLoginReason
  } = useData();

  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState<string>(selectedYear);
  const [statusTab, setStatusTab] = useState<'all' | 'overdue' | 'pending' | 'completed' | 'positive_linked'>('all');

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedCardPatient, setSelectedCardPatient] = useState<PatientListItem | null>(null);
  const [selectedTrackerPatient, setSelectedTrackerPatient] = useState<PatientListItem | null>(null);

  const districtFilterItems = useMemo(() => {
    const map: Record<string, string> = {
      all: 'อำเภอ: ทุกอำเภอ (จ.กาฬสินธุ์)',
    };
    kalasinDistricts.filter(d => d.id !== 'all').forEach(d => {
      map[d.name.replace('อ.', '')] = d.name;
    });
    return map;
  }, []);

  const yearFilterItems: Record<string, string> = {
    all: 'ปีงบประมาณ: ทุกปี',
    '2568': 'พ.ศ. 2568',
    '2569': 'พ.ศ. 2569',
    '2570': 'พ.ศ. 2570',
    '2571': 'พ.ศ. 2571',
  };

  React.useEffect(() => {
    setYearFilter(selectedYear);
  }, [selectedYear]);

  // Status Tab Counts
  const overdueCount = useMemo(() => patients.filter(p => p.follow_up_status === 'overdue').length, [patients]);
  const pendingCount = useMemo(() => patients.filter(p => p.follow_up_status === 'pending').length, [patients]);
  const completedCount = useMemo(() => patients.filter(p => p.follow_up_status === 'completed').length, [patients]);
  const positiveLinkedCount = useMemo(() => patients.filter(p => p.notes && p.notes.includes('หัวที่')).length, [patients]);

  // Filter patients based on search, district, fiscal year, and status tab
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.hn.toLowerCase().includes(search.toLowerCase()) ||
      (p.village_name && p.village_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.subdistrict && p.subdistrict.toLowerCase().includes(search.toLowerCase())) ||
      (p.district && p.district.toLowerCase().includes(search.toLowerCase()));

    const matchesDistrict = 
      districtFilter === 'all' || 
      (p.district && p.district.includes(districtFilter));

    const matchesYear =
      yearFilter === 'all'
        ? (p.year === selectedYear || (!p.year && selectedYear === '2569'))
        : (p.year === yearFilter || (!p.year && yearFilter === '2569'));

    const matchesStatus =
      statusTab === 'all' ? true :
      statusTab === 'overdue' ? p.follow_up_status === 'overdue' :
      statusTab === 'pending' ? p.follow_up_status === 'pending' :
      statusTab === 'completed' ? p.follow_up_status === 'completed' :
      statusTab === 'positive_linked' ? Boolean(p.notes && p.notes.includes('หัวที่')) : true;

    return matchesSearch && matchesDistrict && matchesYear && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              ทะเบียนผู้สัมผัสโรคพิษสุนัขบ้า (Exposures)
            </h1>
            <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 shrink-0">
              <MapPin size={13} /> จ.กาฬสินธุ์
            </span>
            <Badge variant="outline" className="text-[11px] bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center gap-1">
              <ShieldCheck size={13} /> {isPdpaActive ? 'PDPA Masking เปิดใช้งาน' : 'โหมดเจ้าหน้าที่'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            ข้อมูลผู้สัมผัสสัตว์สงสัย/ติดเชื้อที่ได้รับวัคซีน PEP (จังหวัดกาฬสินธุ์ ไม่พบผู้ป่วยโรคพิษสุนัขบ้าในคน ผู้ป่วย = 0 ราย)
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            onClick={() => setIsCalculatorOpen(true)}
            className="w-full sm:w-auto text-xs h-8 sm:h-9 gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50 active:scale-98 cursor-pointer shadow-2xs font-semibold"
          >
            <Calculator size={15} />
            <span>ประเมินแผล & คำนวณวันนัด PEP</span>
          </Button>

          <Button 
            onClick={() => {
              if (!isLoggedIn) {
                setLoginReason('เข้าสู่ระบบสำหรับเจ้าหน้าที่เพื่อบันทึกผู้สัมผัสโรครายใหม่');
                setIsLoginOpen(true);
              } else {
                setIsNewCaseOpen(true);
              }
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 sm:h-9 gap-1.5 shadow-sm shadow-blue-500/20 active:scale-98 cursor-pointer font-semibold"
          >
            <PlusCircle size={15} /> บันทึกผู้สัมผัสโรครายใหม่
          </Button>
        </div>
      </div>

      {/* แถบชี้แจงระบาดวิทยา: ไม่มีผู้ป่วย มีเฉพาะผู้สัมผัสโรค */}
      <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between gap-2.5 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-emerald-900 text-[11px] sm:text-xs leading-relaxed">
            🟢 <strong>ข้อเท็จจริงทางระบาดวิทยา:</strong> ในระบบนี้คือ <strong>&quot;ผู้สัมผัสโรค&quot; (Exposures)</strong> ที่ถูกสัตว์กัด/ข่วน และเข้ารับวัคซีน PEP เพื่อป้องกันโรค โดยในจังหวัดกาฬสินธุ์ <strong>ไม่พบผู้ป่วยโรคพิษสุนัขบ้าในคน (ผู้ป่วย = 0 ราย, เสียชีวิต = 0 ราย)</strong>
          </span>
        </div>
      </div>
      
      {/* KPI Cards: Cat I, Cat II, Cat III, RIG Coverage in Cat III, ผู้ป่วย/เสียชีวิต = 0 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard 
          title="Category I (สัมผัส/เลียผิวปกติ)" 
          value={`${categoryCount.catI} ราย`} 
          change={0} 
          icon={Activity} 
          colorClass="text-blue-500" 
        />
        <KpiCard 
          title="Category II (แผลข่วน/ถลอก)" 
          value={`${categoryCount.catII} ราย`} 
          change={-2} 
          icon={AlertTriangle} 
          colorClass="text-amber-500" 
        />
        <KpiCard 
          title="Category III (แผลลึก/มีเลือด)" 
          value={`${categoryCount.catIII} ราย`} 
          change={1} 
          icon={AlertCircle} 
          colorClass="text-red-500" 
        />
        <KpiCard 
          title="ความครอบคลุม RIG ใน Cat III" 
          value="93.8%" 
          change={100} 
          icon={Syringe} 
          colorClass="text-purple-600" 
        />
        <KpiCard 
          title="ผู้ป่วย / เสียชีวิตจากโรค" 
          value="0 ราย" 
          change={0} 
          icon={ShieldCheck} 
          colorClass="text-emerald-600" 
        />
      </div>

      {/* แถบสรุป One Health Linkage & คลังสำรองชีววัตถุ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-blue-50/80 border border-blue-200/90 rounded-xl flex items-start gap-2.5">
          <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700 shrink-0 mt-0.5">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-blue-950 flex items-center gap-1.5">
              <span>One Health Animal-to-Human Linkage</span>
              <Badge className="bg-blue-600 text-white text-[9px]">32 หัวผลบวก</Badge>
            </div>
            <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
              เชื่อมโยงผู้สัมผัสโรค 133 ราย เข้ากับสัตว์ตรวจพบเชื้อ 32 หัวยืนยัน ทุกรายได้รับการฉีดวัคซีนและ RIG ครบถ้วนตามมาตรฐาน ติดตามปลอดภัย 100%
            </p>
          </div>
        </div>

        <div className="p-3 bg-purple-50/80 border border-purple-200/90 rounded-xl flex items-start gap-2.5">
          <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700 shrink-0 mt-0.5">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-purple-950 flex items-center gap-1.5">
              <span>คลังสำรองวัคซีน & เซรุ่ม RIG (จ.กาฬสินธุ์)</span>
              <Badge className="bg-purple-600 text-white text-[9px]">พร้อมใช้ 18 อำเภอ</Badge>
            </div>
            <p className="text-[11px] text-purple-800 mt-0.5 leading-relaxed">
              วัคซีน PCECV/PVRV พร้อมจ่ายทุก รพช./รพ.สต. | จุดสำรองเซรุ่ม ERIG/HRIG ฉุกเฉิน: รพ.กาฬสินธุ์, รพ.กมลาไสย, รพ.ยางตลาด, รพ.สมเด็จ, รพ.กุฉินารายณ์
            </p>
          </div>
        </div>
      </div>

      {/* PDPA Privacy Protection Notice & Auth Controls Banner */}
      {isLoggedIn && currentUser && (
        <div className="p-3 sm:p-4 bg-emerald-50/90 border border-emerald-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-emerald-950 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>เข้าสู่ระบบแล้ว: {currentUser.name}</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300">
                  {currentUser.organization}
                </Badge>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                ท่านได้รับสิทธิ์เข้าถึงข้อมูลส่วนบุคคลตาม พ.ร.บ. PDPA เพื่อการวินิจฉัยและติดตามวัคซีน | สถานะปัจจุบัน: <strong>{isPdpaActive ? '🛡️ ซ่อนชื่อตาม PDPA' : '🔓 กำลังแสดงชื่อเต็มสำหรับเจ้าหน้าที่'}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePdpa}
              className="h-8 text-xs font-semibold border-emerald-300 text-emerald-800 hover:bg-emerald-100/70"
            >
              {isPdpaActive ? '🔓 ปลดล็อคแสดงชื่อเต็ม' : '🛡️ สลับเป็นซ่อนชื่อ (PDPA)'}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsNewCaseOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 font-semibold gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <PlusCircle size={14} />
              <span>บันทึกเคสใหม่</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Table and Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        {!isLoggedIn ? (
          <Card className="xl:col-span-2 border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b bg-slate-50/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Lock size={18} className="text-amber-600 shrink-0" />
                    <span>ทะเบียนผู้สัมผัสโรคระดับหมู่บ้าน</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    จำกัดการเข้าถึงเฉพาะเจ้าหน้าที่สาธารณสุขตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-xs w-fit">
                  🔒 ซ่อนข้อมูล (ยังไม่ได้เข้าสู่ระบบ)
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 sm:p-14 text-center flex flex-col items-center justify-center space-y-4 bg-white flex-1">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs">
                <Lock size={32} />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  ทะเบียนผู้สัมผัสโรคระดับหมู่บ้านถูกซ่อนไว้
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  เนื่องจากข้อมูลประกอบด้วยรายชื่อ-สกุล เลขประจำตัว HN ที่อยู่ระดับหมู่บ้าน และประวัติการรับวัคซีน PEP รายบุคคล ระบบจึงซ่อนข้อมูลไว้เพื่อคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  เจ้าหน้าที่สาธารณสุขและทีมสอบสวนโรค One Health กรุณาเข้าสู่ระบบเพื่อดูข้อมูลและบันทึกติดตามการฉีดวัคซีน
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    setLoginReason('เข้าสู่ระบบสำหรับเจ้าหน้าที่สาธารณสุขเพื่อดูทะเบียนผู้สัมผัสโรคระดับหมู่บ้าน');
                    setIsLoginOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-5 gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <LogIn size={15} />
                  <span>เข้าสู่ระบบเพื่อแสดงทะเบียนผู้สัมผัสโรค</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="xl:col-span-2">
          <CardHeader className="p-3.5 sm:p-5">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg">ทะเบียนผู้สัมผัสโรคระดับหมู่บ้าน</CardTitle>
                <CardDescription className="text-xs">
                  พบทั้งหมด {filteredPatients.length} ราย (คลิก &apos;แก้ไข&apos; เพื่ออัปเดตเข็มวัคซีน หรือ &apos;ใบนัด&apos; เพื่อพิมพ์/แชร์)
                </CardDescription>
              </div>

              {/* Quick Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusTab('all')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusTab === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ทั้งหมด ({patients.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab('overdue')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    statusTab === 'overdue'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <AlertCircle size={12} />
                  <span>🚨 ขาดนัด/เลยกำหนด ({overdueCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab('pending')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    statusTab === 'pending'
                      ? 'bg-white text-amber-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock size={12} className="text-amber-600" />
                  <span>⏳ กำลังรับวัคซีน ({pendingCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab('completed')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    statusTab === 'completed'
                      ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>✓ ครบชุดแล้ว ({completedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab('positive_linked')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    statusTab === 'positive_linked'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Link2 size={12} className="text-blue-600" />
                  <span>🔗 สัมผัสสัตว์ผลบวก ({positiveLinkedCount})</span>
                </button>
              </div>

              {/* Overdue Active Tracing Warning Alert */}
              {overdueCount > 0 && statusTab !== 'completed' && (
                <div className="p-2.5 bg-rose-50 border border-rose-200/90 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-rose-950 font-medium text-[11px] sm:text-xs">
                      พบผู้สัมผัสโรค <strong>ขาดนัด/เลยกำหนด {overdueCount} ราย</strong> กรุณากดปุ่ม <strong>&quot;📞 ติดตาม&quot;</strong> เพื่อโทรศัพท์หรือส่งข้อมูลให้ อสม. เคาะบ้านทันที
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStatusTab('overdue')}
                    className="border-rose-300 text-rose-800 hover:bg-rose-100 text-[11px] shrink-0 h-6 px-2 font-bold cursor-pointer"
                  >
                    ดูรายชื่อ
                  </Button>
                </div>
              )}

              {/* Search and Dropdown Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหา HN, หมู่บ้าน, ชื่อ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs w-full"
                  />
                </div>

                {/* District Filter */}
                <Select 
                  value={districtFilter} 
                  onValueChange={(val) => { if (val) setDistrictFilter(val); }}
                  items={districtFilterItems}
                >
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="อำเภอ" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    <SelectItem value="all">ทุกอำเภอ (จ.กาฬสินธุ์)</SelectItem>
                    {kalasinDistricts.filter(d => d.id !== 'all').map(d => (
                      <SelectItem key={d.id} value={d.name.replace('อ.', '')}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Fiscal Year Filter */}
                <Select 
                  value={yearFilter} 
                  onValueChange={(val) => { if (val) setYearFilter(val); }}
                  items={yearFilterItems}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold text-blue-700 w-full">
                    <SelectValue placeholder="ปี พ.ศ." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกปีงบประมาณ</SelectItem>
                    <SelectItem value="2568">พ.ศ. 2568</SelectItem>
                    <SelectItem value="2569">พ.ศ. 2569</SelectItem>
                    <SelectItem value="2570">พ.ศ. 2570</SelectItem>
                    <SelectItem value="2571">พ.ศ. 2571</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-5 pt-0 sm:pt-0">
            {/* 1. Mobile Card View (สำหรับมือถือ iPhone & Android) */}
            <div className="block md:hidden space-y-3">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs bg-slate-50 rounded-lg border border-slate-200">
                  ไม่พบข้อมูลผู้สัมผัสโรคตามเงื่อนไขที่ค้นหา
                </div>
              ) : (
                filteredPatients.map((p) => {
                  const isOverdue = p.follow_up_status === 'overdue';
                  return (
                    <div 
                      key={`mobile-${p.hn}`}
                      className={`p-3 bg-white border rounded-xl shadow-xs space-y-2 transition-all ${
                        isOverdue 
                          ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20' 
                          : 'border-slate-200/90 hover:border-blue-300'
                      }`}
                    >
                      {/* Header: HN, Name, Year */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-blue-600">{p.hn}</span>
                            <span className="text-[10px] text-slate-400">({p.age} ปี)</span>
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                              พ.ศ. {p.year || selectedYear}
                            </Badge>
                          </div>
                          <div className="font-medium text-sm text-slate-900 mt-0.5 flex items-center gap-1">
                            <span>{getDisplayName(p.name)}</span>
                            {isPdpaActive && (
                              <span className="text-[10px] text-emerald-600" title="ปกปิดชื่อตาม PDPA">🔒</span>
                            )}
                          </div>
                        </div>

                        {/* Wound category badge */}
                        <div className="text-right">
                          <Badge 
                            variant="secondary"
                            className={`text-[10px] shrink-0 font-bold ${
                              p.wound_category === 'I' ? 'bg-blue-100 text-blue-700' :
                              p.wound_category === 'II' ? 'bg-amber-100 text-amber-700' : 
                              'bg-rose-100 text-rose-700'
                            }`}
                          >
                            Cat {p.wound_category}
                          </Badge>
                          {p.rig_given && (
                            <span className="text-[9px] text-purple-700 font-bold block mt-0.5">+ RIG</span>
                          )}
                        </div>
                      </div>

                      {/* Address Village Info */}
                      <div className="text-xs text-slate-700 flex items-start gap-1.5 bg-slate-50 p-2 rounded-md border border-slate-100">
                        <Home className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">
                            {p.village_no ? `${p.village_no} ` : ''}{p.village_name || '-'}
                          </span>
                          <div className="text-[11px] text-slate-500">
                            {p.subdistrict ? `${p.subdistrict} ` : ''}{p.district || 'จ.กาฬสินธุ์'}
                          </div>
                        </div>
                      </div>

                      {/* Vaccine & Followup status row */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                          <Syringe className="w-3.5 h-3.5 text-blue-600" />
                          <span>วัคซีน: <strong className="text-slate-800">{p.vaccine_status}</strong></span>
                        </div>

                        <Badge 
                          variant="secondary"
                          className={`text-[10px] font-bold ${
                            p.follow_up_status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            p.follow_up_status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                            'bg-rose-100 text-rose-700 animate-pulse'
                          }`}
                        >
                          {p.follow_up_status === 'completed' ? 'ครบตามนัด' :
                           p.follow_up_status === 'pending' ? 'รอตามนัด' : '⚠️ ขาดนัด'}
                        </Badge>
                      </div>

                      {/* Notes / Positive head linkage */}
                      {p.notes && (
                        <div className="text-[10px] text-slate-500 bg-slate-100/70 p-1.5 rounded border border-slate-200/50 flex items-center gap-1">
                          <Link2 size={11} className="text-blue-600 shrink-0" />
                          <span className="truncate">{p.notes}</span>
                        </div>
                      )}

                      {/* Action buttons on Mobile */}
                      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1.5 border-t border-slate-100">
                        {/* ใบนัดฉีดวัคซีน */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCardPatient(p)}
                          className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50 border-emerald-200 gap-1 active:scale-95 cursor-pointer"
                        >
                          <FileText size={11} /> ใบนัด
                        </Button>

                        {/* ปุ่มติดตามด่วน (สำหรับผู้ขาดนัดหรือกำลังฉีด) */}
                        {(isOverdue || p.follow_up_status === 'pending') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTrackerPatient(p)}
                            className={`h-7 px-2 text-[11px] gap-1 active:scale-95 cursor-pointer ${
                              isOverdue 
                                ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold hover:bg-rose-100' 
                                : 'text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <PhoneCall size={11} /> ติดตาม
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPatient(p)}
                          className="h-7 px-2 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1 active:scale-95 cursor-pointer"
                        >
                          <Edit size={11} /> แก้ไข
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`ต้องการลบข้อมูลผู้สัมผัสโรค HN: ${p.hn} ใช่หรือไม่?`)) {
                              deletePatient(p.hn);
                            }
                          }}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="ลบข้อมูล"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 2. Desktop Table View (ซ่อนในมือถือ แสดงในแท็บเล็ตและคอมพิวเตอร์) */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>HN</TableHead>
                    <TableHead>ชื่อ-สกุล (PDPA)</TableHead>
                    <TableHead>ที่อยู่ระดับหมู่บ้าน</TableHead>
                    <TableHead>ปี พ.ศ.</TableHead>
                    <TableHead>วันที่สัมผัส</TableHead>
                    <TableHead>ระดับแผล</TableHead>
                    <TableHead>วัคซีน PEP</TableHead>
                    <TableHead>สถานะติดตาม</TableHead>
                    <TableHead className="text-right">จัดการและติดตาม</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-sm">
                        ไม่พบข้อมูลผู้สัมผัสโรคตามเงื่อนไขที่ค้นหา
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((p) => {
                      const isOverdue = p.follow_up_status === 'overdue';
                      return (
                        <TableRow 
                          key={p.hn} 
                          className={`transition-colors ${
                            isOverdue ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <TableCell className="font-semibold text-blue-600 whitespace-nowrap">{p.hn}</TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                              <span>{getDisplayName(p.name)}</span>
                              {isPdpaActive && (
                                <span className="text-[10px] text-emerald-600" title="ชื่อได้รับการปกปิดตาม PDPA">🔒</span>
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{p.age} ปี</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-medium text-slate-800">
                              {p.village_no ? `${p.village_no} ` : ''}
                              {p.village_name || '-'}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {p.subdistrict ? `${p.subdistrict} ` : ''}
                              {p.district || 'จ.กาฬสินธุ์'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-semibold text-blue-700 bg-blue-50 border-blue-200">
                              {p.year || selectedYear}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">{p.exposure_date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Badge 
                                variant="secondary"
                                className={
                                  p.wound_category === 'I' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                  p.wound_category === 'II' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                                  'bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold'
                                }
                              >
                                Cat {p.wound_category}
                              </Badge>
                              {p.rig_given && (
                                <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-700 border-purple-200">
                                  RIG
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-800 text-xs">{p.vaccine_status}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={`font-bold text-xs ${
                                p.follow_up_status === 'completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                p.follow_up_status === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                                'bg-rose-100 text-rose-700 hover:bg-rose-200 animate-pulse'
                              }`}
                            >
                              {p.follow_up_status === 'completed' ? 'ครบตามนัด' :
                               p.follow_up_status === 'pending' ? 'รอตามนัด' : '⚠️ ขาดนัด'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              {/* ใบนัดฉีดวัคซีน */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCardPatient(p)}
                                className="h-7 px-2 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200 gap-1 cursor-pointer"
                                title="เปิด/พิมพ์ ใบนัดฉีดวัคซีนดิจิทัล"
                              >
                                <FileText size={11} /> ใบนัด
                              </Button>

                              {/* ปุ่มติดตามด่วน */}
                              {(isOverdue || p.follow_up_status === 'pending') && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTrackerPatient(p)}
                                  className={`h-7 px-2 text-xs gap-1 cursor-pointer ${
                                    isOverdue 
                                      ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 font-bold' 
                                      : 'text-slate-600 hover:bg-slate-50'
                                  }`}
                                  title="บันทึกผลการติดตาม / โทรศัพท์ / ส่ง อสม."
                                >
                                  <PhoneCall size={11} /> ติดตาม
                                </Button>
                              )}

                              {/* แก้ไข */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingPatient(p)}
                                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1 cursor-pointer"
                                title="แก้ไขข้อมูล / อัปเดตวัคซีน"
                              >
                                <Edit size={11} /> แก้ไข
                              </Button>

                              {/* ลบ */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`คุณต้องการลบข้อมูลผู้สัมผัสโรค HN: ${p.hn} (${getDisplayName(p.name)}) ใช่หรือไม่?`)) {
                                    deletePatient(p.hn);
                                  }
                                }}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="ลบข้อมูล"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        )}
        
        {/* Chart card */}
        <Card>
          <CardHeader className="p-3.5 sm:p-5">
            <CardTitle className="text-base sm:text-lg">ความครอบคลุมการฉีดวัคซีน PEP</CardTitle>
            <CardDescription className="text-xs">
              อัตราผู้สัมผัสโรคที่ได้รับวัคซีนครบตามกำหนดแต่ละเข็ม (เข็ม 1 - 5)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
            {yearlyVaccineCoverageData[selectedYear] && yearlyVaccineCoverageData[selectedYear].length > 0 ? (
              <VaccineCoverageChart data={yearlyVaccineCoverageData[selectedYear]} />
            ) : (
              <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
                ไม่มีข้อมูลรายงานในปี พ.ศ. {selectedYear}
              </div>
            )}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-100 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                💡 ระบบติดตามอัตโนมัติ (Active Surveillance)
              </div>
              <p className="text-[11px] leading-relaxed text-blue-700">
                เมื่อผู้สัมผัสโรคได้รับวัคซีนแต่ละเข็ม เจ้าหน้าที่สามารถกด <strong>&apos;แก้ไข&apos;</strong> เพื่ออัปเดตเป็นเข็มถัดไป (เช่น 2/5, 3/5) หากเกินกำหนดนัด ระบบจะขึ้นเตือนเป็นสถานะ <strong>ขาดนัด</strong> อัตโนมัติ พร้อมส่งสัญญาณเตือนภัย
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Dialogs */}
      <PepCalculatorDialog 
        open={isCalculatorOpen} 
        onOpenChange={setIsCalculatorOpen} 
      />

      <AppointmentCardDialog 
        patient={selectedCardPatient}
        open={!!selectedCardPatient}
        onOpenChange={(open) => !open && setSelectedCardPatient(null)}
      />

      <FollowUpTrackerDialog 
        patient={selectedTrackerPatient}
        open={!!selectedTrackerPatient}
        onOpenChange={(open) => !open && setSelectedTrackerPatient(null)}
      />
    </div>
  );
}
