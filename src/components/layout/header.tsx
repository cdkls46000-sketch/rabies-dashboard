"use client";

import { usePathname } from "next/navigation";
import { Bell, MapPin, PlusCircle, ShieldCheck, ShieldAlert, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kalasinDistricts } from "@/lib/mock-data";
import { useData } from "@/context/data-context";
import { FiscalYear } from "@/types";

export function Header() {
  const pathname = usePathname();
  const { 
    setIsNewCaseOpen, 
    alerts, 
    isPdpaActive, 
    togglePdpa,
    selectedYear,
    setSelectedYear
  } = useData();
  
  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  const titles: Record<string, string> = {
    "/": "ภาพรวมสถานการณ์ (จ.กาฬสินธุ์)",
    "/patients": "รายงานผู้สัมผัสโรค (จ.กาฬสินธุ์)",
    "/animals": "การเฝ้าระวังโรคในสัตว์ (จ.กาฬสินธุ์)",
    "/alerts": "ศูนย์แจ้งเตือนภัยระบาด (จ.กาฬสินธุ์)",
  };

  const title = titles[pathname] || "ระบบเฝ้าระวังโรคพิษสุนัขบ้า จ.กาฬสินธุ์";

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 md:px-6 sticky top-0 z-20">
      <div className="flex items-center md:hidden w-8">
        {/* Spacer for mobile menu button */}
      </div>
      
      <div className="flex items-center gap-2">
        <h1 className="text-lg md:text-xl font-bold text-gray-800 hidden md:block">{title}</h1>
        <h1 className="text-sm font-bold text-gray-800 md:hidden truncate flex-1 text-center">{title}</h1>
        <span className="hidden xl:inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
          <MapPin size={12} /> จังหวัดกาฬสินธุ์
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* เรื่องที่ 4: ตัวเลือกปี พ.ศ. 2568, 2569, 2570, 2571 */}
        <div className="flex items-center gap-1 bg-slate-100/90 hover:bg-slate-100 p-1 rounded-md border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-blue-600 ml-1 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">ปี พ.ศ.</span>
          <Select 
            value={selectedYear} 
            onValueChange={(val) => { if (val) setSelectedYear(val as FiscalYear); }}
          >
            <SelectTrigger className="h-7 w-[100px] sm:w-[115px] text-xs font-bold bg-white text-blue-700 border-slate-200 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2568">พ.ศ. 2568</SelectItem>
              <SelectItem value="2569">พ.ศ. 2569 (ปัจจุบัน)</SelectItem>
              <SelectItem value="2570">พ.ศ. 2570</SelectItem>
              <SelectItem value="2571">พ.ศ. 2571</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* เรื่องที่ 1: ปกปิดชื่อตาม PDPA Privacy Toggle */}
        <button
          onClick={togglePdpa}
          type="button"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
            isPdpaActive 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
          }`}
          title={isPdpaActive ? "PDPA เปิดอยู่: ชื่อผู้ป่วยจะถูก Mask เป็น ส*** ภ*** เพื่อความปลอดภัยตามกฎหมาย" : "โหมดเจ้าหน้าที่: แสดงชื่อผู้ป่วยเต็ม"}
        >
          {isPdpaActive ? (
            <>
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">PDPA: ซ่อนชื่อ-สกุล</span>
              <span className="sm:hidden">PDPA</span>
            </>
          ) : (
            <>
              <ShieldAlert size={14} className="text-amber-600 shrink-0" />
              <span className="hidden sm:inline">โหมดเจ้าหน้าที่ (แสดงชื่อ)</span>
              <span className="sm:hidden">เปิดเผยชื่อ</span>
            </>
          )}
        </button>

        {/* ปุ่มบันทึกข้อมูลเคสใหม่ (ระดับหมู่บ้าน) */}
        <Button 
          onClick={() => setIsNewCaseOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9 px-3 gap-1.5 shadow-sm shadow-blue-500/20"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">บันทึกเคสใหม่</span>
          <span className="sm:hidden">บันทึก</span>
        </Button>

        <div className="hidden lg:flex items-center gap-2">
          {/* District selector for Kalasin */}
          <Select defaultValue="all">
            <SelectTrigger className="w-[145px] h-9 text-xs">
              <SelectValue placeholder="อำเภอ" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {kalasinDistricts.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="icon" className="relative text-gray-500 h-9 w-9">
          <Bell size={18} />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
          )}
        </Button>
        
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-blue-500">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
            <AvatarFallback className="bg-blue-600 text-white text-xs">สสจ</AvatarFallback>
          </Avatar>
          <div className="hidden 2xl:block text-left text-xs">
            <div className="font-semibold text-gray-700">เจ้าหน้าที่ สสจ.</div>
            <div className="text-[10px] text-gray-500">กลุ่มงานควบคุมโรค</div>
          </div>
        </div>
      </div>
    </header>
  );
}
