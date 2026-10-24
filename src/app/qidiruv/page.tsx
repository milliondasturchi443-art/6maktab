"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function SearchContent() {
  const sp = useSearchParams();
  const q = sp.get("q") || "";
  const [results, setResults] = useState<{ type: string; title?: string; fullName?: string; slug?: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.length < 2) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setResults(d.results || []))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold dark:text-white">Qidiruv</h1>
      <p className="text-zinc-500 mt-1">So&apos;rov: <span className="font-medium text-zinc-700 dark:text-zinc-300">&quot;{q}&quot;</span></p>

      <form action="/qidiruv" className="mt-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Qidirish..." className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm" />
        <button type="submit" className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">Qidirish</button>
      </form>

      {loading && <p className="text-zinc-500 mt-6">Qidirilmoqda...</p>}

      {!loading && q.length >= 2 && (
        <div className="mt-6 space-y-3">
          {results.length === 0 && <p className="text-zinc-500">Hech narsa topilmadi.</p>}
          {results.map((r, i) => (
            <Link key={i} href={r.url} className="block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-shadow">
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">{r.type}</span>
              <div className="font-medium mt-1 dark:text-white">{r.title || r.fullName}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QidiruvPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8">Yuklanmoqda...</div>}>
      <SearchContent />
    </Suspense>
  );
}
