"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Dog, Bell, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "ภาพรวมสถานการณ์", icon: BarChart3 },
  { href: "/patients", label: "ผู้สัมผัสโรค (คน)", icon: Users },
  { href: "/animals", label: "การเฝ้าระวังในสัตว์", icon: Dog },
  { href: "/alerts", label: "ศูนย์แจ้งเตือนภัย", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out flex flex-col
        md:static md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand header */}
        <div className="flex flex-col justify-center h-20 bg-slate-950 text-white border-b border-slate-800 px-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐕</span>
            <div>
              <div className="font-bold text-base leading-tight text-white flex items-center gap-1.5">
                Rabies Kalasin
              </div>
              <div className="text-[11px] text-blue-400 font-medium">จ.กาฬสินธุ์ เมืองฟ้าแดดสงยาง</div>
            </div>
          </div>
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
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 px-4">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <ShieldCheck size={14} /> เขตพื้นที่เฝ้าระวัง
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ครอบคลุม 18 อำเภอ 135 ตำบล ในจังหวัดกาฬสินธุ์ เชื่อมโยง สสจ. และ ปศุสัตว์จังหวัด
              </p>
            </div>
          </div>
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-1 ring-slate-700">
              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
              <AvatarFallback className="bg-slate-800 text-white text-xs">สสจ</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">สสจ.กาฬสินธุ์</p>
              <p className="text-[11px] text-slate-400 truncate">กลุ่มงานควบคุมโรคติดต่อ</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
