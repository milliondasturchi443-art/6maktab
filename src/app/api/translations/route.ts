import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");
  const session = await getSessionFromRequest(req);

  if (session) {
    // administrator barcha tarjimalarni ko'radi
    const items = await prisma.translation.findMany({ orderBy: [{ key: "asc" }, { locale: "asc" }] });
    return NextResponse.json(items);
  }

  // ochiq so'rov: faqat ma'lum bir til tarjimalari
  if (!locale || !(LOCALES as readonly string[]).includes(locale) || locale === DEFAULT_LOCALE) {
    return NextResponse.json([]);
  }
  const items = await prisma.translation.findMany({ where: { locale }, orderBy: { key: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  const body = await req.json();
  const { key, locale, value } = body as { key?: string; locale?: string; value?: string };
  if (!key || key.trim().length < 2) return NextResponse.json({ error: "Kalit majburiy" }, { status: 400 });
  if (!locale || !(LOCALES as readonly string[]).includes(locale) || locale === DEFAULT_LOCALE) {
    return NextResponse.json({ error: "Noto'g'ri til (asosiy uz tanlanmaydi)" }, { status: 400 });
  }
  if (typeof value !== "string") return NextResponse.json({ error: "Tarjima matni majburiy" }, { status: 400 });

  const item = await prisma.translation.upsert({
    where: { key_locale: { key: key.trim(), locale } },
    create: { key: key.trim(), locale, value },
    update: { value },
  });
  return NextResponse.json(item, { status: 201 });
}
