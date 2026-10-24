import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { newsSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { deleteMediaFile } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try by slug first, then by id
  let news = await prisma.news.findUnique({ where: { slug }, include: { category: true } });
  if (!news) {
    news = await prisma.news.findUnique({ where: { id: slug }, include: { category: true } });
  }
  if (!news) return NextResponse.json({ error: "Yangilik topilmadi" }, { status: 404 });

  const session = await getSessionFromRequest(req);
  if (!session && !news.published) return NextResponse.json({ error: "Yangilik topilmadi" }, { status: 404 });

  // increment views (fire and forget)
  prisma.news.update({ where: { id: news.id }, data: { views: { increment: 1 } } }).catch(() => {});

  return NextResponse.json(news);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  const { slug } = await params;
  let existing = await prisma.news.findUnique({ where: { slug } });
  if (!existing) existing = await prisma.news.findUnique({ where: { id: slug } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

  const body = await req.json();
  const parsed = newsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const data = parsed.data;
  let newSlug = existing.slug;
  if (data.title !== existing.title) {
    newSlug = slugify(data.title);
    const dup = await prisma.news.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== existing.id) newSlug = `${newSlug}-${Date.now().toString(36)}`;
  }

  const updated = await prisma.news.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      slug: newSlug,
      excerpt: data.excerpt || null,
      content: data.content,
      image: data.image || null,
      categoryId: data.categoryId || null,
      tags: data.tags || [],
      published: data.published,
      featured: data.featured,
    },
    include: { category: true },
  });

  if (existing.image && existing.image !== updated.image) await deleteMediaFile(existing.image);

  revalidatePath("/");
  revalidatePath("/yangiliklar");
  revalidatePath(`/yangiliklar/${updated.slug}`);
  if (existing.slug !== updated.slug) revalidatePath(`/yangiliklar/${existing.slug}`);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  const { slug } = await params;
  let existing = await prisma.news.findUnique({ where: { slug } });
  if (!existing) existing = await prisma.news.findUnique({ where: { id: slug } });
  if (!existing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

  await prisma.news.delete({ where: { id: existing.id } });
  if (existing.image) await deleteMediaFile(existing.image);

  revalidatePath("/");
  revalidatePath("/yangiliklar");
  revalidatePath(`/yangiliklar/${existing.slug}`);
  return NextResponse.json({ success: true });
}
