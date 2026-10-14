"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Dog, Bell, Plus } from "lucide-react";
import { useData } from "@/context/data-context";

export function MobileNav() {
  const pathname = usePathname();
  const { alerts, setIsNewCaseOpen } = useData();

  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  return (
    <nav 
      aria-label="เมนูหลักสำหรับมือถือ" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.07)] pb-[env(safe-area-inset-bottom,0.5rem)]"
    >
      <div className="flex items-center justify-around h-15 px-2">
        {/* 1. ภาพรวม */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            pathname === "/" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-700 font-medium"
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${pathname === "/" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">ภาพรวม</span>
        </Link>

        {/* 2. ผู้สัมผัสโรค */}
        <Link
          href="/patients"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            pathname === "/patients" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-700 font-medium"
          }`}
        >
          <Users className={`w-5 h-5 ${pathname === "/patients" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">ผู้สัมผัส</span>
        </Link>

        {/* 3. ปุ่มบันทึกเคสใหม่ตรงกลาง (เด่นชัด สไตล์แอปมือถือ) */}
        <div className="flex flex-col items-center justify-center -mt-5 px-1">
          <button
            type="button"
            onClick={() => setIsNewCaseOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/40 flex items-center justify-center active:scale-90 transition-transform ring-4 ring-white"
            aria-label="บันทึกเคสใหม่"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[10px] text-blue-700 font-bold mt-0.5 tracking-tight">บันทึกเคส</span>
        </div>

        {/* 4. เฝ้าระวังสัตว์ */}
        <Link
          href="/animals"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            pathname === "/animals" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-700 font-medium"
          }`}
        >
          <Dog className={`w-5 h-5 ${pathname === "/animals" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">ในสัตว์</span>
        </Link>

        {/* 5. แจ้งเตือน */}
        <Link
          href="/alerts"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 relative ${
            pathname === "/alerts" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-700 font-medium"
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${pathname === "/alerts" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">แจ้งเตือน</span>
        </Link>
      </div>
    </nav>
  );
}
