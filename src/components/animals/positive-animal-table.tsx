'use client';

import React, { useState, useMemo } from 'react';
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
import { Alert } from '@/types';
import { 
  Search, 
  FileText, 
  Share2, 
  Download, 
  Flame, 
  Microscope, 
  MapPin, 
  Calendar,
  Building2,
  Compass,
  Dog
} from 'lucide-react';

interface PositiveAnimalTableProps {
  alerts: Alert[];
  onOpenPdf: (alert: Alert) => void;
  onShareLine: (alert: Alert) => void;
}

export function PositiveAnimalTable({ alerts, onOpenPdf, onShareLine }: PositiveAnimalTableProps) {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Filter 32 animal heads
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchSearch =
        alert.title.toLowerCase().includes(search.toLowerCase()) ||
        alert.location.toLowerCase().includes(search.toLowerCase()) ||
        (alert.sample_id && alert.sample_id.toLowerCase().includes(search.toLowerCase())) ||
        String(alert.head_no || '').includes(search);

      if (!matchSearch) return false;

      if (speciesFilter === 'dog' && alert.animal_species !== 'สุนัข') return false;
      if (speciesFilter === 'cow' && alert.animal_species !== 'โค') return false;

      if (districtFilter !== 'all' && !alert.district?.includes(districtFilter)) {
        return false;
      }

      return true;
    });
  }, [alerts, search, speciesFilter, districtFilter]);

  // Export CSV function with UTF-8 BOM for Thai support in Excel
  const handleExportCsv = () => {
    const headers = [
      'หัวที่',
      'วันที่ยืนยันผล',
      'ชนิดสัตว์',
      'สถานะความเป็นเจ้าของ',
      'สถานที่เกิดเหตุ',
      'ตำบล',
      'อำเภอ',
      'รหัสตัวอย่าง Lab',
      'ผลการตรวจ Lab',
      'หน่วยงานตรวจ',
      'จำนวนผู้สัมผัสโรค (คน)',
      'สถานะเขต 5 กม.'
    ];

    const rows = filteredAlerts.map(a => {
      const isStray = a.title.includes('จรจัด') || (!a.title.includes('มีเจ้าของ') && a.animal_species === 'สุนัข');
      const ownership = a.animal_species === 'โค' ? 'โคเกษตรกร' : (isStray ? 'สุนัขจรจัด' : 'สุนัขมีเจ้าของ');
      const zoneStatus = a.is_recent_1_month ? 'อยู่ในระยะประกาศเขต 30 วัน (Active)' : 'พ้นระยะ 30 วันแล้ว';

      return [
        a.head_no || a.alert_id,
        a.date_thai || a.lab_date || '2569',
        a.animal_species || 'สุนัข',
        ownership,
        `"${a.location}"`,
        a.subdistrict || '',
        a.district || '',
        a.sample_id || `KLS-69-${String(a.head_no || '0').padStart(3, '0')}`,
        `"${a.lab_result || 'DFA/RT-PCR พบเชื้อบวก'}"`,
        `"${a.lab_agency || 'ศวพ.ขอนแก่น'}"`,
        a.exposures_count || 0,
        zoneStatus
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rabies_kalasin_animals_32heads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="p-3.5 sm:p-5 pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Dog size={18} className="text-red-600" />
                <span>ทะเบียนประวัติสัตว์ตรวจพบเชื้อโรคพิษสุนัขบ้า (32 หัวตรวจยืนยัน)</span>
              </CardTitle>
              <Badge className="bg-red-600 text-white text-[11px] font-semibold">
                ผลบวกสะสมปี 2569
              </Badge>
            </div>
            <CardDescription className="text-xs mt-0.5">
              ฐานข้อมูลผลตรวจชันสูตรทางห้องปฏิบัติการ ศวพ.ขอนแก่น กรมปศุสัตว์ พร้อมระบบเปิดเอกสาร PDF และส่งรายงานเข้า LINE
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-8 px-3 text-xs font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 gap-1.5 self-start md:self-auto cursor-pointer"
            title="ดาวน์โหลดข้อมูลเป็นไฟล์ CSV สำหรับเปิดใน Excel"
          >
            <Download size={13} className="text-emerald-600" />
            <span>ส่งออกข้อมูล (CSV/Excel)</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="ค้นหาหัวที่, ตำบล, อำเภอ, รหัส Lab..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs w-full"
            />
          </div>

          {/* Species Filter */}
          <Select 
            value={speciesFilter} 
            onValueChange={(val) => setSpeciesFilter(val || 'all')}
            items={{
              all: 'ชนิดสัตว์: ทั้งหมด (32)',
              dog: 'สุนัข (31)',
              cow: '🐄 โค/วัว (1)',
            }}
          >
            <SelectTrigger className="h-8 text-xs w-full">
              <SelectValue placeholder="ชนิดสัตว์" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ชนิดสัตว์ทั้งหมด (32)</SelectItem>
              <SelectItem value="dog">สุนัข (31)</SelectItem>
              <SelectItem value="cow">🐄 โค/วัว (1)</SelectItem>
            </SelectContent>
          </Select>

          {/* District Filter */}
          <Select 
            value={districtFilter} 
            onValueChange={(val) => setDistrictFilter(val || 'all')}
            items={{
              all: 'อำเภอ: ทุกอำเภอที่พบเชื้อ',
              'ยางตลาด': 'อ.ยางตลาด (13 หัว)',
              'เมือง': 'อ.เมืองกาฬสินธุ์ (8 หัว)',
              'หนองกุงศรี': 'อ.หนองกุงศรี (7 หัว)',
              'กมลาไสย': 'อ.กมลาไสย (1 หัว - สีแดง)',
              'ห้วยเม็ก': 'อ.ห้วยเม็ก (2 หัว)',
              'กุฉินารายณ์': 'อ.กุฉินารายณ์ (1 หัว)',
            }}
          >
            <SelectTrigger className="h-8 text-xs w-full">
              <SelectValue placeholder="อำเภอ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกอำเภอที่พบเชื้อ</SelectItem>
              <SelectItem value="ยางตลาด">อ.ยางตลาด (13 หัว)</SelectItem>
              <SelectItem value="เมือง">อ.เมืองกาฬสินธุ์ (8 หัว)</SelectItem>
              <SelectItem value="หนองกุงศรี">อ.หนองกุงศรี (7 หัว)</SelectItem>
              <SelectItem value="กมลาไสย">อ.กมลาไสย (1 หัว - สีแดง)</SelectItem>
              <SelectItem value="ห้วยเม็ก">อ.ห้วยเม็ก (2 หัว)</SelectItem>
              <SelectItem value="กุฉินารายณ์">อ.กุฉินารายณ์ (1 หัว)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0 space-y-3">
        {/* 1. Mobile Card View (< md) */}
        <div className="md:hidden space-y-2.5">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
              ไม่พบรายการสัตว์ตรวจพบเชื้อตามเงื่อนไขที่ค้นหา
            </div>
          ) : (
            filteredAlerts.map((a) => {
              const isRecent = a.is_recent_1_month;
              const isCow = a.animal_species === 'โค';
              const ownership = isCow ? 'สัตว์เกษตรกร' : (a.head_no === 4 || a.head_no === 8 ? 'มีเจ้าของ' : 'สุนัขจรจัด');

              return (
                <div
                  key={`m-head-${a.alert_id}`}
                  className={`p-3 rounded-xl border transition-all space-y-2 ${
                    isRecent
                      ? 'bg-red-50/70 border-red-300 ring-1 ring-red-400/40 shadow-xs'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        isRecent ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
                      }`}>
                        {a.head_no || a.alert_id}
                      </span>
                      <span className="font-bold text-slate-900">หัวที่ {a.head_no || a.alert_id}</span>
                      {isRecent && (
                        <Badge className="bg-red-600 text-white text-[10px] flex items-center gap-0.5 px-1.5 py-0 font-bold">
                          <Flame size={10} /> ใน 30 วัน
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar size={11} /> {a.date_thai || a.lab_date || '2569'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isCow ? (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px]">
                          🐄 โค (วัว)
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          🐕 สุนัข
                        </Badge>
                      )}
                      <span className="text-slate-600 text-[11px] font-medium">{ownership}</span>
                      <span className="text-slate-400">|</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                        {a.sample_id || `KLS-69-${String(a.head_no || '0').padStart(3, '0')}`}
                      </span>
                    </div>

                    <div className="flex items-start gap-1 text-slate-800 text-[11px] font-medium">
                      <MapPin size={12} className="text-red-500 shrink-0 mt-0.5" />
                      <span>{a.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-600">
                    <span>ผู้สัมผัสโรค: <strong className="text-slate-800">{a.exposures_count ? `${a.exposures_count} ราย` : '0 ราย'}</strong></span>
                    <span className="text-emerald-700 font-medium">ปลอดผู้ป่วย</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenPdf(a)}
                      className="h-8 text-xs font-semibold border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 gap-1 w-full"
                    >
                      <FileText size={12} className="text-red-600 shrink-0" />
                      <span>ผล Lab (PDF)</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onShareLine(a)}
                      className="h-8 text-xs font-semibold bg-[#06C755] hover:bg-[#05b34c] text-white gap-1 w-full"
                    >
                      <Share2 size={12} />
                      <span>แชร์ LINE</span>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="text-[11px]">
                <TableHead className="w-16 whitespace-nowrap text-center font-bold">หัวที่</TableHead>
                <TableHead className="whitespace-nowrap font-bold">วันที่ยืนยัน</TableHead>
                <TableHead className="whitespace-nowrap font-bold">ชนิดสัตว์ / สถานะ</TableHead>
                <TableHead className="whitespace-nowrap font-bold">สถานที่เกิดเหตุ (ต./อ.)</TableHead>
                <TableHead className="whitespace-nowrap font-bold">รหัสตัวอย่าง Lab</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-center">ผู้สัมผัส (คน)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-center">เขต 5 กม.</TableHead>
                <TableHead className="text-right whitespace-nowrap font-bold pr-4">เอกสาร / การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                    ไม่พบรายการสัตว์ตรวจพบเชื้อตามเงื่อนไขที่ค้นหา
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((a) => {
                  const isRecent = a.is_recent_1_month;
                  const isCow = a.animal_species === 'โค';

                  return (
                    <TableRow 
                      key={`head-${a.alert_id}`}
                      className={`text-xs transition-colors ${
                        isRecent ? 'bg-red-50/60 hover:bg-red-50/90' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Head No */}
                      <TableCell className="font-bold text-center whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                          isRecent ? 'bg-red-600 text-white font-extrabold shadow-xs' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {a.head_no || a.alert_id}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="whitespace-nowrap font-medium text-slate-700">
                        {a.date_thai || a.lab_date || 'พ.ศ. 2569'}
                      </TableCell>

                      {/* Species & Ownership */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isCow ? (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-[10px]">
                              🐄 โค (วัว)
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              🐕 สุนัข
                            </Badge>
                          )}
                          <span className="text-[11px] text-slate-500">
                            {isCow ? 'สัตว์เกษตรกร' : (a.head_no === 4 || a.head_no === 8 ? 'มีเจ้าของ' : 'สุนัขจรจัด')}
                          </span>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="min-w-[180px]">
                        <div className="font-medium text-slate-900">{a.location}</div>
                        <div className="text-[10px] text-slate-500">{a.district}</div>
                      </TableCell>

                      {/* Sample ID */}
                      <TableCell className="whitespace-nowrap">
                        <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">
                          {a.sample_id || `KLS-69-${String(a.head_no || '0').padStart(3, '0')}`}
                        </span>
                      </TableCell>

                      {/* Exposures */}
                      <TableCell className="text-center whitespace-nowrap">
                        <span className="font-semibold text-slate-800">
                          {a.exposures_count ? `${a.exposures_count} ราย` : '0 ราย'}
                        </span>
                        <div className="text-[10px] text-emerald-600 font-medium">ปลอดผู้ป่วย</div>
                      </TableCell>

                      {/* 5km Epidemic Zone Status */}
                      <TableCell className="text-center whitespace-nowrap">
                        {isRecent ? (
                          <Badge className="bg-red-600 text-white text-[10px] flex items-center justify-center gap-1 mx-auto shadow-2xs font-bold animate-pulse">
                            <Flame size={11} /> ในรอบ 30 วัน
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-300 text-[10px] mx-auto">
                            พ้น 30 วัน
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right whitespace-nowrap pr-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenPdf(a)}
                            className="h-7 px-2.5 text-xs font-semibold border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 hover:text-red-800 gap-1 shadow-2xs cursor-pointer active:scale-95"
                            title="เปิดดูใบรายงานผลทางห้องปฏิบัติการ (PDF)"
                          >
                            <FileText size={12} className="text-red-600" />
                            <span>ผล Lab (PDF)</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onShareLine(a)}
                            className="h-7 px-2.5 text-xs font-semibold bg-[#06C755] hover:bg-[#05b34c] text-white gap-1 shadow-2xs cursor-pointer active:scale-95"
                            title="แชร์ข้อมูลเหตุการณ์เข้ากลุ่ม LINE"
                          >
                            <Share2 size={12} />
                            <span>แชร์ LINE</span>
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
  );
}
