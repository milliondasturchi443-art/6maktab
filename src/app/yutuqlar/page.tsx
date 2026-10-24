import prisma from "@/lib/prisma";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yutuqlar" };

export default async function YutuqlarPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams;
  const category = sp.category || "all";
  const where: Record<string, unknown> = { published: true };
  if (category !== "all") where.category = category;
  const [items, catRows, locale] = await Promise.all([
    prisma.achievement.findMany({ where: where as never, orderBy: { createdAt: "desc" } }),
    prisma.achievement.findMany({ where: { published: true }, select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
    getLocale(),
  ]);
  const dict = await getDictionary(locale as Locale);
  const cats = ["all", ...catRows.map((c) => c.category)];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">{translate(dict, "nav.achievements")}</h1>

      <div className="flex flex-wrap gap-2 mt-6">
        {cats.map((c) => (
          <a key={c} href={`/yutuqlar?category=${encodeURIComponent(c)}`} className={`px-4 py-2 rounded-full text-sm font-medium border ${category === c ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"}`}>
            {c === "all" ? translate(dict, "home.all") : c}
          </a>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-zinc-500 mt-12">{translate(dict, "empty.noAchievements")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {items.map((a) => (
            <div key={a.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {a.image && <div className="h-36 overflow-hidden bg-zinc-100 dark:bg-zinc-800"><img src={a.image} alt={a.title} className="w-full h-full object-cover" /></div>}
              <div className="p-5">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">{a.category}</span>
                <h3 className="font-semibold mt-2 text-sm dark:text-white line-clamp-2">{a.title}</h3>
                {a.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{a.description}</p>}
                <div className="text-xs text-zinc-400 mt-2 space-y-0.5">
                  {a.studentName && <div>{a.studentName}</div>}
                  {a.level && <div>{a.level}</div>}
                  {a.date && <div>{new Date(a.date).toLocaleDateString("uz-UZ")}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
