import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { achievementSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where: Record<string, unknown> = {};
  const session = await getSessionFromRequest(req);
  if (!session) where.published = true;
  if (category && category !== "all") where.category = category;
  const items = await prisma.achievement.findMany({ where: where as never, orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const body = await req.json();
  const parsed = achievementSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  const item = await prisma.achievement.create({
    data: {
      title: d.title,
      description: d.description || null,
      category: d.category,
      image: d.image || null,
      date: d.date ? new Date(d.date) : null,
      studentName: d.studentName || null,
      level: d.level || null,
      published: d.published ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
