import prisma from "@/lib/prisma";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";
import { School } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ma'muriyat" };

export default async function MamuriyatPage() {
  const [list, locale] = await Promise.all([
    prisma.administration.findMany({ orderBy: { order: "asc" } }),
    getLocale(),
  ]);
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">{translate(dict, "nav.administration")}</h1>
      {list.length === 0 && <p className="text-zinc-500 mt-2">{translate(dict, "empty.noAdministration")}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {list.map((a) => (
          <div key={a.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-center">
            <div className="h-32 bg-gradient-to-br from-teal-500 to-emerald-600" />
            {a.photo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={a.photo} alt={a.fullName} className="w-24 h-24 rounded-2xl object-cover mx-auto -mt-12 border-4 border-white dark:border-zinc-900 shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto -mt-12 border-4 border-white dark:border-zinc-900 shadow-lg text-zinc-400"><School className="w-10 h-10" /></div>
            )}
            <div className="p-6">
              <div className="font-bold dark:text-white">{a.fullName}</div>
              <div className="text-sm text-[#0f766e] font-medium mt-1">{a.position}</div>
              {a.bio && <p className="text-sm text-zinc-500 mt-3 line-clamp-3">{a.bio}</p>}
              {(a.phone || a.email) && (
                <div className="text-xs text-zinc-400 mt-3 space-y-1">
                  {a.phone && <div>{a.phone}</div>}
                  {a.email && <div>{a.email}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
