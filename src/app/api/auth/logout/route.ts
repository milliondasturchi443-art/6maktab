import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(AUTH_COOKIE_NAME);
  // Also set expired cookie for thoroughness
  res.cookies.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
