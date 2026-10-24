"use client";

import { useEffect, useState } from "react";

type Event = { id: string; title: string; slug: string; description: string; date: string; time: string | null; location: string | null; image: string | null; status: string };

export default function AdminEventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", image: "", status: "upcoming" });
  const [msg, setMsg] = useState("");

  const load = async () => { setLoading(true); const r = await fetch("/api/events"); setItems(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: "", description: "", date: "", time: "", location: "", image: "", status: "upcoming" }); setShowForm(true); };
  const openEdit = (e: Event) => { setEditing(e); setForm({ title: e.title, description: e.description, date: e.date.slice(0, 10), time: e.time || "", location: e.location || "", image: e.image || "", status: e.status }); setShowForm(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm({ ...form, image: data.url }); else alert(data.error);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const url = editing ? `/api/events/${editing.slug}` : "/api/events";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Xatolik"); return; }
    setShowForm(false); load();
  };
  const del = async (ev: Event) => { if (!confirm(`"${ev.title}" o'chirilsinmi?`)) return; await fetch(`/api/events/${ev.slug}`, { method: "DELETE" }); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Tadbirlar</h1>
        <button onClick={openCreate} className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">+ Qo&apos;shish</button>
      </div>
      {msg && <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{msg}</div>}
      {showForm && (
        <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-3">
          <h3 className="font-bold dark:text-white">{editing ? "Tahrirlash" : "Yangi tadbir"}</h3>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nom *" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Tavsif *" className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
          <div className="grid sm:grid-cols-3 gap-3">
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="Vaqt (09:00)" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Joy" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div className="flex gap-2">
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Rasm URL" className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <label className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center text-sm cursor-pointer">Yuklash <input type="file" accept="image/*" onChange={handleUpload} className="hidden" /></label>
          </div>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
            <option value="upcoming">Kutilmoqda</option><option value="ongoing">Davom etmoqda</option><option value="completed">Yakunlandi</option><option value="cancelled">Bekor qilindi</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="h-10 px-6 rounded-xl bg-[#0f766e] text-white text-sm font-medium">Saqlash</button>
            <button type="button" onClick={() => setShowForm(false)} className="h-10 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Bekor qilish</button>
          </div>
        </form>
      )}
      {loading ? <p className="text-zinc-500 mt-6">Yuklanmoqda...</p> : (
        <div className="mt-6 grid gap-3">
          {items.map((ev) => (
            <div key={ev.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4 items-center">
              {ev.image && <img src={ev.image} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium dark:text-white truncate">{ev.title}</div>
                <div className="text-xs text-zinc-500">{new Date(ev.date).toLocaleDateString("uz-UZ")} {ev.time && `• ${ev.time}`} {ev.location && `• ${ev.location}`} • {ev.status}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(ev)} className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Tahrirlash</button>
                <button onClick={() => del(ev)} className="h-9 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">O&apos;chirish</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-zinc-500 text-center py-8">Tadbirlar yo&apos;q</p>}
        </div>
      )}
    </div>
  );
}
