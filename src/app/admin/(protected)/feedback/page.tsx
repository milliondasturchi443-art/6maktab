"use client";

import { useEffect, useState } from "react";

type FB = { id: string; firstName: string; lastName: string; phone: string; email: string | null; subject: string; message: string; status: string; createdAt: string };

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<FB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FB | null>(null);

  const load = async () => { setLoading(true); const r = await fetch("/api/feedback"); setItems(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/feedback/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  };
  const del = async (id: string) => { if (!confirm("O'chirilsinmi?")) return; await fetch(`/api/feedback/${id}`, { method: "DELETE" }); setSelected(null); load(); };

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Murojaatlar</h1>
      <p className="text-sm text-zinc-500 mt-1">Virtual qabulxonadan kelgan murojaatlar</p>

      {loading ? <p className="text-zinc-500 mt-6">Yuklanmoqda...</p> : (
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {items.map((f) => (
              <button key={f.id} onClick={() => setSelected(f)} className={`w-full text-left bg-white dark:bg-zinc-900 rounded-2xl border p-4 ${selected?.id === f.id ? "border-[#0f766e] ring-1 ring-[#0f766e]" : "border-zinc-200 dark:border-zinc-800"}`}>
                <div className="font-medium dark:text-white text-sm">{f.firstName} {f.lastName} — {f.subject}</div>
                <div className="text-xs text-zinc-500 mt-1">{f.phone} • {new Date(f.createdAt).toLocaleString("uz-UZ")}</div>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${f.status === "new" ? "bg-amber-100 text-amber-700" : f.status === "read" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>{f.status}</span>
              </button>
            ))}
            {items.length === 0 && <p className="text-zinc-500 text-center py-8">Murojaatlar yo&apos;q</p>}
          </div>

          <div>
            {selected ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-6">
                <h3 className="font-bold dark:text-white">{selected.subject}</h3>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                  <div>👤 {selected.firstName} {selected.lastName}</div>
                  <div>📞 {selected.phone}</div>
                  {selected.email && <div>✉️ {selected.email}</div>}
                  <div>🕐 {new Date(selected.createdAt).toLocaleString("uz-UZ")}</div>
                </div>
                <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm dark:text-zinc-300 whitespace-pre-wrap">{selected.message}</div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
                    <option value="new">Yangi</option><option value="read">O&apos;qildi</option><option value="replied">Javob berildi</option><option value="archived">Arxiv</option>
                  </select>
                  <button onClick={() => del(selected.id)} className="h-9 px-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">O&apos;chirish</button>
                </div>
              </div>
            ) : <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-500 text-sm">Murojaatni tanlang</div>}
          </div>
        </div>
      )}
    </div>
  );
}
