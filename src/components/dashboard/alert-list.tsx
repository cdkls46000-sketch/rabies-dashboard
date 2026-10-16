'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/data-context';
import { Alert } from '@/types';
import { shareToLine, formatLineShareMessage } from '@/lib/line-share';
import { 
  Share2, 
  Copy, 
  Check, 
  Flame, 
  Microscope, 
  MapPin, 
  Calendar, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Search,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

export default function AlertList() {
  const { alerts, setToastMessage } = useData();
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Filter alerts by district or recent 1 month
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchSearch = 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alert.sample_id && alert.sample_id.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (filterMode === 'all') return true;
      if (filterMode === 'recent') return !!alert.is_recent_1_month;
      if (filterMode.startsWith('dist:')) {
        const distName = filterMode.replace('dist:', '');
        return alert.district?.includes(distName) || alert.location.includes(distName);
      }
      return true;
    });
  }, [alerts, filterMode, searchQuery]);

  const recentCount = alerts.filter(a => a.is_recent_1_month).length;
  const displayAlerts = showAll ? filteredAlerts : filteredAlerts.slice(0, 5);

  const handleCopyAlert = (alert: Alert) => {
    const text = formatLineShareMessage(alert);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(alert.alert_id);
      setToastMessage(`📋 คัดลอกข้อความหัวที่ ${alert.head_no || alert.alert_id} สำหรับส่งเข้า LINE เรียบร้อยแล้ว`);
      setTimeout(() => {
        setCopiedId(null);
      }, 3000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3.5 sm:p-5 pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <span>⚠️ รายการแจ้งเตือนและประวัติหัวสัตว์ติดเชื้อ (32 หัวตรวจยืนยัน)</span>
              </CardTitle>
              {recentCount > 0 && (
                <Badge className="bg-red-600 hover:bg-red-700 text-white text-[11px] flex items-center gap-1 shadow-xs animate-pulse">
                  <Flame size={12} /> พบเชื้อในรอบ 1 เดือน: {recentCount} หัว
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs mt-1">
              ข้อมูลผลตรวจชันสูตรทางห้องปฏิบัติการ (Lab) ทุกหัว พร้อมปุ่มกดแชร์สรุปสถานการณ์เข้า LINE กลุ่มปฏิบัติการควบคุมโรคได้ทันที
            </CardDescription>
          </div>

          {/* District & Status Filters */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ทั้งหมด ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('recent')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                filterMode === 'recent'
                  ? 'bg-red-600 text-white shadow-xs font-semibold'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <Flame size={12} /> ในรอบ 1 เดือน ({recentCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('dist:ยางตลาด')}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterMode === 'dist:ยางตลาด'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              อ.ยางตลาด
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('dist:หนองกุงศรี')}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterMode === 'dist:หนองกุงศรี'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              อ.หนองกุงศรี
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('dist:เมือง')}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterMode === 'dist:เมือง'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              อ.เมือง
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0 space-y-3">
        {displayAlerts.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
            ไม่พบรายการแจ้งเตือนตามเงื่อนไขที่เลือก
          </div>
        ) : (
          displayAlerts.map((alert) => {
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
                  {/* Left content info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Header badges */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {isRecent ? (
                        <Badge className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                          <Flame size={12} className="animate-pulse" />
                          <span>ในรอบ 1 เดือน (พื้นที่เฝ้าระวังสีแดง)</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-[10px]">
                          ประวัติยืนยันผลบวก
                        </Badge>
                      )}

                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {alert.title}
                      </span>

                      {alert.animal_species === 'โค' ? (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px]">
                          🐄 โค (วัว) ติดเชื้อข้ามสายพันธุ์
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

                    {/* Lab Result Details Box (ผล Lab แนบ) */}
                    <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200/90 shadow-2xs text-xs space-y-1">
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

                  {/* Right Actions: LINE Share & Copy Text */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/60">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => shareToLine(alert)}
                      className="bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-semibold h-8 px-3 gap-1.5 shadow-xs cursor-pointer active:scale-95 flex-1 lg:flex-initial"
                      title="แชร์ข้อมูลเหตุการณ์และผล Lab เข้ากลุ่ม LINE ทันที"
                    >
                      <Share2 size={13} />
                      <span>แชร์เข้า LINE</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAlert(alert)}
                      className="h-8 px-3 text-xs font-medium border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5 flex-1 lg:flex-initial"
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
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Toggle View More/All 32 heads */}
        {filteredAlerts.length > 5 && (
          <div className="text-center pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAll(prev => !prev)}
              className="text-xs h-8 px-4 gap-1.5 font-semibold text-blue-700 hover:bg-blue-50 border-blue-200"
            >
              {showAll ? (
                <>
                  <ChevronUp size={14} />
                  <span>ย่อเหลือ 5 รายการล่าสุด</span>
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  <span>แสดงประวัติทั้งหมด ({filteredAlerts.length} หัว)</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
