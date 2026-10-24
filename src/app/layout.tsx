import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getDictionary, getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
  } catch {
    settings = null;
  }
  const name = settings?.siteName || "Chortoq tumani 6-sonli umumiy o'rta ta'lim maktabi";
  return {
    title: {
      default: name,
      template: "%s | 6-sonli maktab",
    },
    description: settings?.siteDescription || "Chortoq tumani 6-sonli umumiy o'rta ta'lim maktabi.",
    openGraph: {
      title: name,
      description: settings?.siteDescription || undefined,
      type: "website",
      locale: "uz_UZ",
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings = null;
  let locale: Locale = "uz";
  let dict: Record<string, string> = {};
  try {
    locale = await getLocale();
    dict = await getDictionary(locale);
    settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
  } catch {
    // DB mavjud bo'lmasa sayt baribir ochilishi kerak
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}`,
          }}
        />
      </head>
      <body className="antialiased bg-zinc-50 dark:bg-zinc-950">
        <Header dict={dict} settings={settings} locale={locale} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer dict={dict} settings={settings} />
      </body>
    </html>
  );
}
