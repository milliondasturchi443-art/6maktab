import Link from "next/link";
import { ArrowRight, School } from "lucide-react";
import { translate } from "@/lib/dictionary";

type HeroProps = {
  dict: Record<string, string>;
  heroImage?: string | null;
  stats: {
    studentsCount?: number | null;
    teachersCount?: number | null;
    achievementsCount?: number | null;
  };
};

export default function Hero({ dict, heroImage, stats }: HeroProps) {
  const statItems = [
    { value: stats.studentsCount, label: translate(dict, "hero.students") },
    { value: stats.teachersCount, label: translate(dict, "hero.teachers") },
    { value: stats.achievementsCount, label: translate(dict, "hero.achievements") },
  ].filter((s): s is { value: number; label: string } => typeof s.value === "number" && s.value > 0);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 border border-teal-100 dark:border-zinc-700 rounded-full px-3 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 shadow-sm mb-4">
            <ArrowRight className="w-3.5 h-3.5" /> {translate(dict, "hero.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {translate(dict, "hero.title")}
          </h1>
          <p className="mt-4 text-base lg:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
            {translate(dict, "hero.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/maktab-haqida" className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#0f766e] text-white font-medium hover:bg-[#115e59] transition-colors">
              {translate(dict, "hero.aboutBtn")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/yangiliklar" className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-white">
              {translate(dict, "hero.newsBtn")}
            </Link>
          </div>
          {statItems.length > 0 && (
            <div className="mt-8 flex gap-6">
              {statItems.map((s) => (
                <div key={s.label}><div className="text-2xl font-bold dark:text-white">{s.value}</div><div className="text-xs text-zinc-500">{s.label}</div></div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white dark:border-zinc-700 aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            {heroImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={heroImage} alt={translate(dict, "hero.imageAlt")} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <School className="w-16 h-16" />
                <span className="text-sm">{translate(dict, "empty.noImage")}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center text-white text-sm font-bold">6</div>
              <div>
                <div className="font-semibold text-sm dark:text-white">{translate(dict, "hero.cardTitle")}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{translate(dict, "hero.cardSub")}</div>
              </div>
            </div>
          </div>
          <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-teal-100 dark:bg-teal-900/30 rounded-full blur-2xl" />
          <div className="absolute -z-10 -bottom-6 -left-6 w-40 h-40 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
}
