"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, Sun, Moon, GraduationCap, Phone, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { translate } from "@/lib/dictionary";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const navKeys = [
  { href: "/", key: "nav.home" },
  { href: "/maktab-haqida", key: "nav.about" },
  { href: "/mamuriyat", key: "nav.administration" },
  { href: "/oqituvchilar", key: "nav.teachers" },
  { href: "/oquvchilar", key: "nav.students" },
  { href: "/ota-onalar", key: "nav.parents" },
  { href: "/yangiliklar", key: "nav.news" },
  { href: "/tadbirlar", key: "nav.events" },
  { href: "/yutuqlar", key: "nav.achievements" },
  { href: "/galereya", key: "nav.gallery" },
  { href: "/hujjatlar", key: "nav.documents" },
  { href: "/dars-jadvali", key: "nav.schedule" },
  { href: "/qabulxona", key: "nav.reception" },
  { href: "/aloqa", key: "nav.contact" },
];

type SettingsLite = {
  siteName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  workHours?: string | null;
} | null;

export default function Header({
  dict,
  settings,
  locale,
}: {
  dict: Record<string, string>;
  settings: SettingsLite;
  locale: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim().length >= 2) {
      router.push(`/qidiruv?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setQ("");
    }
  };

  const navLinks = navKeys.map((l) => ({ href: l.href, label: translate(dict, l.key) }));
  const siteName = settings?.siteName || "6-sonli maktab";
  const hasContacts = Boolean(settings?.phone || settings?.email);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
      {hasContacts && (
        <div className="hidden lg:block bg-[#0f766e] text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {settings?.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {settings.phone}</span>}
              {settings?.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {settings.email}</span>}
            </div>
            <span>
              {settings?.address && <>{settings.address}{settings.workHours ? " • " : ""}</>}
              {settings?.workHours}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-[64px]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="font-bold text-sm dark:text-white">{siteName}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Chortoq tumani</div>
            </div>
            <div className="font-bold text-sm dark:text-white sm:hidden">6-maktab</div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.slice(0, 8).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === l.href ? "bg-teal-50 dark:bg-teal-900/30 text-[#0f766e] dark:text-teal-300" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="relative group">
              <button className="px-2.5 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">{translate(dict, "nav.more")} ▾</button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 min-w-[200px]">
                {navLinks.slice(8).map((l) => (
                  <Link key={l.href} href={l.href} className="block px-3 py-2 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-200">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300" aria-label={translate(dict, "nav.search")}>
              <Search className="w-5 h-5" />
            </button>
            <LanguageSwitcher current={locale} />
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3 flex gap-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={translate(dict, "search.placeholder")}
              className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">{translate(dict, "search.button")}</button>
          </form>
        )}
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 max-h-[70vh] overflow-auto">
          <nav className="p-4 grid gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium ${pathname === l.href ? "bg-teal-50 dark:bg-teal-900/30 text-[#0f766e]" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-200"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
