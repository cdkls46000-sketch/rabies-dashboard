'use client';

import React, { useState } from 'react';
import KpiCard from '@/components/dashboard/kpi-card';
import { PawPrint, AlertTriangle, Clock, Syringe, MapPin } from 'lucide-react';
import { 
  yearlyAnimalSummaries, 
  yearlyLabSummaries, 
  yearlyDistrictVaccinationData 
} from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LabResultsChart } from '@/components/animals/lab-results-chart';
import { DistrictVaccinationTable } from '@/components/animals/district-vaccination-table';
import { PositiveAnimalTable } from '@/components/animals/positive-animal-table';
import { AnimalAnalytics } from '@/components/animals/animal-analytics';
import { QuarantineTracker } from '@/components/animals/quarantine-tracker';
import { LabReportDialog } from '@/components/dashboard/lab-report-dialog';
import { LineShareDialog } from '@/components/dashboard/line-share-dialog';
import { useData } from '@/context/data-context';
import { Alert } from '@/types';

export default function AnimalsPage() {
  const { selectedYear, alerts, setToastMessage } = useData();
  const animalSummary = yearlyAnimalSummaries[selectedYear] || yearlyAnimalSummaries['2569'];
  const labSummary = yearlyLabSummaries[selectedYear] || yearlyLabSummaries['2569'];
  const districtData = yearlyDistrictVaccinationData[selectedYear] || [];

  // Dialog state for Lab PDF and LINE Share
  const [selectedPdfAlert, setSelectedPdfAlert] = useState<Alert | null>(null);
  const [selectedLineAlert, setSelectedLineAlert] = useState<Alert | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex flex-wrap items-center gap-2">
            <span>การเฝ้าระวังโรคพิษสุนัขบ้าในสัตว์</span>
            <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 shrink-0">
              <MapPin size={13} /> จ.กาฬสินธุ์
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            ข้อมูลตรวจชันสูตรทางห้องปฏิบัติการ ทะเบียนสัตว์ผลบวก และความครอบคลุมการสร้างเสริมภูมิคุ้มกันโรคในสัตว์ ปี พ.ศ. {selectedYear}
          </p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard 
          title="สัตว์มีประวัติรายงานสงสัย" 
          value={`${animalSummary.totalReported.toLocaleString()} ตัว`} 
          change={animalSummary.totalReportedChange} 
          icon={PawPrint} 
          colorClass="text-blue-500" 
        />
        <KpiCard 
          title="ตรวจยืนยันผลบวก (Rabies +)" 
          value={`${animalSummary.positive.toLocaleString()} ตัว`} 
          change={animalSummary.positiveChange} 
          icon={AlertTriangle} 
          colorClass="text-red-500" 
        />
        <KpiCard 
          title="ตัวอย่างส่งตรวจรอผล Lab" 
          value={`${animalSummary.pendingLab.toLocaleString()} ตัว`} 
          change={animalSummary.pendingLabChange} 
          icon={Clock} 
          colorClass="text-amber-500" 
        />
        <KpiCard 
          title="สัตว์ได้รับการฉีดวัคซีนแล้ว" 
          value={`${animalSummary.vaccinated.toLocaleString()} ตัว`} 
          change={animalSummary.vaccinatedChange} 
          icon={Syringe} 
          colorClass="text-emerald-500" 
        />
      </div>

      {/* Animal Deep Analytics: Ownership, 5km Zones, Vaccination History */}
      <AnimalAnalytics selectedYear={selectedYear} />

      {/* Lab Results and District Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        <Card className="xl:col-span-1">
          <CardHeader className="p-3.5 sm:p-5">
            <CardTitle className="text-base sm:text-lg">ผลตรวจทางห้องปฏิบัติการ (DFA/PCR)</CardTitle>
            <CardDescription className="text-xs">
              ตัวอย่างส่งตรวจ สถาบันสุขภาพสัตว์แห่งชาติ / ศูนย์วิจัยและพัฒนาการสัตวแพทย์
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
            {labSummary.positive === 0 && labSummary.negative === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
                ไม่มีข้อมูลรายงานผลตรวจในปี พ.ศ. {selectedYear}
              </div>
            ) : (
              <>
                <LabResultsChart data={labSummary} />
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
                  📌 ผลบวกทั้งหมดพบใน สุนัข 31 ตัว (สุนัขจรจัด 29 ตัว, สุนัขมีเจ้าของ 2 ตัว) และโค 1 ตัว
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="xl:col-span-2">
          <CardHeader className="p-3.5 sm:p-5">
            <CardTitle className="text-base sm:text-lg">สถิติการฉีดวัคซีนสัตว์ รายอำเภอ (จ.กาฬสินธุ์)</CardTitle>
            <CardDescription className="text-xs">
              เป้าหมายและผลการดำเนินงาน อปท. ร่วมกับปศุสัตว์อำเภอ (เกณฑ์ความปลอดภัย ≥ 80%)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
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
