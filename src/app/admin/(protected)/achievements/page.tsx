"use client";

import { useEffect, useState } from "react";

type Ach = { id: string; title: string; description: string | null; category: string; image: string | null; date: string | null; studentName: string | null; level: string | null };

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Ach[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Ach | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Fan olimpiadalari", image: "", date: "", studentName: "", level: "" });
  const [msg, setMsg] = useState("");

  const load = async () => { setLoading(true); const r = await fetch("/api/achievements"); setItems(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: "", description: "", category: "Fan olimpiadalari", image: "", date: "", studentName: "", level: "" }); setShowForm(true); };
  const openEdit = (a: Ach) => { setEditing(a); setForm({ title: a.title, description: a.description || "", category: a.category, image: a.image || "", date: a.date ? a.date.slice(0, 10) : "", studentName: a.studentName || "", level: a.level || "" }); setShowForm(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm({ ...form, image: data.url }); else alert(data.error);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const url = editing ? `/api/achievements/${editing.id}` : "/api/achievements";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, date: form.date || undefined }) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Xatolik"); return; }
    setShowForm(false); load();
  };
  const del = async (a: Ach) => { if (!confirm(`"${a.title}" o'chirilsinmi?`)) return; await fetch(`/api/achievements/${a.id}`, { method: "DELETE" }); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Yutuqlar</h1>
        <button onClick={openCreate} className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">+ Qo&apos;shish</button>
      </div>
      {msg && <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{msg}</div>}
      {showForm && (
        <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-3">
          <h3 className="font-bold dark:text-white">{editing ? "Tahrirlash" : "Yangi yutuq"}</h3>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sarlavha *" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Tavsif" className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
          <div className="grid sm:grid-cols-2 gap-3">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              <option>Fan olimpiadalari</option><option>Sport</option><option>San&apos;at</option><option>Tanlovlar</option><option>IT</option><option>Boshqa</option>
            </select>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="O'quvchi ismi" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              <option value="">Daraja</option><option value="tuman">Tuman</option><option value="viloyat">Viloyat</option><option value="respublika">Respublika</option><option value="xalqaro">Xalqaro</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Rasm URL" className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <label className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center text-sm cursor-pointer">Yuklash <input type="file" accept="image/*" onChange={handleUpload} className="hidden" /></label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="h-10 px-6 rounded-xl bg-[#0f766e] text-white text-sm font-medium">Saqlash</button>
            <button type="button" onClick={() => setShowForm(false)} className="h-10 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Bekor qilish</button>
          </div>
        </form>
      )}
      {loading ? <p className="text-zinc-500 mt-6">Yuklanmoqda...</p> : (
        <div className="mt-6 grid gap-3">
          {items.map((a) => (
            <div key={a.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4 items-center">
              {a.image && <img src={a.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium dark:text-white truncate">{a.title}</div>
                <div className="text-xs text-zinc-500">{a.category} {a.studentName && `• ${a.studentName}`} {a.level && `• ${a.level}`}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(a)} className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Tahrirlash</button>
                <button onClick={() => del(a)} className="h-9 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">O&apos;chirish</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-zinc-500 text-center py-8">Yutuqlar yo&apos;q</p>}
        </div>
      )}
    </div>
  );
}
