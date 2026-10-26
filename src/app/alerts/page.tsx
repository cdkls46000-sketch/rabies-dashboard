'use client';

import React, { useState, useMemo } from 'react';
import KpiCard from '@/components/dashboard/kpi-card';
import { 
  AlertOctagon, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Bell, 
  MapPin, 
  Clock, 
  Flame, 
  Share2, 
  Copy, 
  Check, 
  Microscope,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/types';
import { shareToLine, formatLineShareMessage } from '@/lib/line-share';
import { LineShareDialog } from '@/components/dashboard/line-share-dialog';
import { LabReportDialog } from '@/components/dashboard/lab-report-dialog';
import { FileText } from 'lucide-react';

const alertRules = [
  { id: 1, level: 'critical', desc: 'พบสัตว์ติดเชื้อยืนยันผลบวกทางห้องปฏิบัติการ (DFA/PCR +) ส่งตรวจโดยเครือข่ายปศุสัตว์' },
  { id: 2, level: 'critical', desc: 'ผู้สัมผัสโรคบาดแผลระดับ 3 (Cat III) ต้องได้รับ RIG และวัคซีนเข็มแรกภายใน 24 ชม.' },
  { id: 3, level: 'critical', desc: 'ตรวจพบสัตว์ติดเชื้อในรอบ 1 เดือน ต้องประกาศเขตเฝ้าระวังโรคระบาดสัตว์ รัศมี 5 กม.' },
  { id: 4, level: 'urgent', desc: 'มีรายงานสัตว์สงสัยเพิ่มขึ้นผิดปกติ (>50% เทียบสัปดาห์ก่อน) ในระดับตำบล' },
  { id: 5, level: 'urgent', desc: 'พบคลัสเตอร์ชำแหละหรือสัมผัสสัตว์ติดเชื้อร่วมกันมากกว่า 3 รายขึ้นไป' },
  { id: 6, level: 'warning', desc: 'ความครอบคลุมการฉีดวัคซีนสัตว์ในระดับอำเภอต่ำกว่าเกณฑ์ความปลอดภัย (<80%)' },
  { id: 7, level: 'warning', desc: 'คลังสำรองวัคซีนป้องกันโรคพิษสุนัขบ้า (PVRV/RIG) ใน รพ.สต. หรือ รพช. ต่ำกว่าระดับปลอดภัย' },
];

export default function AlertsPage() {
  const { 
    alerts, 
    selectedYear, 
    selectedDistrict, 
    setSelectedDistrict, 
    selectedDistrictName, 
    isDistrictMatch, 
    setToastMessage 
  } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [shareAlert, setShareAlert] = useState<Alert | null>(null);
  const [selectedLabAlert, setSelectedLabAlert] = useState<Alert | null>(null);

  const districtAlerts = useMemo(() => {
    return alerts.filter(a => (!a.year || a.year === selectedYear) && isDistrictMatch(a.district));
  }, [alerts, selectedYear, isDistrictMatch]);

  const recentCount = useMemo(() => districtAlerts.filter(a => a.is_recent_1_month).length, [districtAlerts]);
  const totalExposures = useMemo(() => districtAlerts.reduce((sum, a) => sum + (a.exposures_count || 0), 0), [districtAlerts]);

  const filteredAlerts = useMemo(() => {
    let result = districtAlerts;
    if (activeTab === 'recent') {
      result = result.filter(a => a.is_recent_1_month);
    } else if (activeTab === 'yangtalat') {
      result = result.filter(a => a.district?.includes('ยางตลาด'));
    } else if (activeTab === 'nongkungsi') {
      result = result.filter(a => a.district?.includes('หนองกุงศรี'));
    } else if (activeTab === 'muang') {
      result = result.filter(a => a.district?.includes('เมือง'));
    } else if (activeTab === 'others') {
      result = result.filter(a => !a.district?.includes('ยางตลาด') && !a.district?.includes('หนองกุงศรี') && !a.district?.includes('เมือง'));
    }
    return result;
  }, [districtAlerts, activeTab]);

  const handleCopyAlert = (alert: Alert) => {
    const text = formatLineShareMessage(alert);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(alert.alert_id);
      setToastMessage(`📋 คัดลอกข้อความหัวที่ ${alert.head_no || alert.alert_id} (หน้าเดียว ไม่ติด See more) สำหรับส่งเข้า LINE เรียบร้อยแล้ว`);
      setTimeout(() => {
        setCopiedId(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex flex-wrap items-center gap-2">
            <span>ศูนย์แจ้งเตือนภัยโรคพิษสุนัขบ้า</span>
            <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 shrink-0 font-medium">
              <MapPin size={13} /> {selectedDistrictName}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            ระบบตรวจจับความเสี่ยง รายงานผล Lab 32 หัว และแจ้งเตือนด่วนผ่าน LINE Notify ถึงทีมควบคุมโรคและปศุสัตว์
          </p>
        </div>
      </div>

      {/* Active District Filter Alert Banner */}
      {selectedDistrict !== 'all' && (
        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-blue-50/90 border border-blue-300 rounded-xl text-xs text-blue-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              📍 กรองแสดงเฉพาะพื้นที่: <strong>{selectedDistrictName}</strong> (พบสัตว์ผลบวก {districtAlerts.length} ตัว)
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
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard 
          title="พบเชื้อในรอบ 1 เดือนล่าสุด" 
          value={`${recentCount} หัว`} 
          change={0} 
          icon={Flame} 
          colorClass="text-red-600" 
        />
        <KpiCard 
          title="สัตว์ตรวจพบเชื้อสะสม (Lab +)" 
          value={`${districtAlerts.length} ตัว`} 
          change={0} 
          icon={AlertOctagon} 
          colorClass="text-orange-500" 
        />
        <KpiCard 
          title="ผู้สัมผัสโรคเสี่ยง (รับวัคซีน)" 
          value={`${totalExposures} ราย`} 
          change={0} 
          icon={AlertTriangle} 
          colorClass="text-blue-500" 
        />
        <KpiCard 
          title="ผู้ป่วยโรคพิษสุนัขบ้า (คน)" 
          value="0 ราย" 
          change={0} 
          icon={ShieldCheck} 
          colorClass="text-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        {/* Alert List */}
        <Card className="xl:col-span-2">
          <CardHeader className="p-3.5 sm:p-5 pb-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <span>ประวัติรายงานสัตว์ติดเชื้อและผล Lab ({districtAlerts.length} หัว{selectedDistrict !== 'all' ? ` - ${selectedDistrictName}` : ''})</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    กดปุ่ม &apos;แชร์เข้า LINE&apos; เพื่อส่งข้อมูลเหตุการณ์และผลตรวจ Lab เข้ากลุ่มประสานงานทันที
                  </CardDescription>
                </div>
              </div>

              {/* Tabs Filter */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ทั้งหมด ({districtAlerts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('recent')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'recent'
                      ? 'bg-red-600 text-white shadow-xs font-semibold'
                      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  <Flame size={12} /> ในรอบ 1 เดือน ({recentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('yangtalat')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'yangtalat'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  อ.ยางตลาด (13)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('nongkungsi')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'nongkungsi'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  อ.หนองกุงศรี (7)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('muang')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'muang'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  อ.เมือง (8)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('others')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'others'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  อำเภออื่นๆ (4)
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-5 pt-0 sm:pt-0 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
                ไม่มีรายการแจ้งเตือนตามเงื่อนไขที่เลือก
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isRecent = alert.is_recent_1_month;

                return (
                  <div 
                    key={alert.alert_id} 
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isRecent 
                        ? 'bg-red-50/90 border-red-300 ring-1 ring-red-400/50 shadow-sm shadow-red-500/10' 
                        : 'bg-card border-slate-200 hover:bg-slate-50/70 border-l-4 border-l-slate-400'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                      {/* Left Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {isRecent ? (
                            <Badge className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                              <Flame size={12} className="animate-pulse" />
                              <span>ในรอบ 1 เดือน (พื้นที่เฝ้าระวังสีแดง)</span>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-[10px]">
                              ยืนยันผลบวก
                            </Badge>
                          )}

                          <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                            {alert.title}
                          </h3>

                          {alert.animal_species === 'โค' ? (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px]">
                              🐄 โค (วัว) ติดเชื้อ
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              🐕 สุนัข
                            </Badge>
                          )}

                          <span className="text-[11px] text-slate-500 flex items-center gap-1 ml-auto lg:ml-0">
                            <Calendar size={12} /> {alert.date_thai || 'พ.ศ. 2569'}
                          </span>
                        </div>

                        {/* Location */}
                        <p className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-red-500 shrink-0" />
                          <span>{alert.location}</span>
                        </p>

                        {/* Lab Result Details Box */}
                        <div className="p-2.5 bg-white/95 rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <span className="font-bold text-red-700 flex items-center gap-1">
                              <Microscope size={13} className="text-red-600" />
                              ผลตรวจ Lab: {alert.lab_result || 'ยืนยันผลบวก (Rabies Positive: DFA / RT-PCR +)'}
                            </span>
                            {alert.sample_id && (
                              <span className="text-slate-500 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                                รหัส: {alert.sample_id}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            🏛️ <strong>หน่วยงานตรวจ:</strong> {alert.lab_agency || 'ศวพ.ขอนแก่น (กรมปศุสัตว์) / สถาบันสุขภาพสัตว์แห่งชาติ'}
                          </p>
                          <p className="text-[11px] text-slate-600">
                            👥 <strong>ผู้สัมผัสโรค (คน):</strong> {alert.exposures_count ? `${alert.exposures_count} ราย (Cat I: ${alert.cat1_count || 0}, Cat II: ${alert.cat2_count || 0}, Cat III: ${alert.cat3_count || 0} ราย)` : 'ไม่มีผู้สัมผัสถูกกัด'} 
                            <span className="text-emerald-700 font-semibold ml-1.5">| ผู้ป่วยในคน = 0 ราย</span>
                          </p>
                        </div>
                      </div>

                      {/* Action buttons: LINE Share, Copy Text, Lab PDF */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-2 shrink-0 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 w-full lg:w-auto">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setShareAlert(alert)}
                          className="bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-semibold h-8 px-2.5 gap-1.5 shadow-xs cursor-pointer active:scale-95 w-full"
                          title="แชร์ข้อมูลเหตุการณ์และผล Lab เข้ากลุ่ม LINE"
                        >
                          <Share2 size={13} />
                          <span>แชร์เข้า LINE</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyAlert(alert)}
                          className="h-8 px-2.5 text-xs font-medium border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5 w-full cursor-pointer active:scale-95"
                          title="คัดลอกข้อความสรุปพร้อมแชร์"
                        >
                          {copiedId === alert.alert_id ? (
                            <>
                              <Check size={13} className="text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">คัดลอกแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>คัดลอกข้อความ</span>
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLabAlert(alert)}
                          className="col-span-2 sm:col-span-1 h-8 px-3 text-xs font-semibold border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 hover:text-red-800 hover:border-red-300 gap-1.5 w-full cursor-pointer active:scale-95 shadow-2xs"
                          title="เปิดดูใบรายงานผลทางห้องปฏิบัติการ (PDF)"
                        >
                          <FileText size={13} className="text-red-600 shrink-0" />
                          <span>ผลทางห้องปฏิบัติการ (PDF)</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Automatic Alert Rules */}
        <Card className="h-fit">
          <CardHeader className="p-3.5 sm:p-5">
            <CardTitle className="text-base sm:text-lg">เกณฑ์แจ้งเตือนอัตโนมัติ (Alert Rules)</CardTitle>
            <CardDescription className="text-xs">กฎการเฝ้าระวังของ สสจ.กาฬสินธุ์ และเครือข่าย One Health</CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0 space-y-3">
            {alertRules.map(rule => (
              <div key={rule.id} className="flex gap-2.5 p-2.5 rounded-md hover:bg-slate-50 transition-colors border border-slate-100">
                <div className="mt-0.5 shrink-0">
                  <Bell className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-bold text-slate-700">เกณฑ์ข้อที่ {rule.id}</span>
                    <Badge variant="outline" className="text-[9px] h-4.5 px-1.5 text-red-600 border-red-200 bg-red-50">
                      วิกฤต
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <LineShareDialog
        alert={shareAlert}
        isOpen={!!shareAlert}
        onClose={() => setShareAlert(null)}
        onNotify={setToastMessage}
      />

      <LabReportDialog
        alert={selectedLabAlert}
        isOpen={!!selectedLabAlert}
        onClose={() => setSelectedLabAlert(null)}
        onNotify={setToastMessage}
      />
    </div>
  );
}
