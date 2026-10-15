"use client";

import { usePathname } from "next/navigation";
import { Bell, MapPin, PlusCircle, ShieldCheck, ShieldAlert, Calendar, Menu } from "lucide-react";
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
    setSelectedYear,
    toggleMobileSidebar
  } = useData();
  
  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  const titles: Record<string, string> = {
    "/": "ภาพรวมสถานการณ์",
    "/patients": "ผู้สัมผัสโรค",
    "/animals": "การเฝ้าระวังในสัตว์",
    "/alerts": "ศูนย์แจ้งเตือนภัย",
  };

  const title = titles[pathname] || "ระบบเฝ้าระวังโรคพิษสุนัขบ้า";

  return (
    <header className="bg-white border-b border-gray-200 h-14 sm:h-16 flex items-center justify-between px-2.5 sm:px-4 md:px-6 sticky top-0 z-30">
      {/* Left section: Hamburger button (mobile) + Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="md:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
          aria-label="เปิดเมนูนำทาง"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate">
            {title}
          </h1>
          <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full shrink-0">
            <MapPin size={12} /> จ.กาฬสินธุ์
          </span>
        </div>
      </div>

      {/* Right controls: Fiscal Year, PDPA, New Case button, Notifications, User */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Fiscal Year Selector (ข้อ 4: พ.ศ. 2568-2571) */}
        <div className="flex items-center gap-1 bg-slate-100/90 hover:bg-slate-100 p-1 rounded-md border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-blue-600 ml-0.5 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-600 hidden md:inline">ปี พ.ศ.</span>
          <Select 
            value={selectedYear} 
            onValueChange={(val) => { if (val) setSelectedYear(val as FiscalYear); }}
          >
            <SelectTrigger className="h-6 sm:h-7 w-[78px] sm:w-[105px] text-xs font-bold bg-white text-blue-700 border-slate-200 shadow-none px-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2568">พ.ศ. 2568</SelectItem>
              <SelectItem value="2569">พ.ศ. 2569</SelectItem>
              <SelectItem value="2570">พ.ศ. 2570</SelectItem>
              <SelectItem value="2571">พ.ศ. 2571</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PDPA Privacy Toggle (ข้อ 1: ปกปิดชื่อตาม PDPA) */}
        <button
          onClick={togglePdpa}
          type="button"
          className={`flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
            isPdpaActive 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
          }`}
          title={isPdpaActive ? "PDPA เปิดอยู่: ชื่อผู้สัมผัสโรคจะถูก Mask เป็น ส*** ภ*** เพื่อความปลอดภัยตามกฎหมาย" : "โหมดเจ้าหน้าที่: แสดงชื่อผู้สัมผัสโรคเต็ม"}
        >
          {isPdpaActive ? (
            <>
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">PDPA ซ่อนชื่อ</span>
              <span className="sm:hidden text-[10px] font-bold">PDPA</span>
            </>
          ) : (
            <>
              <ShieldAlert size={14} className="text-amber-600 shrink-0" />
              <span className="hidden sm:inline">เปิดเผยชื่อ</span>
              <span className="sm:hidden text-[10px] font-bold">ชื่อเต็ม</span>
            </>
          )}
        </button>

        {/* บันทึกเคสใหม่ (Desktop view) */}
        <Button 
          onClick={() => setIsNewCaseOpen(true)}
          className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-7 sm:h-8 px-2.5 sm:px-3 gap-1.5 shadow-sm shadow-blue-500/20"
        >
          <PlusCircle size={15} />
          <span>บันทึกเคสใหม่</span>
        </Button>

        {/* District selector for Kalasin (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[125px] h-8 text-xs">
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

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-gray-500 h-8 w-8 sm:h-9 sm:w-9">
          <Bell size={17} />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </Button>
        
        {/* User avatar */}
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-1 ring-blue-500">
          <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
          <AvatarFallback className="bg-blue-600 text-white text-[10px]">สสจ</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
