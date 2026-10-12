'use client';

import { BarChart3, Users, Bug, Shield, MapPin, PlusCircle } from 'lucide-react';
import KpiCard from '@/components/dashboard/kpi-card';
import MapView from '@/components/dashboard/map-view';
import TrendChart from '@/components/dashboard/trend-chart';
import SpeciesChart from '@/components/dashboard/species-chart';
import ProvinceRankChart from '@/components/dashboard/province-rank-chart';
import AlertList from '@/components/dashboard/alert-list';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/data-context';

export default function DashboardPage() {
  const { dashboardSummary, setIsNewCaseOpen, selectedYear } = useData();

  return (
    <div className="flex-1 space-y-5 p-2 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <span>ภาพรวมสถานการณ์โรคพิษสุนัขบ้า</span>
            <span className="text-sm font-normal px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
              <MapPin size={14} /> จ.กาฬสินธุ์
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            ระบบเฝ้าระวัง ติดตาม และรายงานโรคติดต่อระหว่างสัตว์และคน ข้อมูลแบบ Real-time ปีงบประมาณ พ.ศ. {selectedYear}
          </p>
        </div>

        <Button 
          onClick={() => setIsNewCaseOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 gap-1.5 shadow-sm shadow-blue-500/20"
        >
          <PlusCircle size={16} /> บันทึกเคสผู้สัมผัสโรคใหม่
        </Button>
      </div>
      
      {/* KPI Cards in 4-column grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="เคสรายงานทั้งหมด" 
          value={`${dashboardSummary.totalCases.toLocaleString()} ราย`} 
          change={dashboardSummary.totalCasesChange} 
          icon={BarChart3} 
          colorClass="text-blue-500" 
        />
        <KpiCard 
          title="ผู้สัมผัสโรค (คน)" 
          value={`${dashboardSummary.totalExposures.toLocaleString()} คน`} 
          change={dashboardSummary.totalExposuresChange} 
          icon={Users} 
          colorClass="text-orange-500" 
        />
        <KpiCard 
          title="สัตว์ตรวจยืนยันผลบวก" 
          value={`${dashboardSummary.positiveAnimals.toLocaleString()} ตัว`} 
          change={dashboardSummary.positiveAnimalsChange} 
          icon={Bug} 
          colorClass="text-red-500" 
        />
        <KpiCard 
          title="ความครอบคลุมวัคซีนในสัตว์" 
          value={`${dashboardSummary.vaccinationCoverage}%`} 
          change={dashboardSummary.vaccinationCoverageChange} 
          icon={Shield} 
          colorClass="text-emerald-500" 
        />
      </div>

      {/* Map and Trend Chart in 2-column grid */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
        <MapView />
        <TrendChart />
      </div>

      {/* Species Chart and District Rank in 2-column grid */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
        <SpeciesChart />
        <ProvinceRankChart />
      </div>

      {/* Full-width Alert List */}
      <div className="w-full">
        <AlertList />
      </div>
    </div>
  );
}
