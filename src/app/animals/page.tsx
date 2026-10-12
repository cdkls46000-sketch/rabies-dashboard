'use client';

import React from 'react';
import KpiCard from '@/components/dashboard/kpi-card';
import { PawPrint, AlertTriangle, Clock, Syringe, MapPin } from 'lucide-react';
import { animalSummary, labSummary, districtVaccinationData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LabResultsChart } from '@/components/animals/lab-results-chart';
import { DistrictVaccinationTable } from '@/components/animals/district-vaccination-table';

export default function AnimalsPage() {
  return (
    <div className="space-y-6 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <span>การเฝ้าระวังโรคพิษสุนัขบ้าในสัตว์</span>
            <span className="text-sm font-normal px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
              <MapPin size={14} /> จ.กาฬสินธุ์
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            ข้อมูลตรวจชันสูตรทางห้องปฏิบัติการ และความครอบคลุมการสร้างเสริมภูมิคุ้มกันโรคในสุนัข-แมว โดยปศุสัตว์จังหวัดกาฬสินธุ์
          </p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Lab Results and District Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>ผลตรวจทางห้องปฏิบัติการ (DFA/PCR)</CardTitle>
            <CardDescription>
              ตัวอย่างส่งตรวจ สถาบันสุขภาพสัตว์แห่งชาติ / ศูนย์วิจัยและพัฒนาการสัตวแพทย์
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LabResultsChart data={labSummary} />
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
              📌 ผลบวกทั้งหมดพบใน สุนัขจรจัด 15 ตัว, สุนัขมีเจ้าของ 2 ตัว และโค 1 ตัว
            </div>
          </CardContent>
        </Card>
        
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>สถิติการฉีดวัคซีนสัตว์ รายอำเภอ (จ.กาฬสินธุ์)</CardTitle>
            <CardDescription>
              เป้าหมายและผลการดำเนินงาน อปท. ร่วมกับปศุสัตว์อำเภอ (เกณฑ์ความปลอดภัย ≥ 80%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistrictVaccinationTable data={districtVaccinationData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
