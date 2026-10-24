import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { z } from "zod";

const administrationSchema = z.object({
  fullName: z.string().min(3).max(100),
  position: z.string().min(2).max(200),
  photo: z.string().max(500).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(1000).optional(),
});

export async function GET() {
  const items = await prisma.administration.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const body = await req.json();
  const parsed = administrationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  const item = await prisma.administration.create({
    data: { fullName: d.fullName, position: d.position, photo: d.photo || null, bio: d.bio || null, phone: d.phone || null, email: d.email || null, order: d.order || 0 },
  });
  return NextResponse.json(item, { status: 201 });
}
