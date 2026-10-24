import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { teacherSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || searchParams.get("q") || "";
  const subject = searchParams.get("subject");
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};
  const session = await getSessionFromRequest(req);
  if (!session) where.published = true;
  if (search) where.fullName = { contains: search, mode: "insensitive" };
  if (subject && subject !== "all") where.subject = subject;
  if (category && category !== "all") where.category = category;

  const teachers = await prisma.teacher.findMany({
    where: where as never,
    orderBy: [{ order: "asc" }, { fullName: "asc" }],
  });
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  const body = await req.json();
  const parsed = teacherSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const data = parsed.data;
  let slug = slugify(data.fullName);
  const dup = await prisma.teacher.findUnique({ where: { slug } });
  if (dup) slug = `${slug}-${Date.now().toString(36)}`;

  const teacher = await prisma.teacher.create({
    data: {
      fullName: data.fullName,
      slug,
      subject: data.subject,
      category: data.category || null,
      experience: data.experience ?? null,
      photo: data.photo || null,
      bio: data.bio || null,
      phone: data.phone || null,
      email: data.email || null,
      published: data.published ?? true,
    },
  });
  return NextResponse.json(teacher, { status: 201 });
}
