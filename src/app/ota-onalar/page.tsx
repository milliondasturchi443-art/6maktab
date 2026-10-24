import Link from "next/link";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ota-onalar" };

export default async function OtaOnalarPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">{translate(dict, "nav.parents")}</h1>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-bold dark:text-white">{translate(dict, "nav.documents")}</h3>
          <p className="text-sm text-zinc-500 mt-2">{translate(dict, "empty.noDocuments")}</p>
          <Link href="/hujjatlar" className="text-sm text-[#0f766e] mt-3 inline-block">{translate(dict, "nav.documents")} →</Link>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-bold dark:text-white">{translate(dict, "nav.events")}</h3>
          <Link href="/tadbirlar" className="text-sm text-[#0f766e] mt-3 inline-block">{translate(dict, "nav.events")} →</Link>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-bold dark:text-white">{translate(dict, "nav.schedule")}</h3>
          <Link href="/dars-jadvali" className="text-sm text-[#0f766e] mt-3 inline-block">{translate(dict, "nav.schedule")} →</Link>
        </div>
        <div className="bg-[#0f766e] rounded-2xl p-6 text-white">
          <h3 className="font-bold">{translate(dict, "home.reception")}</h3>
          <p className="text-sm text-teal-100 mt-2">{translate(dict, "home.receptionText")}</p>
          <div className="flex gap-2 mt-4">
            <Link href="/qabulxona" className="h-9 px-4 rounded-xl bg-white text-[#0f766e] text-sm font-medium flex items-center">{translate(dict, "home.receptionBtn")}</Link>
            <Link href="/aloqa" className="h-9 px-4 rounded-xl border border-white/30 text-white text-sm font-medium flex items-center">{translate(dict, "nav.contact")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
