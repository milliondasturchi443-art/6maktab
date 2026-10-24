import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const locale = body?.locale;
  if (!locale || !isLocale(String(locale))) {
    return NextResponse.json({ error: "Noto'g'ri til" }, { status: 400 });
  }
  const res = NextResponse.json({ success: true, locale });
  res.cookies.set(LOCALE_COOKIE, String(locale), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}
