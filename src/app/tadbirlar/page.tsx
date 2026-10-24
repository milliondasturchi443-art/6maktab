import prisma from "@/lib/prisma";
import { Calendar, MapPin, Clock, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tadbirlar" };

function statusLabel(s: string) {
  if (s === "upcoming") return "Kutilmoqda";
  if (s === "ongoing") return "Davom etmoqda";
  if (s === "completed") return "Yakunlandi";
  return s;
}
function statusColor(s: string) {
  if (s === "upcoming") return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  if (s === "ongoing") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (s === "completed") return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  return "bg-zinc-100 text-zinc-600";
}

export default async function TadbirlarPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Tadbirlar</h1>
      <p className="text-zinc-500 mt-2">Maktab tadbirlari taqvimi</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {events.map((e) => (
          <div key={e.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {e.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={e.image} alt={e.title} className="w-full h-44 object-cover" />
            ) : (
              <div className="w-full h-44 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400"><CalendarDays className="w-10 h-10" /></div>
            )}
            <div className="p-5">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(e.status)}`}>{statusLabel(e.status)}</span>
              <h3 className="font-semibold mt-2 dark:text-white">{e.title}</h3>
              <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{e.description}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(e.date).toLocaleDateString("uz-UZ")}</span>
                {e.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{e.time}</span>}
                {e.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{e.location}</span>}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-zinc-500 col-span-full text-center py-12">Hozircha tadbirlar yo&apos;q.</p>}
      </div>
    </div>
  );
}
