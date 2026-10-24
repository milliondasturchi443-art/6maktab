"use client";

import { useEffect, useState } from "react";

type Teacher = { id: string; fullName: string; slug: string; subject: string; category: string | null; experience: number | null; photo: string | null; bio: string | null; phone: string | null; email: string | null };

export default function AdminTeachersPage() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ fullName: "", subject: "", category: "", experience: "", photo: "", bio: "", phone: "", email: "" });
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/teachers");
    setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ fullName: "", subject: "", category: "", experience: "", photo: "", bio: "", phone: "", email: "" }); setShowForm(true); };
  const openEdit = (t: Teacher) => { setEditing(t); setForm({ fullName: t.fullName, subject: t.subject, category: t.category || "", experience: t.experience?.toString() || "", photo: t.photo || "", bio: t.bio || "", phone: t.phone || "", email: t.email || "" }); setShowForm(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm({ ...form, photo: data.url }); else alert(data.error);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const payload: Record<string, unknown> = { ...form, experience: form.experience ? parseInt(form.experience) : undefined, photo: form.photo || undefined, bio: form.bio || undefined };
    const url = editing ? `/api/teachers/${editing.slug}` : "/api/teachers";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Xatolik"); return; }
    setShowForm(false); load();
  };
  const del = async (t: Teacher) => { if (!confirm(`"${t.fullName}" o'chirilsinmi?`)) return; await fetch(`/api/teachers/${t.slug}`, { method: "DELETE" }); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">O&apos;qituvchilar</h1>
        <button onClick={openCreate} className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">+ Qo&apos;shish</button>
      </div>
      {msg && <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{msg}</div>}
      {showForm && (
        <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-3">
          <h3 className="font-bold dark:text-white">{editing ? "Tahrirlash" : "Yangi o'qituvchi"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="F.I.Sh *" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Fan *" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              <option value="">Kategoriya</option>
              <option value="Oliy">Oliy</option><option value="Birinchi">Birinchi</option><option value="Ikkinchi">Ikkinchi</option>
            </select>
            <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Tajriba (yil)" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div className="flex gap-2">
            <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="Rasm URL" className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <label className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center text-sm cursor-pointer">Yuklash <input type="file" accept="image/*" onChange={handleUpload} className="hidden" /></label>
          </div>
          {form.photo && <img src={form.photo} alt="" className="w-24 h-24 rounded-xl object-cover" />}
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Qisqa biografiya" className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="h-10 px-6 rounded-xl bg-[#0f766e] text-white text-sm font-medium">Saqlash</button>
            <button type="button" onClick={() => setShowForm(false)} className="h-10 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Bekor qilish</button>
          </div>
        </form>
      )}
      {loading ? <p className="text-zinc-500 mt-6">Yuklanmoqda...</p> : (
        <div className="mt-6 grid gap-3">
          {items.map((t) => (
            <div key={t.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4 items-center">
              {t.photo ? <img src={t.photo} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" /> : <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium dark:text-white truncate">{t.fullName}</div>
                <div className="text-xs text-zinc-500">{t.subject} {t.category ? `• ${t.category}` : ""} {t.experience ? `• ${t.experience} yil` : ""}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(t)} className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Tahrirlash</button>
                <button onClick={() => del(t)} className="h-9 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">O&apos;chirish</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-zinc-500 text-center py-8">O&apos;qituvchilar yo&apos;q</p>}
        </div>
      )}
    </div>
  );
}
