"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => { setForm(d); setLoading(false); });
  }, []);

  const handleUpload = async (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm({ ...form, [field]: data.url } as never);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg("");
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Xatolik"); else setMsg("Saqlandi!");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  if (loading) return <p className="text-zinc-500">Yuklanmoqda...</p>;

  const input = (key: string, label: string, placeholder?: string, type: string = "text") => (
    <div>
      <label className="text-sm font-medium dark:text-zinc-300">{label}</label>
      <input type={type} value={String(form[key] ?? "")} onChange={(e) => setForm({ ...form, [key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value })} placeholder={placeholder} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Sozlamalar</h1>
      <form onSubmit={submit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-4">
        {msg && <div className={`rounded-xl p-3 text-sm ${msg.includes("Saqlandi") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{msg}</div>}

        {input("siteName", "Sayt nomi")}
        <div>
          <label className="text-sm font-medium dark:text-zinc-300">Sayt tavsifi</label>
          <textarea value={String(form.siteDescription ?? "")} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium dark:text-zinc-300">Maktab haqida matn (bosh sahifada)</label>
          <textarea value={String(form.aboutText ?? "")} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} rows={4} placeholder="Maktab haqida haqiqiy matn..." className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {input("phone", "Telefon")}
          {input("email", "Email")}
        </div>
        {input("address", "Manzil")}
        {input("workHours", "Ish vaqti")}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">Logo URL</label>
            <div className="flex gap-2 mt-1">
              <input value={String(form.logo ?? "")} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
              <label className="h-10 px-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 flex items-center text-xs cursor-pointer">Yuklash <input type="file" accept="image/*" onChange={(e) => handleUpload("logo", e)} className="hidden" /></label>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-300">Hero rasm URL</label>
            <div className="flex gap-2 mt-1">
              <input value={String(form.heroImage ?? "")} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} className="flex-1 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" />
              <label className="h-10 px-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 flex items-center text-xs cursor-pointer">Yuklash <input type="file" accept="image/*" onChange={(e) => handleUpload("heroImage", e)} className="hidden" /></label>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {input("telegram", "Telegram")}
          {input("instagram", "Instagram")}
          {input("facebook", "Facebook")}
        </div>
        {input("youtube", "YouTube")}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {input("studentsCount", "O'quvchilar", undefined, "number")}
          {input("teachersCount", "O'qituvchilar", undefined, "number")}
          {input("classesCount", "Sinflar", undefined, "number")}
          {input("achievementsCount", "Yutuqlar", undefined, "number")}
          {input("clubsCount", "To'garaklar", undefined, "number")}
        </div>

        <button type="submit" disabled={saving} className="h-11 px-6 rounded-xl bg-[#0f766e] text-white font-medium w-fit disabled:opacity-50">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
      </form>
    </div>
  );
}
