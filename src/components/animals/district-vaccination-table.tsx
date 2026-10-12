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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>อำเภอ</TableHead>
          <TableHead className="text-right">เป้าหมาย</TableHead>
          <TableHead className="text-right">ฉีดแล้ว</TableHead>
          <TableHead className="text-right">คงเหลือ</TableHead>
          <TableHead>ความครอบคลุม (%)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.district}>
            <TableCell className="font-medium">{row.district}</TableCell>
            <TableCell className="text-right">{row.target.toLocaleString()}</TableCell>
            <TableCell className="text-right">{row.vaccinated.toLocaleString()}</TableCell>
            <TableCell className="text-right">{row.remaining.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="w-8 text-right text-sm">{row.coverage}%</span>
                <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
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
  );
}
