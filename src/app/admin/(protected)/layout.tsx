"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Newspaper, Users, Calendar, Trophy, Image, FileText, MessageSquare, Shield, Settings, LogOut, GraduationCap, CalendarClock, Languages } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "Yangiliklar", icon: Newspaper },
  { href: "/admin/teachers", label: "O'qituvchilar", icon: Users },
  { href: "/admin/administration", label: "Ma'muriyat", icon: Shield },
  { href: "/admin/events", label: "Tadbirlar", icon: Calendar },
  { href: "/admin/achievements", label: "Yutuqlar", icon: Trophy },
  { href: "/admin/gallery", label: "Galereya", icon: Image },
  { href: "/admin/documents", label: "Hujjatlar", icon: FileText },
  { href: "/admin/schedule", label: "Dars jadvali", icon: CalendarClock },
  { href: "/admin/feedback", label: "Murojaatlar", icon: MessageSquare },
  { href: "/admin/translations", label: "Tarjimalar", icon: Languages },
  { href: "/admin/settings", label: "Sozlamalar", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open] = useState(true);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      <aside className={`${open ? "w-64" : "w-16"} shrink-0 bg-zinc-900 text-white flex flex-col transition-all hidden md:flex`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shrink-0"><GraduationCap className="w-5 h-5" /></div>
          {open && <div className="text-sm font-bold leading-tight">6-maktab<br /><span className="text-xs font-normal text-zinc-400">Admin</span></div>}
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-auto">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${active ? "bg-teal-600 text-white" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}>
                <l.icon className="w-5 h-5 shrink-0" />
                {open && l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-white/10 hover:text-white">
            <span className="text-xs">🏠</span> {open && "Saytga o'tish"}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-white/10 hover:text-white">
            <LogOut className="w-5 h-5" /> {open && "Chiqish"}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-zinc-900 text-white p-3 flex items-center justify-between">
          <span className="font-bold text-sm">Admin panel</span>
          <button onClick={logout} className="text-sm bg-white/10 px-3 py-1.5 rounded-lg">Chiqish</button>
        </div>
        <div className="md:hidden bg-zinc-900 text-white px-2 pb-2 flex gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`shrink-0 px-3 py-2 rounded-lg text-xs ${pathname === l.href ? "bg-teal-600" : "bg-white/10"}`}>{l.label}</Link>
          ))}
        </div>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
