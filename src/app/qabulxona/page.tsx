"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function QabulxonaPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik");
      setSuccess(true);
      setForm({ firstName: "", lastName: "", phone: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Virtual qabulxona</h1>
      <p className="text-zinc-500 mt-2">Murojaatingizni yuboring — tez orada javob beramiz</p>

      {success && (
        <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex gap-3 text-emerald-700 dark:text-emerald-300">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <div>
            <div className="font-semibold">Murojaatingiz qabul qilindi!</div>
            <div className="text-sm opacity-80">Tez orada siz bilan bog&apos;lanamiz.</div>
          </div>
        </div>
      )}

      {error && <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-3 text-sm text-red-600 dark:text-red-300">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium dark:text-zinc-200">Ism *</label>
            <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="Ismingiz" />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-200">Familiya *</label>
            <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="Familiyangiz" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium dark:text-zinc-200">Telefon *</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="+998 90 123 45 67" />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-200">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="email@example.com" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium dark:text-zinc-200">Murojaat mavzusi *</label>
          <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="Mavzu" />
        </div>
        <div>
          <label className="text-sm font-medium dark:text-zinc-200">Murojaat matni *</label>
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" placeholder="Murojaatingizni yozing..." />
        </div>
        <button type="submit" disabled={loading} className="h-11 rounded-xl bg-[#0f766e] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? "Yuborilmoqda..." : <><Send className="w-4 h-4" /> Yuborish</>}
        </button>
      </form>
    </div>
  );
}
