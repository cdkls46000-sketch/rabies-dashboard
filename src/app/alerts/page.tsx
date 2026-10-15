'use client';

import React, { useState } from 'react';
import KpiCard from '@/components/dashboard/kpi-card';
import { AlertOctagon, AlertCircle, AlertTriangle, Info, Bell, MapPin, Clock } from 'lucide-react';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const getAlertLevelConfig = (level: string) => {
  switch (level) {
    case 'critical':
      return { label: 'วิกฤต', color: 'bg-red-500 text-white', text: 'text-red-600', border: 'border-l-red-500' };
    case 'urgent':
      return { label: 'เร่งด่วน', color: 'bg-orange-500 text-white', text: 'text-orange-600', border: 'border-l-orange-500' };
    case 'warning':
      return { label: 'เตือนภัย', color: 'bg-amber-500 text-white', text: 'text-amber-600', border: 'border-l-amber-500' };
    case 'info':
    default:
      return { label: 'ทั่วไป', color: 'bg-blue-500 text-white', text: 'text-blue-600', border: 'border-l-blue-500' };
  }
};

const alertRules = [
  { id: 1, level: 'critical', desc: 'พบสัตว์ติดเชื้อยืนยันผลบวกทางห้องปฏิบัติการ (DFA/PCR +)' },
  { id: 2, level: 'critical', desc: 'ผู้สัมผัสโรคบาดแผลระดับ 3 (Cat III) ขาดนัดฉีดวัคซีนหรือไม่ได้ RIG ภายใน 24 ชม.' },
  { id: 3, level: 'critical', desc: 'พบผู้สัมผัสโรคถูกสัตว์ที่ยืนยันผลบวกกัดในพื้นที่' },
  { id: 4, level: 'urgent', desc: 'มีรายงานสัตว์สงสัยเพิ่มขึ้นผิดปกติ (>50% เทียบสัปดาห์ก่อน)' },
  { id: 5, level: 'urgent', desc: 'พบผู้สัมผัสโรคถูกสัตว์จรจัดไม่ทราบประวัติกัดมากกว่า 3 รายในตำบลเดียวกัน' },
  { id: 6, level: 'warning', desc: 'ความครอบคลุมการฉีดวัคซีนสัตว์ในระดับอำเภอต่ำกว่าเกณฑ์ความปลอดภัย (<80%)' },
  { id: 7, level: 'warning', desc: 'คลังสำรองวัคซีนป้องกันโรคพิษสุนัขบ้า (PVRV/RIG) ใน รพ.สต. หรือ รพช. ต่ำกว่าระดับปลอดภัย' },
];

export default function AlertsPage() {
  const { alerts } = useData();
  const [activeTab, setActiveTab] = useState('all');

  const alertSummary = {
    critical: alerts.filter(a => a.level === 'critical').length,
    urgent: alerts.filter(a => a.level === 'urgent').length,
    warning: alerts.filter(a => a.level === 'warning').length,
    info: alerts.filter(a => a.level === 'info').length,
  };

  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : alerts.filter(a => a.level === activeTab);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex flex-wrap items-center gap-2">
            <span>ศูนย์แจ้งเตือนภัยโรคพิษสุนัขบ้า</span>
            <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 shrink-0">
              <MapPin size={13} /> จ.กาฬสินธุ์
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            ระบบตรวจจับความเสี่ยงและแจ้งเตือนอัตโนมัติผ่าน LINE Notify, SMS และ Dashboard ถึงทีม SRRT
          </p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard 
          title="ระดับวิกฤต (Critical)" 
          value={`${alertSummary.critical} เหตุการณ์`} 
          change={0} 
          icon={AlertOctagon} 
          colorClass="text-red-500" 
        />
        <KpiCard 
          title="ระดับเร่งด่วน (Urgent)" 
          value={`${alertSummary.urgent} เหตุการณ์`} 
          change={-1} 
          icon={AlertCircle} 
          colorClass="text-orange-500" 
        />
        <KpiCard 
          title="ระดับเตือนภัย (Warning)" 
          value={`${alertSummary.warning} เหตุการณ์`} 
          change={2} 
          icon={AlertTriangle} 
          colorClass="text-amber-500" 
        />
        <KpiCard 
          title="ข้อมูลทั่วไป (Info)" 
          value={`${alertSummary.info} ข่าวสาร`} 
          change={0} 
          icon={Info} 
          colorClass="text-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        {/* Alert List */}
        <Card className="xl:col-span-2">
          <CardHeader className="p-3.5 sm:p-5">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg">รายการแจ้งเตือนในพื้นที่ จ.กาฬสินธุ์</CardTitle>
                <CardDescription className="text-xs">แสดงรายการเหตุการณ์ที่มีผลต่อการควบคุมโรคตามลำดับความเร่งด่วน</CardDescription>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="overflow-x-auto pb-1">
                  <TabsList className="w-full sm:w-auto grid grid-cols-5 sm:flex h-9 p-1">
                    <TabsTrigger value="all" className="text-[11px] sm:text-xs px-2 py-1">ทั้งหมด</TabsTrigger>
                    <TabsTrigger value="critical" className="text-[11px] sm:text-xs px-2 py-1">วิกฤต</TabsTrigger>
                    <TabsTrigger value="urgent" className="text-[11px] sm:text-xs px-2 py-1">เร่งด่วน</TabsTrigger>
                    <TabsTrigger value="warning" className="text-[11px] sm:text-xs px-2 py-1">เตือนภัย</TabsTrigger>
                    <TabsTrigger value="info" className="text-[11px] sm:text-xs px-2 py-1">ทั่วไป</TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0 sm:pt-0 space-y-3">
            {filteredAlerts.map(alert => {
              const config = getAlertLevelConfig(alert.level);
              return (
                <div 
                  key={alert.alert_id} 
                  className={`p-3.5 border rounded-lg border-l-4 ${config.border} bg-card hover:bg-slate-50 transition-colors shadow-xs`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${config.color} text-[10px] h-5`}>{config.label}</Badge>
                      <h3 className={`font-semibold text-xs sm:text-sm text-slate-800 ${!alert.is_read ? 'text-blue-900 font-bold' : ''}`}>
                        {alert.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.created_at).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2.5 leading-relaxed">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-50 p-1.5 rounded">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>พื้นที่: {alert.location}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Automatic Alert Rules */}
        <Card>
          <CardHeader className="p-3.5 sm:p-5">
            <CardTitle className="text-base sm:text-lg">เกณฑ์แจ้งเตือนอัตโนมัติ (Alert Rules)</CardTitle>
            <CardDescription className="text-xs">กฎการเฝ้าระวังของ สสจ.กาฬสินธุ์ และเครือข่าย One Health</CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0 space-y-3">
            {alertRules.map(rule => {
              const config = getAlertLevelConfig(rule.level);
              return (
                <div key={rule.id} className="flex gap-2.5 p-2.5 rounded-md hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="mt-0.5 shrink-0">
                    <Bell className={`w-3.5 h-3.5 ${config.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold text-slate-700">เกณฑ์ข้อที่ {rule.id}</span>
                      <Badge variant="outline" className={`text-[9px] h-4.5 px-1.5 ${config.text}`}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
