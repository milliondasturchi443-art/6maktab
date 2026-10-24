"use client";

import { LOCALES } from "@/lib/dictionary";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";

const LABELS: Record<string, string> = { uz: "UZ", ru: "RU", en: "EN" };

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const setLocale = async (locale: string) => {
    setOpen(false);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300"
        aria-label="Til"
      >
        <Globe className="w-5 h-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1 min-w-[80px]">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${current === l ? "bg-teal-50 dark:bg-teal-900/30 text-[#0f766e] dark:text-teal-300 font-medium" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-200"}`}
              >
                {LABELS[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
