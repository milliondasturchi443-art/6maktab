import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { z } from "zod";

const statusSchema = z.object({ status: z.enum(["new", "read", "replied", "archived"]) });

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const fb = await prisma.feedback.findUnique({ where: { id } });
  if (!fb) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(fb);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
  try {
    const updated = await prisma.feedback.update({ where: { id }, data: { status: parsed.data.status } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.feedback.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
