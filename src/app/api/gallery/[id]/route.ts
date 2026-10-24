import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { gallerySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { deleteMediaFile, filenameFromUrl } from "@/lib/storage";

async function findGallery(id: string) {
  let g = await prisma.gallery.findUnique({ where: { id }, include: { images: true } });
  if (!g) g = await prisma.gallery.findUnique({ where: { slug: id }, include: { images: true } });
  return g;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await findGallery(id);
  if (!g) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

  const session = await getSessionFromRequest(req);
  if (!session && !g.published) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(g);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await findGallery(id);
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

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

  let newSlug = existing.slug;
  if (d.title !== existing.title) {
    newSlug = slugify(d.title);
    const dup = await prisma.gallery.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== existing.id) newSlug = `${newSlug}-${Date.now().toString(36)}`;
  }

  const keptIds = (d.images || []).map((im) => im.id).filter(Boolean) as string[];
  const removed = existing.images.filter((im) => !keptIds.includes(im.id));

  const updated = await prisma.$transaction(async (tx) => {
    for (const im of d.images || []) {
      if (im.id) {
        await tx.galleryImage.update({
          where: { id: im.id },
          data: { url: im.url, caption: im.caption || null, order: im.order ?? 0 },
        });
      } else {
        await tx.galleryImage.create({
          data: { galleryId: existing.id, url: im.url, caption: im.caption || null, order: im.order ?? 0 },
        });
      }
    }
    if (removed.length) await tx.galleryImage.deleteMany({ where: { id: { in: removed.map((r) => r.id) } } });
    return tx.gallery.update({
      where: { id: existing.id },
      data: {
        title: d.title,
        slug: newSlug,
        description: d.description || null,
        category: d.category || null,
        coverImage: d.coverImage || d.images?.[0]?.url || null,
        published: d.published ?? existing.published,
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
  });

  for (const im of removed) await deleteMediaFile(im.url);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const existing = await findGallery(id);
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  const urls = existing.images.map((im) => im.url);
  if (existing.coverImage) urls.push(existing.coverImage);
  // MongoDB da referential actions yo'q — alohida o'chiramiz
  await prisma.galleryImage.deleteMany({ where: { galleryId: existing.id } });
  await prisma.gallery.delete({ where: { id: existing.id } });
  for (const url of urls) await deleteMediaFile(url);
  return NextResponse.json({ success: true });
}
