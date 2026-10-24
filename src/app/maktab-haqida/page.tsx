import prisma from "@/lib/prisma";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";
import { School } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Maktab haqida" };

export default async function MaktabHaqidaPage() {
  const [settings, locale] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" } }),
    getLocale(),
  ]);
  const dict = await getDictionary(locale as Locale);

  const stats = [
    { value: settings?.studentsCount, label: translate(dict, "hero.students"), color: "teal" },
    { value: settings?.teachersCount, label: translate(dict, "hero.teachers"), color: "violet" },
    { value: settings?.achievementsCount, label: translate(dict, "hero.achievements"), color: "amber" },
  ].filter((s) => typeof s.value === "number" && s.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">{translate(dict, "nav.about")}</h1>
      {settings?.siteDescription && (
        <p className="text-zinc-500 mt-2 max-w-3xl">{settings.siteDescription}</p>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          {settings?.heroImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={settings.heroImage} alt={translate(dict, "hero.imageAlt")} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-zinc-400">
              <School className="w-16 h-16" />
              <span className="text-sm">{translate(dict, "empty.noImage")}</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold dark:text-white">{translate(dict, "home.aboutTitle")}</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {settings?.aboutText || translate(dict, "home.aboutText")}
          </p>

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              {stats.map((s) => (
                <div key={s.label} className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{s.value}</div>
                  <div className="text-xs text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
