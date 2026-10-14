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
    <div className="flex-1 space-y-4 sm:space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex flex-wrap items-center gap-2">
            <span>ภาพรวมสถานการณ์โรคพิษสุนัขบ้า</span>
            <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 shrink-0">
              <MapPin size={13} /> จ.กาฬสินธุ์
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            ระบบเฝ้าระวัง ติดตาม และรายงานโรคติดต่อระหว่างสัตว์และคน ปีงบประมาณ พ.ศ. {selectedYear}
          </p>
        </div>

        <Button 
          onClick={() => setIsNewCaseOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 sm:h-9 gap-1.5 shadow-sm shadow-blue-500/20 active:scale-98"
        >
          <PlusCircle size={15} /> บันทึกเคสผู้สัมผัสโรคใหม่
        </Button>
      </div>
      
      {/* KPI Cards in responsive grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
        <MapView />
        <TrendChart />
      </div>

      {/* Species Chart and District Rank in 2-column grid */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
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
