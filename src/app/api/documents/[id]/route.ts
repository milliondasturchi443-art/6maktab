import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { documentSchema } from "@/lib/validations";
import { deleteMediaFile, filenameFromUrl } from "@/lib/storage";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

  const body = await req.json();
  const parsed = documentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  if (!filenameFromUrl(d.fileUrl)) {
    return NextResponse.json({ error: "Fayl URL noto'g'ri (faqat /media/ manzillar)" }, { status: 400 });
  }

  if (existing.fileUrl !== d.fileUrl) await deleteMediaFile(existing.fileUrl);

  const updated = await prisma.document.update({
    where: { id },
    data: {
      title: d.title,
      category: d.category || null,
      fileUrl: d.fileUrl,
      fileName: d.fileName || null,
      fileSize: d.fileSize ?? null,
      fileType: d.fileType || null,
      published: d.published ?? existing.published,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  await prisma.document.delete({ where: { id } });
  await deleteMediaFile(existing.fileUrl);
  return NextResponse.json({ success: true });
}
