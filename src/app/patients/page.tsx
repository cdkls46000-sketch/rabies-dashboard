'use client';

import React, { useState } from 'react';
import KpiCard from '@/components/dashboard/kpi-card';
import { 
  Activity, 
  AlertTriangle, 
  AlertCircle, 
  Skull, 
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
  LogIn
} from 'lucide-react';
import { vaccineCoverageData, yearlyVaccineCoverageData, kalasinDistricts } from '@/lib/mock-data';
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

  React.useEffect(() => {
    setYearFilter(selectedYear);
  }, [selectedYear]);

  // Filter patients based on search, district, and fiscal year
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

    return matchesSearch && matchesDistrict && matchesYear;
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

        <Button 
          onClick={() => {
            if (!isLoggedIn) {
              setLoginReason('เข้าสู่ระบบสำหรับเจ้าหน้าที่เพื่อบันทึกผู้สัมผัสโรครายใหม่');
              setIsLoginOpen(true);
            } else {
              setIsNewCaseOpen(true);
            }
          }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 sm:h-9 gap-1.5 shadow-sm shadow-blue-500/20 active:scale-98"
        >
          <PlusCircle size={15} /> บันทึกผู้สัมผัสโรครายใหม่
        </Button>
      </div>

      {/* แถบชี้แจงระบาดวิทยา: ไม่มีผู้ป่วย มีเฉพาะผู้สัมผัสโรค */}
      <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between gap-2.5 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-emerald-900 text-[11px] sm:text-xs">
            🟢 <strong>ข้อเท็จจริงทางระบาดวิทยา:</strong> ในระบบนี้คือ <strong>&quot;ผู้สัมผัสโรค&quot; (Exposures)</strong> ที่ถูกสัตว์กัด/ข่วน และเข้ารับวัคซีน PEP เพื่อป้องกันโรค โดยในจังหวัดกาฬสินธุ์ <strong>ไม่พบผู้ป่วยโรคพิษสุนัขบ้าในคน (ผู้ป่วย = 0 ราย, เสียชีวิต = 0 ราย)</strong>
          </span>
        </div>
      </div>
      
      {/* KPI Cards: Cat I, Cat II, Cat III, ผู้ป่วย/เสียชีวิต = 0 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          title="ผู้ป่วย / เสียชีวิตจากโรค" 
          value="0 ราย" 
          change={0} 
          icon={ShieldCheck} 
          colorClass="text-emerald-600" 
        />
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
                  พบทั้งหมด {filteredPatients.length} ราย (คลิก &apos;แก้ไข&apos; เพื่ออัปเดตเข็มวัคซีนหรือสถานะการติดตาม)
                </CardDescription>
              </div>

              {/* Filters */}
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
                <Select value={districtFilter} onValueChange={(val) => { if (val) setDistrictFilter(val); }}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="อำเภอ" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    <SelectItem value="all">ทุกอำเภอ</SelectItem>
                    {kalasinDistricts.filter(d => d.id !== 'all').map(d => (
                      <SelectItem key={d.id} value={d.name.replace('อ.', '')}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Fiscal Year Filter */}
                <Select value={yearFilter} onValueChange={(val) => { if (val) setYearFilter(val); }}>
                  <SelectTrigger className="h-8 text-xs font-semibold text-blue-700 w-full">
                    <SelectValue placeholder="ปี พ.ศ." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกปี พ.ศ.</SelectItem>
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
                filteredPatients.map((p) => (
                  <div 
                    key={`mobile-${p.hn}`}
                    className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-2 hover:border-blue-300 transition-colors"
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
                      <Badge 
                        variant="secondary"
                        className={`text-[10px] shrink-0 font-bold ${
                          p.wound_category === 'I' ? 'bg-blue-100 text-blue-700' :
                          p.wound_category === 'II' ? 'bg-amber-100 text-amber-700' : 
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        Cat {p.wound_category}
                      </Badge>
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
                        <span>วัคซีน: <strong>{p.vaccine_status}</strong> เข็ม</span>
                      </div>

                      <Badge 
                        variant="secondary"
                        className={`text-[10px] ${
                          p.follow_up_status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          p.follow_up_status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-rose-100 text-rose-700 font-bold'
                        }`}
                      >
                        {p.follow_up_status === 'completed' ? 'ครบตามนัด' :
                         p.follow_up_status === 'pending' ? 'รอตามนัด' : '⚠️ ขาดนัด'}
                      </Badge>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPatient(p)}
                        className="h-7 px-3 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1 active:scale-95"
                      >
                        <Edit size={12} /> แก้ไขข้อมูล / ฉีดเข็มถัดไป
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
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))
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
                    <TableHead className="text-right">จัดการ</TableHead>
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
                    filteredPatients.map((p) => (
                      <TableRow key={p.hn} className="hover:bg-slate-50/80 transition-colors">
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
                          <Badge 
                            variant="secondary"
                            className={
                              p.wound_category === 'I' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                              p.wound_category === 'II' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                              'bg-red-100 text-red-700 hover:bg-red-200 font-bold'
                            }
                          >
                            Cat {p.wound_category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-slate-800">{p.vaccine_status}</span>
                          <span className="text-[11px] text-muted-foreground ml-1">เข็ม</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary"
                            className={
                              p.follow_up_status === 'completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                              p.follow_up_status === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                              'bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold'
                            }
                          >
                            {p.follow_up_status === 'completed' ? 'ครบตามนัด' :
                             p.follow_up_status === 'pending' ? 'รอตามนัด' : '⚠️ ขาดนัด'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPatient(p)}
                              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1"
                              title="แก้ไขข้อมูล / อัปเดตวัคซีน"
                            >
                              <Edit size={12} /> แก้ไข
                            </Button>
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
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
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
    </div>
  );
}
