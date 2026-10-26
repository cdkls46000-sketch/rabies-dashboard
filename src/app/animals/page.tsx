'use client';

import React, { useState } from 'react';
import { PawPrint, AlertTriangle, Clock, Syringe, MapPin, ShieldCheck } from 'lucide-react';
import { 
  yearlyAnimalSummaries, 
  yearlyLabSummaries, 
  yearlyDistrictVaccinationData 
} from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LabResultsChart } from '@/components/animals/lab-results-chart';
import { DistrictVaccinationTable } from '@/components/animals/district-vaccination-table';
import { PositiveAnimalTable } from '@/components/animals/positive-animal-table';
import { AnimalAnalytics } from '@/components/animals/animal-analytics';
import { QuarantineTracker } from '@/components/animals/quarantine-tracker';
import { LabReportDialog } from '@/components/dashboard/lab-report-dialog';
import { LineShareDialog } from '@/components/dashboard/line-share-dialog';
import { useData } from '@/context/data-context';
import { Button } from '@/components/ui/button';
import { Alert } from '@/types';

export default function AnimalsPage() {
  const { 
    selectedYear, 
    selectedDistrict, 
    setSelectedDistrict, 
    selectedDistrictName, 
    isDistrictMatch, 
    alerts, 
    setToastMessage 
  } = useData();
  const animalSummary = yearlyAnimalSummaries[selectedYear] || yearlyAnimalSummaries['2569'];
  const labSummary = yearlyLabSummaries[selectedYear] || yearlyLabSummaries['2569'];
  const districtData = yearlyDistrictVaccinationData[selectedYear] || [];

  // Dialog state for Lab PDF and LINE Share
  const [selectedPdfAlert, setSelectedPdfAlert] = useState<Alert | null>(null);
  const [selectedLineAlert, setSelectedLineAlert] = useState<Alert | null>(null);

  const filteredAlertsForDistrict = React.useMemo(() => {
    return alerts.filter(a => (!a.year || a.year === selectedYear) && isDistrictMatch(a.district));
  }, [alerts, selectedYear, isDistrictMatch]);

  const cleanDistName = selectedDistrictName.replace(/^อ\./, '').trim();
  const matchedDistrictVax = districtData.find(d => d.district.includes(cleanDistName));

  const positiveAnimalsCount = selectedDistrict === 'all' 
    ? animalSummary.positive 
    : filteredAlertsForDistrict.length;

  const vaccinatedCount = selectedDistrict === 'all'
    ? animalSummary.vaccinated
    : (matchedDistrictVax ? matchedDistrictVax.vaccinated : 0);

  const totalReportedCount = selectedDistrict === 'all'
    ? animalSummary.totalReported
    : (matchedDistrictVax ? Math.round(matchedDistrictVax.target * 0.05) + positiveAnimalsCount : positiveAnimalsCount * 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex flex-wrap items-center gap-2">
            <span>การเฝ้าระวังโรคพิษสุนัขบ้าในสัตว์</span>
            <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 shrink-0 font-medium">
              <MapPin size={13} /> {selectedDistrictName}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            ข้อมูลตรวจชันสูตรทางห้องปฏิบัติการ ทะเบียนสัตว์ผลบวก และความครอบคลุมการสร้างเสริมภูมิคุ้มกันโรคในสัตว์ ปี พ.ศ. {selectedYear}
          </p>
        </div>
      </div>

      {/* Active District Filter Alert Banner */}
      {selectedDistrict !== 'all' && (
        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-blue-50/90 border border-blue-300 rounded-xl text-xs text-blue-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              📍 กรองแสดงเฉพาะพื้นที่: <strong>{selectedDistrictName}</strong> (พบสัตว์ผลบวก {positiveAnimalsCount} ตัว)
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDistrict('all')}
            className="h-7 text-xs border-blue-400 bg-white hover:bg-blue-100 text-blue-900 cursor-pointer font-semibold"
          >
            ✕ แสดงทุกอำเภอ
          </Button>
        </div>
      )}

      {/* แถบชี้แจง One Health สัตว์: บูรณาการเฝ้าระวังเชิงรุก */}
      <div className="p-3 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/60 border border-blue-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 shadow-xs">
            <PawPrint className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-blue-950 flex items-center gap-2">
              <span>ระบบเฝ้าระวังโรคพิษสุนัขบ้าในสัตว์เชิงรุก (Active Veterinary One Health Surveillance)</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                18 อำเภอ จ.กาฬสินธุ์
              </span>
            </div>
            <p className="text-[11px] text-blue-800 mt-0.5">
              บูรณาการส่งตรวจตัวอย่างหัวสัตว์ร่วมกับสำนักงานปศุสัตว์จังหวัดกาฬสินธุ์ และศูนย์วิจัยและพัฒนาการสัตวแพทย์ (ศวพ.ขอนแก่น)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1 font-semibold flex items-center gap-1 shadow-xs">
            <ShieldCheck size={13} />
            <span>ปลอดโรคในคน 100%</span>
          </Badge>
        </div>
      </div>
      
      {/* 4 Premium KPI Cards with Baseline Alignment & Dual-Tone Medical Styling */}
      {(() => {
        const animalMetrics = [
          {
            id: 'reported',
            title: 'สัตว์มีประวัติรายงานสงสัย',
            subtitle: selectedDistrict === 'all' ? 'ระบบเฝ้าระวัง อปท. & ปศุสัตว์' : `เฝ้าระวังเฉพาะ ${selectedDistrictName}`,
            value: totalReportedCount.toLocaleString(),
            unit: 'ตัว',
            badge: '🔍 เฝ้าระวังกักดูอาการ 14 วัน',
            icon: PawPrint,
            border: 'border-blue-200/90',
            bgGradient: 'bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30',
            accentBar: 'bg-blue-600',
            iconBg: 'bg-blue-100 text-blue-700',
            valueColor: 'text-blue-950',
            badgeClass: 'bg-blue-100/80 text-blue-800 border border-blue-200',
          },
          {
            id: 'positive',
            title: 'ตรวจยืนยันผลบวก (Rabies +)',
            subtitle: 'ชันสูตร DFA / RT-PCR พบเชื้อ',
            value: positiveAnimalsCount.toLocaleString(),
            unit: 'ตัว',
            badge: '🔴 ศวพ.ขอนแก่น ยืนยันผลบวก',
            icon: AlertTriangle,
            border: 'border-rose-300',
            bgGradient: 'bg-gradient-to-br from-rose-50/90 via-white to-rose-50/30 ring-1 ring-rose-200/60',
            accentBar: 'bg-rose-600',
            iconBg: 'bg-rose-100 text-rose-700',
            valueColor: 'text-rose-950',
            badgeClass: 'bg-rose-100 text-rose-800 font-bold border border-rose-300',
          },
          {
            id: 'pending',
            title: 'ตัวอย่างส่งตรวจรอผล Lab',
            subtitle: 'ระยะเวลาตรวจวิเคราะห์ 24-48 ชม.',
            value: animalSummary.pendingLab.toLocaleString(),
            unit: 'ตัว',
            badge: animalSummary.pendingLab === 0 ? '✓ รายงานผลครบ ไม่มียอดค้าง' : '⏳ รอผลตรวจยืนยัน',
            icon: Clock,
            border: 'border-amber-200/90',
            bgGradient: 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30',
            accentBar: 'bg-amber-500',
            iconBg: 'bg-amber-100 text-amber-700',
            valueColor: 'text-amber-950',
            badgeClass: 'bg-amber-100/80 text-amber-800 border border-amber-200',
          },
          {
            id: 'vaccinated',
            title: 'สัตว์ได้รับการฉีดวัคซีนแล้ว',
            subtitle: matchedDistrictVax ? `ความครอบคลุม ${matchedDistrictVax.coverage}%` : 'ความครอบคลุมภาพรวม 87.9%',
            value: vaccinatedCount.toLocaleString(),
            unit: 'ตัว',
            badge: '🛡️ เกณฑ์ปลอดภัย (≥ 80%)',
            icon: Syringe,
            border: 'border-emerald-200/90',
            bgGradient: 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30',
            accentBar: 'bg-emerald-600',
            iconBg: 'bg-emerald-100 text-emerald-700',
            valueColor: 'text-emerald-950',
            badgeClass: 'bg-emerald-100/80 text-emerald-800 font-bold border border-emerald-200',
          },
        ];

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {animalMetrics.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-2xl border ${item.border} ${item.bgGradient} shadow-2xs hover:shadow-md transition-all p-3 sm:p-3.5 flex flex-col justify-between`}
                >
                  {/* Left Color Accent Bar */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${item.accentBar}`} />

                  {/* Header with Fixed Height for 100% Horizontal Alignment */}
                  <div className="flex items-start justify-between gap-1 min-h-[44px]">
                    <div className="min-w-0 pr-1 pl-1">
                      <div className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                    <div className={`p-1.5 rounded-xl shrink-0 ${item.iconBg}`}>
                      <Icon size={15} />
                    </div>
                  </div>

                  {/* Value and Unit Baseline Container: Exactly Aligned Across All Cards */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 pl-1">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl sm:text-[28px] font-black tracking-tight leading-none ${item.valueColor}`}>
                        {item.value}
                      </span>
                      {item.unit && (
                        <span className="text-xs font-semibold text-slate-500">
                          {item.unit}
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mt-2 flex items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold truncate ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Animal Deep Analytics: Ownership, 5km Zones, Vaccination History */}
      <AnimalAnalytics selectedYear={selectedYear} />

      {/* Lab Results and District Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        <Card className="xl:col-span-1 rounded-2xl border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="p-3.5 sm:p-5 border-b bg-slate-50/70">
            <CardTitle className="text-base sm:text-lg">ผลตรวจทางห้องปฏิบัติการ (DFA/PCR)</CardTitle>
            <CardDescription className="text-xs">
              ตัวอย่างส่งตรวจ สถาบันสุขภาพสัตว์แห่งชาติ / ศูนย์วิจัยและพัฒนาการสัตวแพทย์
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-3 space-y-3">
            {labSummary.positive === 0 && labSummary.negative === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
                ไม่มีข้อมูลรายงานผลตรวจในปี พ.ศ. {selectedYear}
              </div>
            ) : (
              <>
                <LabResultsChart data={labSummary} />
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200/80 flex items-start gap-2 shadow-2xs">
                  <span className="text-sm">📌</span>
                  <span className="leading-relaxed">
                    ผลบวกทั้งหมดพบใน สุนัข 31 ตัว (สุนัขจรจัด 29 ตัว, สุนัขมีเจ้าของ 2 ตัว) และโค 1 ตัว
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="xl:col-span-2 rounded-2xl border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="p-3.5 sm:p-5 border-b bg-slate-50/70">
            <CardTitle className="text-base sm:text-lg">สถิติการฉีดวัคซีนสัตว์ รายอำเภอ (จ.กาฬสินธุ์)</CardTitle>
            <CardDescription className="text-xs">
              เป้าหมายและผลการดำเนินงาน อปท. ร่วมกับปศุสัตว์อำเภอ (เกณฑ์ความปลอดภัย ≥ 80%)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-3">
            {districtData.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
                ไม่มีข้อมูลรายงานในปี พ.ศ. {selectedYear}
              </div>
            ) : (
              <DistrictVaccinationTable data={districtData} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* 14-Day Animal Observation & Quarantine Tracker */}
      <QuarantineTracker />

      {/* Positive Animal Table: 32 Confirmed Heads Registry with Search, Filters, PDF & LINE */}
      <PositiveAnimalTable 
        alerts={alerts}
        onOpenPdf={setSelectedPdfAlert}
        onShareLine={setSelectedLineAlert}
      />

      {/* Lab Report PDF Dialog */}
      <LabReportDialog 
        alert={selectedPdfAlert}
        isOpen={!!selectedPdfAlert}
        onClose={() => setSelectedPdfAlert(null)}
        onNotify={setToastMessage}
      />

      {/* LINE Group Share Dialog */}
      <LineShareDialog 
        alert={selectedLineAlert}
        isOpen={!!selectedLineAlert}
        onClose={() => setSelectedLineAlert(null)}
        onNotify={setToastMessage}
      />
    </div>
  );
}
