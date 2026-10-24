import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { eventSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  const events = await prisma.event.findMany({
    where: where as never,
    orderBy: { date: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const body = await req.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const data = parsed.data;
  let slug = slugify(data.title);
  const dup = await prisma.event.findUnique({ where: { slug } });
  if (dup) slug = `${slug}-${Date.now().toString(36)}`;
  const ev = await prisma.event.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      date: new Date(data.date),
      time: data.time || null,
      location: data.location || null,
      image: data.image || null,
      status: data.status || "upcoming",
    },
  });
  return NextResponse.json(ev, { status: 201 });
}
