'use client';

import { Users, Bug, Shield, MapPin, PlusCircle, ShieldCheck, UserCheck } from 'lucide-react';
import KpiCard from '@/components/dashboard/kpi-card';
import MapView from '@/components/dashboard/map-view';
import TrendChart from '@/components/dashboard/trend-chart';
import SpeciesChart from '@/components/dashboard/species-chart';
import ProvinceRankChart from '@/components/dashboard/province-rank-chart';
import AlertList from '@/components/dashboard/alert-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';

export default function DashboardPage() {
  const { 
    dashboardSummary, 
    setIsNewCaseOpen, 
    selectedYear, 
    isLoggedIn, 
    setIsLoginOpen, 
    setLoginReason 
  } = useData();

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
          onClick={() => {
            if (!isLoggedIn) {
              setLoginReason('เข้าสู่ระบบสำหรับเจ้าหน้าที่เพื่อบันทึกข้อมูลผู้สัมผัสโรคใหม่');
              setIsLoginOpen(true);
            } else {
              setIsNewCaseOpen(true);
            }
          }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 sm:h-9 gap-1.5 shadow-sm shadow-blue-500/20 active:scale-98"
        >
          <PlusCircle size={15} /> บันทึกข้อมูลผู้สัมผัสโรคใหม่
        </Button>
      </div>

      {/* แถบแจ้งสถานะสำคัญ: ยืนยันไม่มีผู้ป่วยในคน มีเฉพาะผู้สัมผัสโรค */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-emerald-950">
                สถานการณ์ในคน: ไม่พบผู้ป่วยโรคพิษสุนัขบ้า (ผู้ป่วย = 0 ราย)
              </span>
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] h-5 font-semibold">
                ปลอดผู้ป่วยในคน 100%
              </Badge>
            </div>
            <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
              ในพื้นที่จังหวัดกาฬสินธุ์ <strong>ไม่มีผู้ป่วยแม้แต่รายเดียว (0 ราย)</strong> มีเฉพาะ <strong>ผู้สัมผัสโรค (133 ราย)</strong> ที่ถูกสัตว์กัด/ข่วน และได้รับการดูแลฉีดวัคซีนป้องกันหลังสัมผัส (PEP) ครบถ้วนตามมาตรฐาน
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-emerald-200/60 text-emerald-800 text-xs">
          <span className="font-bold text-emerald-900">ผู้เสียชีวิต: 0 ราย</span>
          <span className="text-[11px] text-emerald-700 font-medium">สสจ.กาฬสินธุ์</span>
        </div>
      </div>
      
      {/* 4 KPI Cards: ผู้ป่วย (0), ผู้สัมผัส (133), สัตว์ผลบวก (32), วัคซีนสัตว์ (84.5%) */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: ผู้ป่วยโรคพิษสุนัขบ้าในคน = 0 ราย */}
        <KpiCard 
          title="ผู้ป่วยโรคพิษสุนัขบ้า (คน)" 
          value="0 ราย" 
          change={0} 
          icon={UserCheck} 
          colorClass="text-emerald-600" 
        />
        {/* KPI 2: ผู้สัมผัสโรคสะสม */}
        <KpiCard 
          title="ผู้สัมผัสโรค (รับวัคซีน PEP)" 
          value={`${dashboardSummary.totalExposures.toLocaleString()} ราย`} 
          change={dashboardSummary.totalExposuresChange} 
          icon={Users} 
          colorClass="text-blue-500" 
        />
        {/* KPI 3: สัตว์ตรวจยืนยันผลบวก 32 หัว */}
        <KpiCard 
          title="สัตว์ตรวจยืนยันผลบวก (Lab +)" 
          value={`${dashboardSummary.positiveAnimals.toLocaleString()} ตัว`} 
          change={dashboardSummary.positiveAnimalsChange} 
          icon={Bug} 
          colorClass="text-red-500" 
        />
        {/* KPI 4: ความครอบคลุมวัคซีนในสัตว์ */}
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
