import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: "site" } });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const data = parsed.data as Record<string, unknown>;

  const updated = await prisma.siteSettings.upsert({
    where: { id: "site" },
    create: { id: "site", ...data } as never,
    update: data as never,
  });

  revalidatePath("/", "layout");
  return NextResponse.json(updated);
}
