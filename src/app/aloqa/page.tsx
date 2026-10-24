import prisma from "@/lib/prisma";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Aloqa" };

export default async function AloqaPage() {
  const [s, locale] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" } }),
    getLocale(),
  ]);
  const dict = await getDictionary(locale as Locale);

  const rows = [
    { icon: MapPin, label: "Manzil", value: s?.address },
    { icon: Phone, label: "Telefon", value: s?.phone },
    { icon: Mail, label: "Email", value: s?.email },
    { icon: Clock, label: "Ish vaqti", value: s?.workHours },
  ].filter((r) => r.value);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">{translate(dict, "nav.contact")}</h1>

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            {rows.length === 0 ? (
              <p className="text-sm text-zinc-500">{translate(dict, "empty.noData")}</p>
            ) : rows.map((r, i) => (
              <div key={i} className="flex gap-3"><r.icon className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" /><div><div className="font-medium dark:text-white">{r.label}</div><div className="text-sm text-zinc-500">{r.value}</div></div></div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold dark:text-white">Xarita</h3>
            <div className="mt-3 rounded-xl overflow-hidden aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm text-zinc-400">
              {s?.mapEmbed ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: s.mapEmbed }} /> : <span>Xarita — admin paneldan sozlanadi</span>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-semibold dark:text-white">{translate(dict, "home.reception")}</h3>
          <p className="text-sm text-zinc-500 mt-1">{translate(dict, "home.receptionText")}</p>
          <a href="/qabulxona" className="inline-flex mt-4 h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium items-center">{translate(dict, "home.receptionBtn")}</a>

          {(s?.telegram || s?.instagram || s?.facebook) && (
            <div className="mt-8">
              <h4 className="font-medium dark:text-white">{translate(dict, "footer.socials")}</h4>
              <div className="flex gap-2 mt-3">
                {s?.telegram && <a href={s.telegram} target="_blank" rel="noopener noreferrer" className="h-9 px-4 rounded-xl bg-blue-500 text-white text-sm flex items-center">Telegram</a>}
                {s?.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="h-9 px-4 rounded-xl bg-pink-500 text-white text-sm flex items-center">Instagram</a>}
                {s?.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer" className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm flex items-center">Facebook</a>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
