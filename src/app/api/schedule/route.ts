import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { scheduleSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const className = searchParams.get("class");
  const day = searchParams.get("day");
  const where: Record<string, unknown> = {};
  if (className) where.className = className;
  if (day) where.dayOfWeek = parseInt(day);
  const items = await prisma.schedule.findMany({
    where: where as never,
    orderBy: [{ className: "asc" }, { dayOfWeek: "asc" }, { period: "asc" }, { order: "asc" }],
  });
  const classes = await prisma.schedule.findMany({ select: { className: true }, distinct: ["className"], orderBy: { className: "asc" } });
  return NextResponse.json({ items, classes: classes.map((c) => c.className) });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  const body = await req.json();
  const parsed = scheduleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  const item = await prisma.schedule.create({
    data: {
      className: d.className,
      dayOfWeek: d.dayOfWeek,
      period: d.period,
      subject: d.subject,
      teacher: d.teacher || null,
      room: d.room || null,
      order: d.order ?? 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
