'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Search, 
  Download, 
  RotateCw, 
  Trash2,
  Lock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export function SecurityAuditDialog() {
  const { 
    isSecurityAuditOpen, 
    setIsSecurityAuditOpen, 
    auditLogs, 
    refreshAuditLogs, 
    clearAuditLogs,
    currentUser 
  } = useData();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'SUCCESS' | 'WARNING' | 'DANGER'>('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch = 
        log.username.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.eventType.toLowerCase().includes(search.toLowerCase()) ||
        log.ipAddress.includes(search);

      const matchFilter = 
        filterType === 'all' || log.status === filterType;

      return matchSearch && matchFilter;
    });
  }, [auditLogs, search, filterType]);

  const stats = useMemo(() => {
    return {
      total: auditLogs.length,
      success: auditLogs.filter(l => l.status === 'SUCCESS').length,
      warning: auditLogs.filter(l => l.status === 'WARNING').length,
      danger: auditLogs.filter(l => l.status === 'DANGER').length,
    };
  }, [auditLogs]);

  const handleExportCsv = () => {
    if (auditLogs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'EventType', 'Username', 'IP', 'Details', 'Status'];
    const rows = auditLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.eventType}"`,
      `"${l.username}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rabies_security_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isSecurityAuditOpen} onOpenChange={setIsSecurityAuditOpen}>
      <DialogContent className="w-[96vw] sm:max-w-4xl p-4 sm:p-6 rounded-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="text-left space-y-1 shrink-0 pb-2 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>บันทึกความปลอดภัยของระบบ (Security Audit Trail)</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                    PDPA ม.37 & พ.ร.บ. ไซเบอร์ฯ
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  ระบบบันทึกความปลอดภัยอัตโนมัติ ติดตามการเข้าสู่ระบบ 2FA การล็อกเอาต์ และการป้องกัน Brute-force
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAuditLogs}
                className="h-8 text-xs gap-1 border-slate-300"
                title="รีเฟรชประวัติ"
              >
                <RotateCw size={13} />
                <span className="hidden sm:inline">รีเฟรช</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                className="h-8 text-xs gap-1 border-slate-300 text-slate-700"
                title="ดาวน์โหลดไฟล์ CSV"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
              {currentUser?.role === 'admin' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('คุณต้องการล้างประวัติ Audit Log ทั้งหมดใช่หรือไม่? (เฉพาะผู้ดูแลระบบ)')) {
                      clearAuditLogs();
                    }
                  }}
                  className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  title="ล้างประวัติ (Admin)"
                >
                  <Trash2 size={13} />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-3 shrink-0">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-medium">เหตุการณ์ทั้งหมด</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">{stats.total} รายการ</p>
            </div>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-700 font-medium">สำเร็จ / ปลอดภัย</p>
              <p className="text-base font-bold text-emerald-950 mt-0.5">{stats.success} ครั้ง</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-amber-700 font-medium">การแจ้งเตือน / รหัสผิด</p>
              <p className="text-base font-bold text-amber-950 mt-0.5">{stats.warning} ครั้ง</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-rose-700 font-medium">วิกฤติ / บัญชีถูกระงับ</p>
              <p className="text-base font-bold text-rose-950 mt-0.5">{stats.danger} ครั้ง</p>
            </div>
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('SUCCESS')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                filterType === 'SUCCESS' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              สำเร็จ ({stats.success})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('WARNING')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                filterType === 'WARNING' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              เตือน ({stats.warning})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('DANGER')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                filterType === 'DANGER' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              วิกฤติ ({stats.danger})
            </button>
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อผู้ใช้, IP, เหตุการณ์..."
              className="h-8 pl-8 text-xs font-medium"
            />
          </div>
        </div>

        {/* Log Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl min-h-[220px]">
          {filteredLogs.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 text-slate-300" />
              <p className="text-xs">ไม่พบรายการบันทึกตามเงื่อนไขที่เลือก</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">วัน-เวลา</th>
                  <th className="py-2.5 px-3">เหตุการณ์</th>
                  <th className="py-2.5 px-3">ผู้ใช้งาน</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">IP Address</th>
                  <th className="py-2.5 px-3">รายละเอียดความปลอดภัย</th>
                  <th className="py-2.5 px-3 text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const badgeClass = 
                    log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                    log.status === 'WARNING' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                    log.status === 'DANGER' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                    'bg-blue-50 text-blue-800 border-blue-300';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap text-[11px] font-mono">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        <span className="font-mono text-[11px]">{log.eventType}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                        {log.username}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] font-mono hidden md:table-cell whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 leading-relaxed text-[11px]">
                        {log.details}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <Badge variant="outline" className={`text-[10px] font-bold ${badgeClass}`}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="pt-3 border-t mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>แสดง {filteredLogs.length} จากทั้งหมด {auditLogs.length} รายการ</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSecurityAuditOpen(false)}
            className="h-8 text-xs"
          >
            ปิดหน้าต่าง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
