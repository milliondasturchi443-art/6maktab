"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

type Row = {
  id: string;
  className: string;
  dayOfWeek: number;
  period: number;
  subject: string;
  teacher: string | null;
  room: string | null;
  order: number;
};

const empty = { className: "", dayOfWeek: 1, period: 1, subject: "", teacher: "", room: "" };

export default function AdminSchedulePage() {
  const [items, setItems] = useState<Row[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [form, setForm] = useState<typeof empty & { id?: string }>({ ...empty });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setClasses(d.classes || []);
      });
  };
  useEffect(load, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const payload = {
      className: form.className,
      dayOfWeek: Number(form.dayOfWeek),
      period: Number(form.period),
      subject: form.subject,
      teacher: form.teacher || null,
      room: form.room || null,
    };
    const res = await fetch(form.id ? `/api/schedule/${form.id}` : "/api/schedule", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Xatolik");
    else {
      setMsg("Saqlandi!");
      setForm({ ...empty });
      load();
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    await fetch(`/api/schedule/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Dars jadvali</h1>

      <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-4">
        {msg && <div className={`rounded-xl p-3 text-sm ${msg.includes("Saqlandi") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{msg}</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">Sinf</label>
            <input list="class-list" required value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="1-A" />
            <datalist id="class-list">
              {classes.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">Kun</label>
            <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              <option value={1}>Dushanba</option>
              <option value={2}>Seshanba</option>
              <option value={3}>Chorshanba</option>
              <option value={4}>Payshanba</option>
              <option value={5}>Juma</option>
              <option value={6}>Shanba</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">Dars raqami</label>
            <input type="number" min={1} max={12} required value={form.period} onChange={(e) => setForm({ ...form, period: Number(e.target.value) })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">Fan</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">O&apos;qituvchi</label>
            <input value={form.teacher ?? ""} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">Xona</label>
            <input value={form.room ?? ""} onChange={(e) => setForm({ ...form, room: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="h-11 px-6 rounded-xl bg-[#0f766e] text-white font-medium inline-flex items-center gap-2 disabled:opacity-50">
            <Plus className="w-4 h-4" /> {form.id ? "Yangilash" : "Qo'shish"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm({ ...empty })} className="h-11 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium dark:text-zinc-300">
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-zinc-500">
              <th className="p-3 font-medium">Sinf</th>
              <th className="p-3 font-medium">Kun</th>
              <th className="p-3 font-medium">Dars</th>
              <th className="p-3 font-medium">Fan</th>
              <th className="p-3 font-medium">O&apos;qituvchi</th>
              <th className="p-3 font-medium">Xona</th>
              <th className="p-3 font-medium w-20"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-zinc-500">Dars jadvali hali kiritilmagan.</td></tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
                <td className="p-3 font-medium dark:text-white">{it.className}</td>
                <td className="p-3 dark:text-zinc-300">{["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"][it.dayOfWeek - 1]}</td>
                <td className="p-3 dark:text-zinc-300">{it.period}</td>
                <td className="p-3 dark:text-zinc-200">{it.subject}</td>
                <td className="p-3 text-zinc-500">{it.teacher || "—"}</td>
                <td className="p-3 text-zinc-500">{it.room || "—"}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => setForm({ id: it.id, className: it.className, dayOfWeek: it.dayOfWeek, period: it.period, subject: it.subject, teacher: it.teacher || "", room: it.room || "" })} className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"><Pencil className="w-4 h-4 dark:text-zinc-300" /></button>
                    <button onClick={() => del(it.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
