"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, Users, Calendar, Trophy, FileText, Image as ImageIcon, MessageSquare, Eye } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return <div className="text-zinc-500">Yuklanmoqda...</div>;

  const cards = [
    { label: "Yangiliklar", value: stats.newsCount, icon: Newspaper, color: "bg-blue-500", href: "/admin/news" },
    { label: "O'qituvchilar", value: stats.teachersCount, icon: Users, color: "bg-teal-600", href: "/admin/teachers" },
    { label: "Tadbirlar", value: stats.eventsCount, icon: Calendar, color: "bg-violet-500", href: "/admin/events" },
    { label: "Yutuqlar", value: stats.achievementsCount, icon: Trophy, color: "bg-amber-500", href: "/admin/achievements" },
    { label: "Hujjatlar", value: stats.docsCount, icon: FileText, color: "bg-emerald-500", href: "/admin/documents" },
    { label: "Galereyalar", value: stats.galleriesCount, icon: ImageIcon, color: "bg-pink-500", href: "/admin/gallery" },
    { label: "Murojaatlar", value: stats.feedbackTotal, sub: `${stats.feedbackNew} yangi`, icon: MessageSquare, color: "bg-orange-500", href: "/admin/feedback" },
    { label: "Jami ko'rishlar", value: stats.totalViews, icon: Eye, color: "bg-zinc-700", href: "/admin/news" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
      <p className="text-sm text-zinc-500 mt-1">Xush kelibsiz, administrator!</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center text-white`}><c.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold mt-3 dark:text-white">{c.value}</div>
            <div className="text-sm text-zinc-500">{c.label} {c.sub && <span className="text-amber-600">• {c.sub}</span>}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
