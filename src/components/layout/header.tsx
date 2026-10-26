"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  MapPin, 
  PlusCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  Menu, 
  LogIn, 
  LogOut, 
  Lock, 
  UserCheck,
  KeyRound,
  FileText,
  Clock,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    selectedDistrict,
    setSelectedDistrict,
    selectedDistrictName,
    toggleMobileSidebar,
    currentUser,
    isLoggedIn,
    logout,
    setIsLoginOpen,
    setLoginReason,
    sessionRemainingSeconds,
    extendSession,
    setIsChangePasswordOpen,
    setIsSecurityAuditOpen
  } = useData();

  const sessionMinutes = Math.floor(sessionRemainingSeconds / 60);
  const sessionSeconds = sessionRemainingSeconds % 60;
  const sessionFormatted = `${sessionMinutes}:${sessionSeconds < 10 ? '0' : ''}${sessionSeconds}`;
  
  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  const kalasinDistrictMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    kalasinDistricts.forEach((d) => {
      map[d.id] = d.name;
    });
    return map;
  }, []);

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
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 mr-1">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="md:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors active:scale-95 shrink-0"
          aria-label="เปิดเมนูนำทาง"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          <h1 className="text-xs sm:text-base md:text-lg font-bold text-gray-800 truncate">
            {title}
          </h1>
          <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full shrink-0">
            <MapPin size={12} /> จ.กาฬสินธุ์
          </span>
        </div>
      </div>

      {/* Right controls: Fiscal Year, PDPA, New Case button, Notifications, User */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Fiscal Year Selector (ข้อ 4: พ.ศ. 2568-2571) */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 hover:bg-slate-100 p-0.5 sm:p-1 rounded-md border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-blue-600 ml-0.5 shrink-0 hidden xs:inline" />
          <span className="text-[11px] font-semibold text-slate-600 hidden md:inline">ปี พ.ศ.</span>
          <Select 
            value={selectedYear} 
            onValueChange={(val) => { if (val) setSelectedYear(val as FiscalYear); }}
            items={{
              '2568': 'พ.ศ. 2568',
              '2569': 'พ.ศ. 2569',
              '2570': 'พ.ศ. 2570',
              '2571': 'พ.ศ. 2571',
            }}
          >
            <SelectTrigger className="h-6 sm:h-7 w-[78px] sm:w-[105px] text-[11px] sm:text-xs font-bold bg-white text-blue-700 border-slate-200 shadow-none px-1 sm:px-1.5">
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

        {/* PDPA Privacy Toggle (เฉพาะเจ้าหน้าที่ที่ล็อกอินแล้วเท่านั้นที่สามารถเปิดดูชื่อเต็มได้) */}
        {isLoggedIn ? (
          <button
            onClick={togglePdpa}
            type="button"
            className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
              isPdpaActive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
            title={isPdpaActive ? "คลิกเพื่อแสดงชื่อเต็ม (โหมดเจ้าหน้าที่)" : "คลิกเพื่อซ่อนชื่อตาม PDPA"}
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
                <span className="hidden sm:inline text-amber-900 font-bold">แสดงชื่อเต็ม</span>
                <span className="sm:hidden text-[10px] font-bold">ชื่อเต็ม</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={togglePdpa}
            type="button"
            className="hidden sm:flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-md text-xs font-medium border bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 transition-all cursor-pointer active:scale-95"
            title="พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA): คลิกเพื่อเข้าสู่ระบบเจ้าหน้าที่เพื่อดูชื่อเต็ม"
          >
            <Lock size={13} className="text-slate-500 shrink-0" />
            <span className="hidden sm:inline">PDPA (ล็อก)</span>
          </button>
        )}

        {/* บันทึกเคสใหม่ (Desktop view) */}
        <Button 
          onClick={() => setIsNewCaseOpen(true)}
          className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-7 sm:h-8 px-2.5 sm:px-3 gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          <PlusCircle size={15} />
          <span>บันทึกเคสใหม่</span>
        </Button>

        {/* District selector for Kalasin (Synchronized across all pages & devices) */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 hover:bg-slate-100 p-0.5 sm:p-1 rounded-md border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-blue-600 ml-0.5 shrink-0 hidden xs:inline" />
          <Select 
            value={selectedDistrict}
            onValueChange={(val) => { if (val) setSelectedDistrict(val); }}
            items={kalasinDistrictMap}
          >
            <SelectTrigger className="h-6 sm:h-7 w-[92px] xs:w-[110px] sm:w-[130px] md:w-[150px] text-[11px] sm:text-xs font-bold bg-white text-slate-800 border-slate-200 shadow-none px-1 sm:px-1.5 truncate">
              <SelectValue placeholder="เลือกอำเภอ" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
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
        
        {/* User Authentication Profile or Login Button */}
        {isLoggedIn && currentUser ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Session countdown live indicator pill */}
            <button
              type="button"
              onClick={extendSession}
              className="hidden lg:flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md cursor-pointer transition-colors"
              title="อายุเซสชันความปลอดภัยคงเหลือ (คลิกเพื่อต่อเวลา 15 นาที)"
            >
              <Clock size={12} className="text-amber-600 animate-pulse" />
              <span>{sessionFormatted}</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left ring-1 ring-emerald-500/80 active:scale-95"
                title={`${currentUser.name} (${currentUser.organization})`}
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-emerald-600">
                  <AvatarFallback className="bg-emerald-600 text-white text-[10px] font-bold">
                    {currentUser.role === 'admin' ? 'คว' : 'จบ'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block text-left pr-1">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold leading-tight flex items-center gap-0.5">
                    <span>🛡️ 2FA Verified</span>
                  </p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-2 bg-white shadow-xl border border-slate-200">
                <DropdownMenuLabel className="font-normal p-2.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[9px] font-bold">
                      2FA Verified
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600">{currentUser.position}</p>
                  <p className="text-[10px] text-blue-700 font-semibold mt-1">{currentUser.organization}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1.5" />

                {/* Session status in dropdown */}
                <div className="px-2 py-1.5 text-[11px] bg-amber-50/80 border border-amber-200 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                    <Clock size={12} className="text-amber-600" />
                    <span>อายุเซสชัน:</span>
                    <span className="font-mono font-bold text-amber-800">{sessionFormatted}</span>
                  </div>
                  <button
                    type="button"
                    onClick={extendSession}
                    className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-0.5 cursor-pointer underline"
                  >
                    <RefreshCw size={10} />
                    <span>ต่อเวลา</span>
                  </button>
                </div>

                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer font-medium text-xs gap-2 py-2"
                >
                  <KeyRound size={14} className="text-blue-600" />
                  <span>เปลี่ยนรหัสผ่าน (Change Password)</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsSecurityAuditOpen(true)}
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer font-medium text-xs gap-2 py-2"
                >
                  <FileText size={14} className="text-indigo-600" />
                  <span>บันทึกความปลอดภัย (Security Audit Log)</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5" />

                <div className="px-2 py-1 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>สิทธิ์ PDPA:</span>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ปลดล็อคดูชื่อเต็ม
                  </span>
                </div>

                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer font-medium text-xs gap-2 py-2"
                >
                  <LogOut size={14} />
                  <span>ออกจากระบบ (Logout)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoginReason('เข้าสู่ระบบสำหรับเจ้าหน้าที่สาธารณสุขเพื่อดูชื่อ-สกุลเต็มของผู้สัมผัสโรคตาม PDPA และบันทึกเคสใหม่');
              setIsLoginOpen(true);
            }}
            className="h-7 sm:h-8 px-2 sm:px-3 text-xs font-semibold text-blue-700 bg-blue-50/80 border-blue-200 hover:bg-blue-100 hover:text-blue-800 gap-1.5 active:scale-95 shadow-2xs cursor-pointer"
          >
            <LogIn size={13} className="text-blue-600 shrink-0" />
            <span className="hidden sm:inline">เข้าสู่ระบบเจ้าหน้าที่</span>
            <span className="sm:hidden font-bold">เข้าสู่ระบบ</span>
          </Button>
        )}
      </div>
    </header>
  );
}
