"use client";

import { useEffect, useState } from "react";

type News = { id: string; title: string; slug: string; excerpt: string | null; content: string; image: string | null; categoryId: string | null; category?: { name: string } | null; published: boolean; featured: boolean; views: number; createdAt: string };
type Cat = { id: string; name: string; slug: string };

export default function AdminNewsPage() {
  const [items, setItems] = useState<News[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", image: "", categoryId: "", published: true, featured: false });
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const [nRes, cRes] = await Promise.all([fetch("/api/news?limit=100"), fetch("/api/news-categories")]);
    const nData = await nRes.json();
    setItems(nData.items || nData || []);
    if (cRes.ok) setCats(await cRes.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", excerpt: "", content: "", image: "", categoryId: "", published: true, featured: false });
    setShowForm(true);
  };
  const openEdit = (n: News) => {
    setEditing(n);
    setForm({ title: n.title, excerpt: n.excerpt || "", content: n.content, image: n.image || "", categoryId: n.categoryId || "", published: n.published, featured: n.featured });
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm({ ...form, image: data.url });
    else alert(data.error || "Yuklashda xatolik");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const url = editing ? `/api/news/${editing.slug}` : "/api/news";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, categoryId: form.categoryId || null }) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Xatolik"); return; }
    setShowForm(false);
    load();
  };

  const del = async (n: News) => {
    if (!confirm(`"${n.title}" o'chirilsinmi?`)) return;
    await fetch(`/api/news/${n.slug}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Yangiliklar</h1>
        <button onClick={openCreate} className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">+ Yangi qo&apos;shish</button>
      </div>
      {msg && <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{msg}</div>}

      {showForm && (
        <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-4">
          <h3 className="font-bold dark:text-white">{editing ? "Tahrirlash" : "Yangi yangilik"}</h3>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sarlavha" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Qisqa tavsif (excerpt)" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} placeholder="To'liq matn" className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Rasm URL" className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
            <label className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center text-sm cursor-pointer">
              Yuklash <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
          {form.image && <img src={form.image} alt="" className="w-full h-40 object-cover rounded-xl" />}
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
            <option value="">Kategoriyasiz</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm dark:text-zinc-300"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Nashr etilgan</label>
            <label className="flex items-center gap-2 text-sm dark:text-zinc-300"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Tavsiya etilgan</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="h-10 px-6 rounded-xl bg-[#0f766e] text-white text-sm font-medium">Saqlash</button>
            <button type="button" onClick={() => setShowForm(false)} className="h-10 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Bekor qilish</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-zinc-500 mt-6">Yuklanmoqda...</p> : (
        <div className="mt-6 grid gap-3">
          {items.map((n) => (
            <div key={n.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4 items-center">
              {n.image && <img src={n.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium dark:text-white truncate">{n.title}</div>
                <div className="text-xs text-zinc-500 flex gap-2 flex-wrap">
                  <span>{n.category?.name || "—"}</span>
                  <span>• {n.views} ko&apos;rish</span>
                  <span>• {new Date(n.createdAt).toLocaleDateString("uz-UZ")}</span>
                  {!n.published && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Qoralama</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(n)} className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white">Tahrirlash</button>
                <button onClick={() => del(n)} className="h-9 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">O&apos;chirish</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-zinc-500 text-center py-8">Yangiliklar yo&apos;q</p>}
        </div>
      )}
    </div>
  );
}
