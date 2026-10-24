import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { z } from "zod";
import { deleteMediaFile } from "@/lib/storage";

const administrationSchema = z.object({
  fullName: z.string().min(3).max(100),
  position: z.string().min(2).max(200),
  photo: z.string().max(500).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(1000).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.administration.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  const body = await req.json();
  const parsed = administrationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  const updated = await prisma.administration.update({
    where: { id },
    data: { fullName: d.fullName, position: d.position, photo: d.photo || null, bio: d.bio || null, phone: d.phone || null, email: d.email || null, order: d.order ?? existing.order },
  });
  if (existing.photo && existing.photo !== updated.photo) await deleteMediaFile(existing.photo);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.administration.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  await prisma.administration.delete({ where: { id } });
  if (existing.photo) await deleteMediaFile(existing.photo);
  return NextResponse.json({ success: true });
}
