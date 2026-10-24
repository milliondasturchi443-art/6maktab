import prisma from "@/lib/prisma";
import Link from "next/link";
import { Clock, Eye, FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yangiliklar" };

export default async function YangiliklarPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const limit = 9;
  const category = sp.category || "all";
  const q = sp.q || "";

  const cats = await prisma.newsCategory.findMany({ orderBy: { name: "asc" } });

  const where: Record<string, unknown> = { published: true };
  if (category !== "all") {
    const cat = cats.find((c) => c.slug === category || c.name === category);
    if (cat) where.categoryId = cat.id;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({ where: where as never, include: { category: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.news.count({ where: where as never }),
  ]);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Yangiliklar</h1>

      <form className="mt-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Qidirish..." className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm flex-1 min-w-[200px]" />
        <select name="category" defaultValue={category} className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
          <option value="all">Barcha kategoriyalar</option>
          {cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <button type="submit" className="h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium">Qidirish</button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {items.map((n) => (
          <Link key={n.id} href={`/yangiliklar/${n.slug}`} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              {n.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <FileText className="w-10 h-10 text-zinc-400" />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {n.category && <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">{n.category.name}</span>}
                <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(n.createdAt).toLocaleDateString("uz-UZ")}</span>
              </div>
              <h3 className="font-semibold line-clamp-2 group-hover:text-[#0f766e] dark:text-white">{n.title}</h3>
              {n.excerpt && <p className="text-sm text-zinc-500 line-clamp-2 mt-2">{n.excerpt}</p>}
              <div className="text-xs text-zinc-400 mt-3 flex items-center gap-1"><Eye className="w-3 h-3" />{n.views}</div>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && <p className="text-center text-zinc-500 mt-12">Yangiliklar topilmadi.</p>}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/yangiliklar?page=${p}&category=${category}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium border ${p === page ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 dark:text-white hover:bg-zinc-50"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
