import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  const [newsCount, teachersCount, eventsCount, achievementsCount, docsCount, galleriesCount, feedbackNew, feedbackTotal, adminsCount] =
    await Promise.all([
      prisma.news.count(),
      prisma.teacher.count(),
      prisma.event.count(),
      prisma.achievement.count(),
      prisma.document.count(),
      prisma.gallery.count(),
      prisma.feedback.count({ where: { status: "new" } }),
      prisma.feedback.count(),
      prisma.administration.count(),
    ]);

  const totalViews = await prisma.news.aggregate({ _sum: { views: true } });

  return NextResponse.json({
    newsCount,
    teachersCount,
    eventsCount,
    achievementsCount,
    docsCount,
    galleriesCount,
    feedbackNew,
    feedbackTotal,
    adminsCount,
    totalViews: totalViews._sum.views || 0,
  });
}
