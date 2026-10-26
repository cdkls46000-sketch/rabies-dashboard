'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Table as TableIcon, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useData } from '@/context/data-context';
import { Button } from '@/components/ui/button';

interface DistrictVaccinationData {
  district: string;
  target: number;
  vaccinated: number;
  remaining: number;
  coverage: number;
}

interface DistrictVaccinationTableProps {
  data: DistrictVaccinationData[];
}

export function DistrictVaccinationTable({ data }: DistrictVaccinationTableProps) {
  const { selectedDistrict, setSelectedDistrict, selectedDistrictName, isDistrictMatch } = useData();
  const [mobileView, setMobileView] = useState<'cards' | 'table'>('cards');

  const filteredData = useMemo(() => {
    if (selectedDistrict === 'all') return data;
    return data.filter(d => isDistrictMatch(d.district));
  }, [data, selectedDistrict, isDistrictMatch]);

  return (
    <div className="space-y-3">
      {/* Mobile View Toggle Switcher (แสดงเฉพาะในจอมือถือ) */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 md:hidden">
        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>ผลการฉีดวัคซีน {selectedDistrict === 'all' ? '18 อำเภอ' : selectedDistrictName}</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setMobileView('cards')}
            className={`px-2 py-1 rounded-md font-medium text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              mobileView === 'cards'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={11} />
            <span>แบบการ์ด</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('table')}
            className={`px-2 py-1 rounded-md font-medium text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              mobileView === 'table'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon size={11} />
            <span>แบบตาราง</span>
          </button>
        </div>
      </div>

      {/* 1. Mobile Card List View (< md) - พอดีหน้าจอ 100% ไม่ต้องเลื่อนขวา */}
      {mobileView === 'cards' && (
        <div className="md:hidden space-y-2">
          {filteredData.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ไม่มีรายงานข้อมูลสถิติของ {selectedDistrictName}
            </div>
          ) : (
            filteredData.map((row) => {
            const isSafe = row.coverage >= 80;
            const isWarning = row.coverage >= 70 && row.coverage < 80;

            return (
              <div 
                key={`card-${row.district}`}
                className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2 text-xs"
              >
                {/* District Name and Coverage Badge */}
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {row.district}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] shrink-0 ${
                    isSafe
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {row.coverage}% {isSafe ? '✓ ปลอดภัย' : ''}
                  </span>
                </div>

                {/* Full-width Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isSafe ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(row.coverage, 100)}%` }}
                  />
                </div>

                {/* 3 Stats Columns */}
                <div className="grid grid-cols-3 gap-1 pt-0.5 text-[11px] text-slate-600 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">เป้าหมาย</span>
                    <strong className="text-slate-800 font-semibold">{row.target.toLocaleString()}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">ฉีดแล้ว</span>
                    <strong className="text-emerald-700 font-bold">{row.vaccinated.toLocaleString()}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">คงเหลือ</span>
                    <strong className="text-amber-700 font-semibold">{row.remaining.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      )}

      {/* 2. Responsive Table View (พอดีหน้าจอ 100% ด้วย table-fixed ไม่ล้น ไม่ต้องเลื่อนขวา) */}
      <div className={`${mobileView === 'table' ? 'block' : 'hidden md:block'} w-full overflow-hidden rounded-xl border border-slate-200`}>
        <Table className="w-full table-fixed text-xs">
          <TableHeader className="bg-slate-50/90">
            <TableRow className="text-[11px]">
              <TableHead className="w-[28%] sm:w-[22%] py-2 px-1.5 sm:px-3 font-bold text-slate-800">อำเภอ</TableHead>
              <TableHead className="w-[18%] sm:w-[17%] py-2 px-1 sm:px-2 text-right font-bold text-slate-800">เป้าหมาย</TableHead>
              <TableHead className="w-[18%] sm:w-[17%] py-2 px-1 sm:px-2 text-right font-bold text-slate-800">ฉีดแล้ว</TableHead>
              <TableHead className="w-[18%] sm:w-[17%] py-2 px-1 sm:px-2 text-right font-bold text-slate-800">คงเหลือ</TableHead>
              <TableHead className="w-[18%] sm:w-[27%] py-2 px-1 sm:px-3 text-right sm:text-left font-bold text-slate-800">ครอบคลุม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">
                  ไม่มีรายงานข้อมูลสถิติของ {selectedDistrictName}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => {
              const isSafe = row.coverage >= 80;
              const isWarning = row.coverage >= 70 && row.coverage < 80;

              return (
                <TableRow key={row.district} className="hover:bg-slate-50/80 transition-colors">
                  {/* อำเภอ */}
                  <TableCell className="py-2 px-1.5 sm:px-3 font-semibold text-slate-900 truncate text-[11px] sm:text-xs">
                    {row.district}
                  </TableCell>

                  {/* เป้าหมาย */}
                  <TableCell className="py-2 px-1 sm:px-2 text-right text-slate-600 text-[11px] sm:text-xs">
                    {row.target.toLocaleString()}
                  </TableCell>

                  {/* ฉีดแล้ว */}
                  <TableCell className="py-2 px-1 sm:px-2 text-right font-bold text-emerald-700 text-[11px] sm:text-xs">
                    {row.vaccinated.toLocaleString()}
                  </TableCell>

                  {/* คงเหลือ */}
                  <TableCell className="py-2 px-1 sm:px-2 text-right text-amber-700 text-[11px] sm:text-xs">
                    {row.remaining.toLocaleString()}
                  </TableCell>

                  {/* ความครอบคลุม: ในมือถือแสดง Badge กระชับ / ใน Desktop มี Progress Bar */}
                  <TableCell className="py-2 px-1 sm:px-3 text-right sm:text-left">
                    <div className="flex items-center justify-end sm:justify-start gap-2">
                      <span className={`font-bold text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded ${
                        isSafe ? 'text-emerald-700 bg-emerald-50' :
                        isWarning ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50'
                      }`}>
                        {row.coverage}%
                      </span>
                      <div className="hidden sm:block h-2 flex-1 bg-slate-100 rounded-full overflow-hidden max-w-[90px]">
                        <div 
                          className={`h-full rounded-full ${
                            isSafe ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(row.coverage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
