import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { School } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let t = await prisma.teacher.findUnique({ where: { slug } });
  if (!t) t = await prisma.teacher.findUnique({ where: { id: slug } });
  return { title: t ? t.fullName : "O'qituvchi" };
}

export default async function TeacherDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let teacher = await prisma.teacher.findUnique({ where: { slug } });
  if (!teacher) teacher = await prisma.teacher.findUnique({ where: { id: slug } });
  if (!teacher || !teacher.published) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/oqituvchilar" className="text-sm text-[#0f766e]">← Barcha o&apos;qituvchilar</Link>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden mt-4">
        <div className="h-32 bg-gradient-to-br from-teal-500 to-emerald-600" />
        <div className="p-8">
          {teacher.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={teacher.photo} alt={teacher.fullName} className="w-32 h-32 rounded-2xl object-cover -mt-20 border-4 border-white dark:border-zinc-900 shadow-lg" />
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center -mt-20 border-4 border-white dark:border-zinc-900 shadow-lg text-zinc-400"><School className="w-12 h-12" /></div>
          )}
          <h1 className="text-2xl font-bold mt-4 dark:text-white">{teacher.fullName}</h1>
          <p className="text-[#0f766e] font-medium">{teacher.subject} {teacher.category ? `• ${teacher.category} toifa` : ""}</p>
          {teacher.experience && <p className="text-sm text-zinc-500 mt-1">Tajriba: {teacher.experience} yil</p>}
          {teacher.bio && <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">{teacher.bio}</p>}
          {(teacher.phone || teacher.email) && (
            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 space-y-1 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              {teacher.phone && <div>📞 {teacher.phone}</div>}
              {teacher.email && <div>✉️ {teacher.email}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
