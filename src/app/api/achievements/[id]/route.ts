import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { achievementSchema } from "@/lib/validations";
import { deleteMediaFile } from "@/lib/storage";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  const body = await req.json();
  const parsed = achievementSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  const updated = await prisma.achievement.update({
    where: { id },
    data: {
      title: d.title,
      description: d.description || null,
      category: d.category,
      image: d.image || null,
      date: d.date ? new Date(d.date) : null,
      studentName: d.studentName || null,
      level: d.level || null,
      published: d.published ?? existing.published,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  await prisma.achievement.delete({ where: { id } });
  if (existing.image) await deleteMediaFile(existing.image);
  return NextResponse.json({ success: true });
}
