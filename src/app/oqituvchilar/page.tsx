import prisma from "@/lib/prisma";
import Link from "next/link";
import { School } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "O'qituvchilar" };

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q || "";
  const subject = sp.subject || "all";
  const category = sp.category || "all";

  const where: Record<string, unknown> = { published: true };
  if (q) where.fullName = { contains: q, mode: "insensitive" };
  if (subject !== "all") where.subject = subject;
  if (category !== "all") where.category = category;

  const [teachers, allTeachers] = await Promise.all([
    prisma.teacher.findMany({ where: where as never, orderBy: [{ order: "asc" }, { fullName: "asc" }] }),
    prisma.teacher.findMany({ where: { published: true }, select: { subject: true, category: true } }),
  ]);

  const subjects = [...new Set(allTeachers.map((t) => t.subject))];
  const categories = [...new Set(allTeachers.map((t) => t.category).filter(Boolean) as string[])];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">O&apos;qituvchilar</h1>

      <form className="mt-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Ism bo'yicha qidirish..." className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm flex-1 min-w-[200px]" />
        <select name="subject" defaultValue={subject} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
          <option value="all">Barcha fanlar</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="category" defaultValue={category} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
          <option value="all">Barcha kategoriyalar</option>
          {categories.map((c) => <option key={c} value={c!}>{c}</option>)}
        </select>
        <button type="submit" className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">Qidirish</button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {teachers.map((t) => (
          <Link key={t.id} href={`/oqituvchilar/${t.slug}`} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow text-center p-6 group">
            {t.photo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={t.photo} alt={t.fullName} className="w-24 h-24 rounded-2xl object-cover mx-auto group-hover:scale-105 transition-transform" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400"><School className="w-10 h-10" /></div>
            )}
            <div className="font-semibold mt-3 dark:text-white">{t.fullName}</div>
            <div className="text-sm text-[#0f766e]">{t.subject}</div>
            <div className="text-xs text-zinc-500 mt-1">{t.category || "—"} {t.experience ? `• ${t.experience} yil` : ""}</div>
          </Link>
        ))}
      </div>
      {teachers.length === 0 && <p className="text-center text-zinc-500 mt-12">O&apos;qituvchilar topilmadi.</p>}
    </div>
  );
}
