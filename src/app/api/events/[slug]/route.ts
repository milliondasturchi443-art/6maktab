import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { eventSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { deleteMediaFile } from "@/lib/storage";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let ev = await prisma.event.findUnique({ where: { slug } });
  if (!ev) ev = await prisma.event.findUnique({ where: { id: slug } });
  if (!ev) return NextResponse.json({ error: "Tadbir topilmadi" }, { status: 404 });
  return NextResponse.json(ev);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { slug } = await params;
  let existing = await prisma.event.findUnique({ where: { slug } });
  if (!existing) existing = await prisma.event.findUnique({ where: { id: slug } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  const body = await req.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const data = parsed.data;
  let newSlug = existing.slug;
  if (data.title !== existing.title) {
    newSlug = slugify(data.title);
    const dup = await prisma.event.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== existing.id) newSlug = `${newSlug}-${Date.now().toString(36)}`;
  }
  const updated = await prisma.event.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      slug: newSlug,
      description: data.description,
      date: new Date(data.date),
      time: data.time || null,
      location: data.location || null,
      image: data.image || null,
      status: data.status,
    },
  });
  if (existing.image && existing.image !== updated.image) await deleteMediaFile(existing.image);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { slug } = await params;
  let existing = await prisma.event.findUnique({ where: { slug } });
  if (!existing) existing = await prisma.event.findUnique({ where: { id: slug } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  await prisma.event.delete({ where: { id: existing.id } });
  if (existing.image) await deleteMediaFile(existing.image);
  return NextResponse.json({ success: true });
}
