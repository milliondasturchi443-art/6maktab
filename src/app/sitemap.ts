import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages = ["", "/maktab-haqida", "/mamuriyat", "/oqituvchilar", "/oquvchilar", "/ota-onalar", "/yangiliklar", "/tadbirlar", "/yutuqlar", "/galereya", "/hujjatlar", "/qabulxona", "/aloqa"];

  const [news, teachers] = await Promise.all([
    prisma.news.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.teacher.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  return [
    ...staticPages.map((p) => ({ url: `${base}${p || "/"}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...news.map((n) => ({ url: `${base}/yangiliklar/${n.slug}`, lastModified: n.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...teachers.map((t) => ({ url: `${base}/oqituvchilar/${t.slug}`, lastModified: t.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
