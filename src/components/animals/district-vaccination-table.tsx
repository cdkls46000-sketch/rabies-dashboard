'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  return (
    <div className="overflow-x-auto -mx-1 sm:mx-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">อำเภอ</TableHead>
            <TableHead className="text-right whitespace-nowrap">เป้าหมาย</TableHead>
            <TableHead className="text-right whitespace-nowrap">ฉีดแล้ว</TableHead>
            <TableHead className="text-right whitespace-nowrap">คงเหลือ</TableHead>
            <TableHead className="whitespace-nowrap min-w-[140px]">ความครอบคลุม (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.district}>
              <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm">{row.district}</TableCell>
              <TableCell className="text-right whitespace-nowrap text-xs sm:text-sm">{row.target.toLocaleString()}</TableCell>
              <TableCell className="text-right whitespace-nowrap text-xs sm:text-sm">{row.vaccinated.toLocaleString()}</TableCell>
              <TableCell className="text-right whitespace-nowrap text-xs sm:text-sm">{row.remaining.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-right text-xs sm:text-sm font-semibold">{row.coverage}%</span>
                  <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                    <div 
                      className={`h-full rounded-full ${
                        row.coverage >= 80 ? 'bg-green-500' :
                        row.coverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${row.coverage}%` }}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
