import prisma from "@/lib/prisma";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

const DAY_KEYS = [
  "schedule.dushanba",
  "schedule.seshanba",
  "schedule.chorshanba",
  "schedule.payshanba",
  "schedule.juma",
  "schedule.shanba",
];

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  const { class: classParam } = await searchParams;
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const [items, classRows] = await Promise.all([
    prisma.schedule.findMany({
      where: classParam ? { className: classParam } : undefined,
      orderBy: [{ className: "asc" }, { dayOfWeek: "asc" }, { period: "asc" }, { order: "asc" }],
    }),
    prisma.schedule.findMany({ select: { className: true }, distinct: ["className"], orderBy: { className: "asc" } }),
  ]);
  const classes = classRows.map((c) => c.className);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <CalendarDays className="w-7 h-7 text-[#0f766e]" />
        <h1 className="text-3xl font-bold dark:text-white">{translate(dict, "schedule.title")}</h1>
      </div>
      <p className="text-sm text-zinc-500 mb-6">{translate(dict, "schedule.sub")}</p>

      {classes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <a
            href="/dars-jadvali"
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${!classParam ? "bg-[#0f766e] text-white border-[#0f766e]" : "border-zinc-200 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
          >
            {translate(dict, "schedule.allClasses")}
          </a>
          {classes.map((c) => (
            <a
              key={c}
              href={`/dars-jadvali?class=${encodeURIComponent(c)}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${classParam === c ? "bg-[#0f766e] text-white border-[#0f766e]" : "border-zinc-200 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
            >
              {c}
            </a>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center text-zinc-500">
          {translate(dict, "empty.noSchedule")}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-zinc-500">
                <th className="p-3 font-medium">{translate(dict, "schedule.day")}</th>
                <th className="p-3 font-medium">{translate(dict, "schedule.period")}</th>
                <th className="p-3 font-medium">{translate(dict, "schedule.subject")}</th>
                <th className="p-3 font-medium">{translate(dict, "schedule.teacher")}</th>
                <th className="p-3 font-medium">{translate(dict, "schedule.room")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
                  <td className="p-3 dark:text-zinc-300">{translate(dict, DAY_KEYS[it.dayOfWeek - 1] ?? "")}</td>
                  <td className="p-3 font-medium dark:text-white">{it.period}</td>
                  <td className="p-3 dark:text-zinc-200">{it.subject}</td>
                  <td className="p-3 text-zinc-500">{it.teacher || "—"}</td>
                  <td className="p-3 text-zinc-500">{it.room || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
