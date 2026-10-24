import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { teacherSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { deleteMediaFile } from "@/lib/storage";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let t = await prisma.teacher.findUnique({ where: { slug } });
  if (!t) t = await prisma.teacher.findUnique({ where: { id: slug } });
  if (!t) return NextResponse.json({ error: "O'qituvchi topilmadi" }, { status: 404 });
  const session = await getSessionFromRequest(req);
  if (!session && !t.published) return NextResponse.json({ error: "O'qituvchi topilmadi" }, { status: 404 });
  return NextResponse.json(t);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { slug } = await params;
  let existing = await prisma.teacher.findUnique({ where: { slug } });
  if (!existing) existing = await prisma.teacher.findUnique({ where: { id: slug } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

  const body = await req.json();
  const parsed = teacherSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const data = parsed.data;
  let newSlug = existing.slug;
  if (data.fullName !== existing.fullName) {
    newSlug = slugify(data.fullName);
    const dup = await prisma.teacher.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== existing.id) newSlug = `${newSlug}-${Date.now().toString(36)}`;
  }
  const updated = await prisma.teacher.update({
    where: { id: existing.id },
    data: {
      fullName: data.fullName,
      slug: newSlug,
      subject: data.subject,
      category: data.category || null,
      experience: data.experience ?? null,
      photo: data.photo || null,
      bio: data.bio || null,
      phone: data.phone || null,
      email: data.email || null,
      published: data.published ?? existing.published,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { slug } = await params;
  let existing = await prisma.teacher.findUnique({ where: { slug } });
  if (!existing) existing = await prisma.teacher.findUnique({ where: { id: slug } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  await prisma.teacher.delete({ where: { id: existing.id } });
  if (existing.photo) await deleteMediaFile(existing.photo);
  return NextResponse.json({ success: true });
}
