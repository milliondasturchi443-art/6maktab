import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { newsSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9")));
  const category = searchParams.get("category");
  const search = searchParams.get("search") || searchParams.get("q");
  const published = searchParams.get("published");
  const featured = searchParams.get("featured");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (published !== null && published !== undefined && published !== "") {
    where.published = published === "true";
  } else if (!search) {
    // public listing defaults to published only unless admin requests
    const session = await getSessionFromRequest(req);
    if (!session) where.published = true;
  }
  if (featured === "true") where.featured = true;
  if (category && category !== "all") {
    // try slug or name
    const cat = await prisma.newsCategory.findFirst({
      where: { OR: [{ slug: category }, { name: category }] },
    });
    if (cat) where.categoryId = cat.id;
    else where.categoryId = category;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where: where as never,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.news.count({ where: where as never }),
  ]);

  return NextResponse.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = newsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;
    let slug = slugify(data.title);
    // ensure unique
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const news = await prisma.news.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        image: data.image || null,
        categoryId: data.categoryId || null,
        tags: data.tags || [],
        published: data.published ?? true,
        featured: data.featured ?? false,
        author: session.username,
      },
      include: { category: true },
    });

    revalidatePath("/");
    revalidatePath("/yangiliklar");
    revalidatePath(`/yangiliklar/${news.slug}`);
    return NextResponse.json(news, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
