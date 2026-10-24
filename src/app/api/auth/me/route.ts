import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  const admin = await prisma.admin.findUnique({
    where: { id: session.id },
    select: { id: true, username: true, name: true, email: true, role: true },
  });

  if (!admin) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: admin });
}
