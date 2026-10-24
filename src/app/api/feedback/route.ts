import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { feedbackSchema } from "@/lib/validations";

// In-memory rate limiter for feedback
const fbAttempts = new Map<string, { count: number; resetAt: number }>();
function checkRate(ip: string) {
  const now = Date.now();
  const e = fbAttempts.get(ip);
  if (!e || now > e.resetAt) {
    fbAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  e.count++;
  return e.count > 5;
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  const items = await prisma.feedback.findMany({ where: where as never, orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (checkRate(ip)) return NextResponse.json({ error: "Juda ko'p murojaat. Bir soatdan so'ng qayta urinib ko'ring." }, { status: 429 });

  const body = await req.json();
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const fb = await prisma.feedback.create({ data: parsed.data });
  return NextResponse.json({ success: true, id: fb.id }, { status: 201 });
}
