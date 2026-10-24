import Link from "next/link";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";

export const dynamic = "force-dynamic";
export const metadata = { title: "O'quvchilar" };

export default async function OquvchilarPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale as Locale);

  const cards = [
    {
      title: `📅 ${translate(dict, "nav.schedule")}`,
      href: "/dars-jadvali",
      cta: translate(dict, "nav.schedule"),
    },
    {
      title: `🏆 ${translate(dict, "nav.achievements")}`,
      href: "/yutuqlar",
      cta: translate(dict, "nav.achievements"),
    },
    {
      title: `📋 ${translate(dict, "nav.documents")}`,
      href: "/hujjatlar",
      cta: translate(dict, "nav.documents"),
    },
    {
      title: `📢 ${translate(dict, "nav.news")}`,
      href: "/yangiliklar",
      cta: translate(dict, "nav.news"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">{translate(dict, "nav.students")}</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold dark:text-white">{c.title}</h3>
            <span className="text-sm text-[#0f766e] mt-3 inline-block">{c.cta} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
