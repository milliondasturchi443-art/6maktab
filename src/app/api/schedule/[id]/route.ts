import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { scheduleSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const parsed = scheduleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  try {
    const updated = await prisma.schedule.update({
      where: { id },
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
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.schedule.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
