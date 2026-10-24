import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const [news, teachers, events, docs] = await Promise.all([
    prisma.news.findMany({
      where: {
        published: true,
        OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }],
      },
      select: { id: true, title: true, slug: true, excerpt: true, image: true, createdAt: true },
      take: 5,
    }),
    prisma.teacher.findMany({
      where: { published: true, fullName: { contains: q, mode: "insensitive" } },
      select: { id: true, fullName: true, slug: true, subject: true, photo: true },
      take: 5,
    }),
    prisma.event.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      select: { id: true, title: true, slug: true, date: true, location: true },
      take: 5,
    }),
    prisma.document.findMany({
      where: { published: true, title: { contains: q, mode: "insensitive" } },
      select: { id: true, title: true, category: true, fileUrl: true },
      take: 5,
    }),
  ]);

  const results = [
    ...news.map((n) => ({ type: "news", ...n, url: `/yangiliklar/${n.slug}` })),
    ...teachers.map((t) => ({ type: "teacher", ...t, url: `/oqituvchilar/${t.slug}` })),
    ...events.map((e) => ({ type: "event", ...e, url: `/tadbirlar` })),
    ...docs.map((d) => ({ type: "document", ...d, url: `/hujjatlar` })),
  ];

  return NextResponse.json({ results, query: q });
}
