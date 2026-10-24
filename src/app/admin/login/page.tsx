"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik");
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center text-white"><GraduationCap className="w-6 h-6" /></div>
          <div className="text-left">
            <div className="font-bold dark:text-white">Admin panel</div>
            <div className="text-xs text-zinc-500">6-sonli maktab</div>
          </div>
        </div>
        <h1 className="text-xl font-bold text-center dark:text-white">Kirish</h1>
        <p className="text-sm text-zinc-500 text-center mt-1">Administrator panelga kirish</p>

        {error && <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-300">{error}</div>}

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium dark:text-zinc-200">Login</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="admin" />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-200">Parol</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm" placeholder="••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-[#0f766e] text-white font-medium disabled:opacity-50">
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </div>
      </form>
    </div>
  );
}
