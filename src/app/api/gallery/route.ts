import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { gallerySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { filenameFromUrl } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where: Record<string, unknown> = {};
  if (category && category !== "all") where.category = category;

  const session = await getSessionFromRequest(req);
  if (!session) where.published = true;

  const galleries = await prisma.gallery.findMany({
    where: where as never,
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(galleries);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const body = await req.json();
  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;

  for (const im of d.images || []) {
    if (!filenameFromUrl(im.url)) {
      return NextResponse.json({ error: "Rasm URL noto'g'ri (faqat /media/ manzillar)" }, { status: 400 });
    }
  }
  if (d.coverImage && !filenameFromUrl(d.coverImage)) {
    return NextResponse.json({ error: "Muqova URL noto'g'ri (faqat /media/ manzillar)" }, { status: 400 });
  }

  let slug = slugify(d.title);
  const dup = await prisma.gallery.findUnique({ where: { slug } });
  if (dup) slug = `${slug}-${Date.now().toString(36)}`;

  const gallery = await prisma.gallery.create({
    data: {
      title: d.title,
      slug,
      description: d.description || null,
      category: d.category || null,
      coverImage: d.coverImage || d.images?.[0]?.url || null,
      published: d.published ?? true,
      images: d.images?.length
        ? { create: d.images.map((im, i) => ({ url: im.url, caption: im.caption || null, order: im.order ?? i })) }
        : undefined,
    },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(gallery, { status: 201 });
}
