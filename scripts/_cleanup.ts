import "./_env";
import prisma from "../src/lib/prisma";
import { deleteMediaFile } from "../src/lib/storage";
async function main() {
  const n = await prisma.news.deleteMany({ where: { OR: [{ slug: { startsWith: "test-yangilik" } }, { slug: { startsWith: "draft-yangilik" } }, { title: { contains: "Test yangilik" } }, { title: { contains: "Draft yangilik" } }] } });
  const s = await prisma.schedule.deleteMany({ where: { teacher: "Test Ustoz" } });
  const t = await prisma.translation.deleteMany({ where: { key: "nav.home", locale: "ru" } });
  await deleteMediaFile("/media/6b75ef01-8bb0-4ab1-b3d4-a84e2f3a1302.png");
  console.log(JSON.stringify({ news: n.count, schedule: s.count, translations: t.count }));
  await prisma.$disconnect();
}
main().catch(async (e) => { console.log("ERR", (e as Error).message.split("\n")[0]); await prisma.$disconnect(); });
