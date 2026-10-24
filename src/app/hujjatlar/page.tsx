import prisma from "@/lib/prisma";
import { FileText, Download, Eye } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hujjatlar" };

export default async function HujjatlarPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams;
  const category = sp.category || "all";
  const where: Record<string, unknown> = { published: true };
  if (category !== "all") where.category = category;
  const docs = await prisma.document.findMany({ where: where as never, orderBy: { createdAt: "desc" } });
  const cats = [...new Set((await prisma.document.findMany({ where: { published: true }, select: { category: true } })).map((d) => d.category).filter(Boolean) as string[])];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Hujjatlar</h1>
      <p className="text-zinc-500 mt-2">Maktab hujjatlari va me&apos;yoriy hujjatlar</p>

      <div className="flex flex-wrap gap-2 mt-6">
        <a href="/hujjatlar?category=all" className={`px-4 py-2 rounded-full text-sm font-medium border ${category === "all" ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 dark:text-zinc-300"}`}>Barchasi</a>
        {cats.map((c) => (
          <a key={c} href={`/hujjatlar?category=${encodeURIComponent(c)}`} className={`px-4 py-2 rounded-full text-sm font-medium border ${category === c ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 dark:text-zinc-300"}`}>{c}</a>
        ))}
      </div>

      <div className="grid gap-4 mt-8">
        {docs.map((d) => (
          <div key={d.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-300 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium dark:text-white truncate">{d.title}</div>
              <div className="text-xs text-zinc-500 flex flex-wrap gap-2 mt-1">
                {d.category && <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">{d.category}</span>}
                {d.fileType && <span>{d.fileType.toUpperCase()}</span>}
                {d.fileSize && <span>{(d.fileSize / 1024).toFixed(1)} KB</span>}
                <span>{new Date(d.createdAt).toLocaleDateString("uz-UZ")}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a href={d.fileUrl} target="_blank" className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center gap-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-white"><Eye className="w-4 h-4" /> Ko&apos;rish</a>
              <a href={d.fileUrl} download className="h-9 px-3 rounded-xl bg-[#0f766e] text-white flex items-center gap-1 text-sm"><Download className="w-4 h-4" /> Yuklash</a>
            </div>
          </div>
        ))}
        {docs.length === 0 && <p className="text-center text-zinc-500 py-12">Hujjatlar topilmadi.</p>}
      </div>
    </div>
  );
}
