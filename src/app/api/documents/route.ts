import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { documentSchema } from "@/lib/validations";
import { filenameFromUrl } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where: Record<string, unknown> = {};
  if (category && category !== "all") where.category = category;

  const session = await getSessionFromRequest(req);
  if (!session) where.published = true;

  const docs = await prisma.document.findMany({ where: where as never, orderBy: { createdAt: "desc" } });
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const body = await req.json();
  const parsed = documentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  if (!filenameFromUrl(d.fileUrl)) {
    return NextResponse.json({ error: "Fayl URL noto'g'ri (faqat /media/ manzillar)" }, { status: 400 });
  }
  const doc = await prisma.document.create({
    data: {
      title: d.title,
      category: d.category || null,
      fileUrl: d.fileUrl,
      fileName: d.fileName || null,
      fileSize: d.fileSize ?? null,
      fileType: d.fileType || null,
      published: d.published ?? true,
    },
  });
  return NextResponse.json(doc, { status: 201 });
}
