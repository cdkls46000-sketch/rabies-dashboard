"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Dog, Bell, X, ShieldCheck, LogIn, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useData } from "@/context/data-context";

const navItems = [
  { href: "/", label: "ภาพรวมสถานการณ์", icon: BarChart3 },
  { href: "/patients", label: "ผู้สัมผัสโรค (คน)", icon: Users },
  { href: "/animals", label: "การเฝ้าระวังในสัตว์", icon: Dog },
  { href: "/alerts", label: "ศูนย์แจ้งเตือนภัย", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    currentUser,
    isLoggedIn,
    logout,
    setIsLoginOpen,
    setLoginReason
  } = useData();

  return (
    <>
      {/* Sidebar Drawer */}
      <aside 
        aria-label="เมนูหลัก"
        className={`
          fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none
          md:static md:translate-x-0
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-20 bg-slate-950 text-white border-b border-slate-800 px-5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐕</span>
            <div>
              <div className="font-bold text-base leading-tight text-white flex items-center gap-1.5">
                Rabies Kalasin
              </div>
              <div className="text-[11px] text-blue-400 font-medium">จ.กาฬสินธุ์ เมืองฟ้าแดดสงยาง</div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label="ปิดเมนู"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-5">
          <div className="px-4 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            เมนูหลัก / ระบบเฝ้าระวัง
          </div>
          <ul className="space-y-1.5 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" 
                        : "hover:bg-slate-800/80 hover:text-white text-slate-300"}
                    `}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 px-4">
            <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <ShieldCheck size={14} /> เขตพื้นที่เฝ้าระวัง One Health
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ครอบคลุม 18 อำเภอ 135 ตำบล ในจังหวัดกาฬสินธุ์ เชื่อมโยง สสจ. และ ปศุสัตว์จังหวัด
              </p>
            </div>
          </div>
        </nav>

        {/* User profile footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/80">
          {isLoggedIn && currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8 ring-1 ring-emerald-500 shrink-0">
                  <AvatarFallback className="bg-emerald-600 text-white font-bold text-xs">
                    {currentUser.role === 'admin' ? 'คว' : 'จบ'}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-400 truncate">{currentUser.position}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors shrink-0"
                title="ออกจากระบบ (Logout)"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setLoginReason('เข้าสู่ระบบสำหรับเจ้าหน้าที่สาธารณสุขเพื่อดูชื่อเต็มและบันทึกเคสใหม่');
                setIsLoginOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <LogIn size={14} />
              <span>เข้าสู่ระบบเจ้าหน้าที่</span>
            </button>
          )}
        </div>
      </aside>
      
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
