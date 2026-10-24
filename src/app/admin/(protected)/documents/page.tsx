"use client";

import { useEffect, useState } from "react";

type Doc = { id: string; title: string; category: string | null; fileUrl: string; fileName: string | null; createdAt: string };

export default function AdminDocsPage() {
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", category: "", fileUrl: "" });
  const [msg, setMsg] = useState("");

  const load = async () => { setLoading(true); const r = await fetch("/api/documents"); setItems(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm({ ...form, fileUrl: data.url }); else alert(data.error);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    if (!form.title || !form.fileUrl) { setMsg("Sarlavha va fayl majburiy"); return; }
    const res = await fetch("/api/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.title, category: form.category || null, fileUrl: form.fileUrl, fileName: form.fileUrl.split("/").pop() || null }) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Xatolik"); return; }
    setForm({ title: "", category: "", fileUrl: "" }); load();
  };

  const del = async (d: Doc) => { if (!confirm(`"${d.title}" o'chirilsinmi?`)) return; await fetch(`/api/documents/${d.id}`, { method: "DELETE" }); load(); };

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Hujjatlar</h1>
      <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-3">
        <h3 className="font-bold dark:text-white">Yangi hujjat yuklash</h3>
        {msg && <div className="bg-red-50 border border-red-200 rounded-xl p-2 text-sm text-red-600">{msg}</div>}
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Hujjat nomi *" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Kategoriya (Nizom, Reja...)" className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
        <div className="flex gap-2">
          <input required value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="Fayl URL *" className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
          <label className="h-10 px-4 rounded-xl bg-[#0f766e] text-white flex items-center text-sm cursor-pointer">Fayl tanlash <input type="file" onChange={handleUpload} className="hidden" /></label>
        </div>
        <button type="submit" className="h-10 px-6 rounded-xl bg-[#0f766e] text-white text-sm font-medium w-fit">Saqlash</button>
      </form>

      {loading ? <p className="text-zinc-500 mt-6">Yuklanmoqda...</p> : (
        <div className="mt-6 grid gap-3">
          {items.map((d) => (
            <div key={d.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4 items-center">
              <div className="flex-1 min-w-0">
                <div className="font-medium dark:text-white truncate">{d.title}</div>
                <div className="text-xs text-zinc-500">{d.category || "—"} • <a href={d.fileUrl} target="_blank" className="text-[#0f766e] underline">Ko&apos;rish</a> • {new Date(d.createdAt).toLocaleDateString("uz-UZ")}</div>
              </div>
              <button onClick={() => del(d)} className="h-9 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm shrink-0">O&apos;chirish</button>
            </div>
          ))}
          {items.length === 0 && <p className="text-zinc-500 text-center py-8">Hujjatlar yo&apos;q</p>}
        </div>
      )}
    </div>
  );
}
