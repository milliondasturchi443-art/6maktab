import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { baseDictionary, LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, translate } from "@/lib/dictionary";

export { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, baseDictionary, translate };
export type { Locale, TranslationKey } from "@/lib/dictionary";

export async function getLocale(): Promise<import("@/lib/dictionary").Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  if (raw && isLocale(raw)) return raw;
  return DEFAULT_LOCALE;
}

/**
 * Berilgan til uchun DB'dagi tarjimalarni olib qo'shgan lug'at qaytaradi.
 * Tarjima topilmagan kalit uchun asosiy (uz) matn qaytadi.
 */
export async function getDictionary(locale: import("@/lib/dictionary").Locale): Promise<Record<string, string>> {
  const dict: Record<string, string> = { ...baseDictionary };
  if (locale === DEFAULT_LOCALE) return dict;
  const rows = await prisma.translation.findMany({ where: { locale } });
  for (const row of rows) {
    if (row.value.trim().length > 0) dict[row.key] = row.value;
  }
  return dict;
}
