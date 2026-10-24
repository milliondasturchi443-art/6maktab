import prisma from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Link from "next/link";
import { Clock, Eye, Calendar, MapPin, ArrowRight, Award, Image as ImageIcon, FileText, School } from "lucide-react";
import { getDictionary, getLocale, translate } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, news, teachers, events, achievements, galleries, administration, dictLocale] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" } }),
    prisma.news.findMany({ where: { published: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.teacher.findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 4 }),
    prisma.event.findMany({ orderBy: { date: "asc" }, take: 3 }),
    prisma.achievement.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.gallery.findMany({ where: { published: true }, include: { images: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.administration.findMany({ orderBy: { order: "asc" }, take: 4 }),
    getLocale(),
  ]);
  const dict = await getDictionary(dictLocale as Locale);

  const statsData = {
    studentsCount: settings?.studentsCount ?? null,
    teachersCount: settings?.teachersCount ?? null,
    classesCount: settings?.classesCount ?? null,
    achievementsCount: settings?.achievementsCount ?? null,
    clubsCount: settings?.clubsCount ?? null,
  };

  const aboutText = settings?.aboutText || translate(dict, "home.aboutText");
  const contactRows = [
    { icon: MapPin, value: settings?.address },
    { icon: Clock, value: settings?.workHours },
  ].filter((r) => r.value);
  const hasContact = Boolean(settings?.phone || settings?.email || settings?.address || settings?.workHours);

  return (
    <div>
      <Hero dict={dict} heroImage={settings?.heroImage} stats={statsData} />
      <Stats data={statsData} />

      {/* Yangiliklar */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">{translate(dict, "home.latestNews")}</h2>
            <p className="text-sm text-zinc-500 mt-1">{translate(dict, "home.latestNewsSub")}</p>
          </div>
          <Link href="/yangiliklar" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#0f766e] hover:gap-2 transition-all">{translate(dict, "home.all")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {news.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-10 text-center text-zinc-500">{translate(dict, "empty.noNews")}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n) => (
              <Link key={n.id} href={`/yangiliklar/${n.slug}`} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {n.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <FileText className="w-10 h-10 text-zinc-400" />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {n.category && <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">{n.category.name}</span>}
                    <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(n.createdAt).toLocaleDateString("uz-UZ")}</span>
                  </div>
                  <h3 className="font-semibold line-clamp-2 leading-snug group-hover:text-[#0f766e] dark:text-white">{n.title}</h3>
                  {n.excerpt && <p className="text-sm text-zinc-500 line-clamp-2 mt-2">{n.excerpt}</p>}
                  <div className="flex items-center gap-3 mt-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{n.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-6 sm:hidden">
          <Link href="/yangiliklar" className="inline-flex items-center gap-1 text-sm font-medium text-[#0f766e]">{translate(dict, "home.all")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* Maktab haqida */}
      <section className="max-w-7xl mx-auto px-4 mt-12 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-sm font-semibold text-[#0f766e] tracking-wider uppercase">{translate(dict, "home.about")}</span>
          <h2 className="text-2xl lg:text-3xl font-bold mt-2 dark:text-white">{translate(dict, "home.aboutTitle")}</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {aboutText}
          </p>
          <Link href="/maktab-haqida" className="inline-flex mt-6 h-10 px-5 rounded-xl bg-[#0f766e] text-white text-sm font-medium items-center gap-2">{translate(dict, "home.aboutBtn")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
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
      </section>

      {/* Ma'muriyat preview */}
      {administration.length > 0 && (
        <section className="bg-zinc-900 text-white mt-12 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold">{translate(dict, "home.administration")}</h2>
              <Link href="/mamuriyat" className="text-sm text-teal-300 hover:text-white flex items-center gap-1">{translate(dict, "home.all")} <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {administration.map((a) => (
                <div key={a.id} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                  {a.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={a.photo} alt={a.fullName} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 text-zinc-400"><School className="w-8 h-8" /></div>
                  )}
                  <div className="font-semibold text-sm">{a.fullName}</div>
                  <div className="text-xs text-teal-200 mt-1">{a.position}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* O'qituvchilar */}
      {teachers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">{translate(dict, "home.teachers")}</h2>
            <Link href="/oqituvchilar" className="text-sm font-medium text-[#0f766e] flex items-center gap-1">{translate(dict, "home.all")} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((t) => (
              <Link key={t.id} href={`/oqituvchilar/${t.slug}`} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow text-center p-6">
                {t.photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={t.photo} alt={t.fullName} className="w-24 h-24 rounded-2xl object-cover mx-auto" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400"><School className="w-10 h-10" /></div>
                )}
                <div className="font-semibold mt-3 dark:text-white">{t.fullName}</div>
                <div className="text-sm text-[#0f766e]">{t.subject}</div>
                {t.experience != null && <div className="text-xs text-zinc-500 mt-1">{t.experience} {translate(dict, "common.yil")}</div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tadbirlar */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">{translate(dict, "home.events")}</h2>
            <Link href="/tadbirlar" className="text-sm font-medium text-[#0f766e] flex items-center gap-1">{translate(dict, "home.all")} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((e) => (
              <div key={e.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {e.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={e.image} alt={e.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="font-semibold dark:text-white line-clamp-2">{e.title}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{e.description.slice(0, 100)}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(e.date).toLocaleDateString("uz-UZ")}</span>
                    {e.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{e.location}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Yutuqlar */}
      {achievements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2"><Award className="w-6 h-6 text-amber-500" /> {translate(dict, "home.achievements")}</h2>
            <Link href="/yutuqlar" className="text-sm font-medium text-[#0f766e] flex items-center gap-1">{translate(dict, "home.all")} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((a) => (
              <div key={a.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                {a.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={a.image} alt={a.title} className="w-full h-32 object-cover rounded-xl mb-3" />
                )}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">{a.category}</span>
                <h3 className="font-semibold mt-2 text-sm dark:text-white line-clamp-2">{a.title}</h3>
                {a.studentName && <p className="text-xs text-zinc-500 mt-1">{a.studentName}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Galereya */}
      {galleries.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2"><ImageIcon className="w-6 h-6 text-teal-600" /> {translate(dict, "home.gallery")}</h2>
            <Link href="/galereya" className="text-sm font-medium text-[#0f766e] flex items-center gap-1">{translate(dict, "home.all")} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {galleries.slice(0, 6).map((g) => {
              const cover = g.coverImage || g.images[0]?.url;
              return (
                <Link key={g.id} href="/galereya" className="relative rounded-2xl overflow-hidden aspect-[4/3] group bg-zinc-100 dark:bg-zinc-800">
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={cover} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400"><ImageIcon className="w-10 h-10" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white font-medium text-sm">{g.title}</div>
                    <div className="text-white/70 text-xs">{g.images.length} {translate(dict, "home.imageCount")}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Virtual qabulxona CTA + Aloqa */}
      <section className="max-w-7xl mx-auto px-4 mt-12 grid lg:grid-cols-2 gap-6">
        <div className="bg-[#0f766e] rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold">{translate(dict, "home.reception")}</h3>
          <p className="text-teal-100 text-sm mt-2">{translate(dict, "home.receptionText")}</p>
          <Link href="/qabulxona" className="inline-flex mt-4 h-10 px-5 rounded-xl bg-white text-[#0f766e] font-medium text-sm items-center gap-2">{translate(dict, "home.receptionBtn")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
          <h3 className="font-bold flex items-center gap-2 dark:text-white"><FileText className="w-5 h-5 text-teal-600" /> {translate(dict, "home.contact")}</h3>
          {!hasContact ? (
            <p className="mt-4 text-sm text-zinc-500">{translate(dict, "empty.noData")}</p>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {contactRows.map((r, i) => <p key={i}>{r.value}</p>)}
              {settings?.phone && <p>{settings.phone}</p>}
              {settings?.email && <p>{settings.email}</p>}
            </div>
          )}
          <Link href="/aloqa" className="inline-flex mt-4 text-sm font-medium text-[#0f766e] items-center gap-1">{translate(dict, "home.contactBtn")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </div>
  );
}
