import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const cats = await prisma.newsCategory.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { name } = await req.json();
  if (!name || name.length < 2) return NextResponse.json({ error: "Nom kamida 2 ta belgi" }, { status: 400 });
  let slug = slugify(name);
  const dup = await prisma.newsCategory.findUnique({ where: { slug } });
  if (dup) slug = `${slug}-${Date.now().toString(36)}`;
  const cat = await prisma.newsCategory.create({ data: { name, slug } });
  return NextResponse.json(cat, { status: 201 });
}
