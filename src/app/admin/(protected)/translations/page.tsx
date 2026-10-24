"use client";

import { useEffect, useMemo, useState } from "react";
import { baseDictionary, LOCALES, DEFAULT_LOCALE } from "@/lib/dictionary";
import { Check, Loader2, Save } from "lucide-react";

const EDITABLE = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

type Row = { id: string; key: string; locale: string; value: string };

export default function AdminTranslationsPage() {
  const keys = useMemo(() => Object.keys(baseDictionary), []);
  const [locale, setLocale] = useState<string>(EDITABLE[0]);
  const [rows, setRows] = useState<Row[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/translations")
      .then((r) => r.json())
      .then((d: Row[]) => {
        setRows(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const r of rows) {
      if (r.locale === locale) map[r.key] = r.value;
    }
    setValues(map);
  }, [rows, locale]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const existing = rows.filter((r) => r.locale === locale);
      let ok = 0;
      for (const key of keys) {
        const value = values[key] ?? "";
        const prev = existing.find((r) => r.key === key);
        if (value.trim().length === 0) {
          if (prev) {
            const res = await fetch(`/api/translations/${prev.id}`, { method: "DELETE" });
            if (res.ok) ok++;
          }
          continue;
        }
        const base = (baseDictionary as Record<string, string>)[key];
        if (prev && prev.value === value) continue;
        if (!prev && value === base) continue;
        const res = await fetch("/api/translations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, locale, value }),
        });
        if (res.ok) ok++;
      }
      const fresh = await fetch("/api/translations").then((r) => r.json());
      setRows(Array.isArray(fresh) ? fresh : []);
      setMsg(`Saqlandi (${ok} ta yangilandi).`);
    } catch {
      setMsg("Xatolik yuz berdi.");
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  };

  if (loading) return <p className="text-zinc-500">Yuklanmoqda...</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Tarjimalar</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Asosiy til — o&apos;zbekcha ( lug&apos;at kodi ). Bo&apos;sh qoldirilsa, o&apos;zbekcha matn ko&apos;rsatiladi.
          </p>
        </div>
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
          {EDITABLE.map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize ${locale === l ? "bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-white" : "text-zinc-500"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <div className="mt-4 rounded-xl p-3 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4" /> {msg}
        </div>
      )}

      <div className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
        {keys.map((key) => (
          <div key={key} className="p-4 grid md:grid-cols-[240px_1fr] gap-3 items-start">
            <div>
              <div className="text-sm font-mono font-medium text-zinc-700 dark:text-zinc-300 break-all">{key}</div>
              <div className="text-xs text-zinc-400 mt-1">{(baseDictionary as Record<string, string>)[key]}</div>
            </div>
            <input
              value={values[key] ?? ""}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              placeholder={(baseDictionary as Record<string, string>)[key]}
              className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 text-sm"
            />
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 h-11 px-6 rounded-xl bg-[#0f766e] text-white font-medium inline-flex items-center gap-2 disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash
      </button>
    </div>
  );
}
