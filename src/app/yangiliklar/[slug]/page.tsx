import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Eye, Tag, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let n = await prisma.news.findUnique({ where: { slug } });
  if (!n) n = await prisma.news.findUnique({ where: { id: slug } });
  return { title: n?.title || "Yangilik" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let news = await prisma.news.findUnique({ where: { slug }, include: { category: true } });
  if (!news) news = await prisma.news.findUnique({ where: { id: slug }, include: { category: true } });
  if (!news || !news.published) notFound();

  // increment views
  prisma.news.update({ where: { id: news.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await prisma.news.findMany({
    where: { published: true, id: { not: news.id }, categoryId: news.categoryId || undefined },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/yangiliklar" className="text-sm text-[#0f766e]">← Barcha yangiliklar</Link>

      <div className="mt-4">
        {news.category && <span className="text-xs font-medium px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">{news.category.name}</span>}
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold mt-3 dark:text-white leading-tight">{news.title}</h1>
      <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(news.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}</span>
        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{news.views + 1} marta ko&apos;rildi</span>
        {news.author && <span>Muallif: {news.author}</span>}
      </div>

      {news.image && (
        <div className="mt-6 rounded-2xl overflow-hidden aspect-[16/9] bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose dark:prose-invert mt-6 text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
        {news.content}
      </div>

      {news.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {news.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><Tag className="w-3 h-3" />{t}</span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold text-lg dark:text-white">O&apos;xshash yangiliklar</h3>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {related.map((r) => (
              <Link key={r.id} href={`/yangiliklar/${r.slug}`} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
                {r.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={r.image} alt={r.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400"><FileText className="w-8 h-8" /></div>
                )}
                <div className="p-3">
                  <div className="font-medium text-sm line-clamp-2 dark:text-white">{r.title}</div>
                  <div className="text-xs text-zinc-400 mt-1">{new Date(r.createdAt).toLocaleDateString("uz-UZ")}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
