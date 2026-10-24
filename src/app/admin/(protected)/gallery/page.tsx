"use client";

import { useEffect, useState } from "react";

type Gallery = { id: string; title: string; slug: string; category: string | null; coverImage: string | null; images: { id: string; url: string }[] };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", category: "", coverImage: "", images: "" });
  const [msg, setMsg] = useState("");

  const load = async () => { setLoading(true); const r = await fetch("/api/gallery"); setItems(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm({ ...form, coverImage: data.url });
  };

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) urls.push(data.url);
    }
    setForm({ ...form, images: [...form.images.split(",").filter(Boolean), ...urls].join(",") });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    if (!form.title) { setMsg("Sarlavha majburiy"); return; }
    const images = form.images.split(",").map((s) => s.trim()).filter(Boolean);
    const res = await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.title, category: form.category || null, coverImage: form.coverImage || null, images }) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Xatolik"); return; }
    setForm({ title: "", category: "", coverImage: "", images: "" }); load();
  };

  const del = async (g: Gallery) => { if (!confirm(`"${g.title}" o'chirilsinmi?`)) return; await fetch(`/api/gallery/${g.id}`, { method: "DELETE" }); load(); };

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Galereya</h1>
      <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-3">
        <h3 className="font-bold dark:text-white">Yangi albom</h3>
        {msg && <div className="bg-red-50 border border-red-200 rounded-xl p-2 text-sm text-red-600">{msg}</div>}
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Albom nomi *" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Kategoriya (Maktab hayoti...)" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
        <div className="flex gap-2">
          <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="Muqova rasm URL" className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          <label className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center text-sm cursor-pointer">Yuklash <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" /></label>
        </div>
        <div>
          <label className="text-sm font-medium dark:text-zinc-300">Rasmlar (URL vergul bilan yoki ko&apos;p fayl yuklash)</label>
          <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} placeholder="https://... , https://..." className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
          <label className="mt-2 inline-flex h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 items-center text-sm cursor-pointer">Ko&apos;p rasm yuklash <input type="file" accept="image/*" multiple onChange={handleMultiUpload} className="hidden" /></label>
        </div>
        <button type="submit" className="h-10 px-6 rounded-xl bg-[#0f766e] text-white text-sm font-medium w-fit">Saqlash</button>
      </form>

      {loading ? <p className="text-zinc-500 mt-6">Yuklanmoqda...</p> : (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {items.map((g) => (
            <div key={g.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {g.coverImage && <img src={g.coverImage} alt="" className="w-full h-40 object-cover" />}
              <div className="p-4">
                <div className="font-medium dark:text-white">{g.title} <span className="text-xs text-zinc-500">({g.images.length} ta)</span></div>
                <div className="text-xs text-zinc-500">{g.category || "—"}</div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {g.images.slice(0, 4).map((im) => <img key={im.id} src={im.url} alt="" className="w-14 h-14 rounded-lg object-cover" />)}
                </div>
                <button onClick={() => del(g)} className="mt-3 h-8 px-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs">O&apos;chirish</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-zinc-500 col-span-full text-center py-8">Albomlar yo&apos;q</p>}
        </div>
      )}
    </div>
  );
}
