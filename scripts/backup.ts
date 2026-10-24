/**
 * MongoDB (Atlas) zaxira nusxasi: barcha kolleksiyalarni JSON (EJSON) faylga aynantiradi.
 * Ishlatish: npm run backup  yoki  npx tsx scripts/backup.ts [chiqish-katalogi]
 */
import "./_env";
import fs from "fs";
import path from "path";
import { MongoClient, BSON } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error("XATO: MONGODB_URL sozlanmagan.");
  process.exit(1);
}
const url: string = MONGODB_URL;

async function main() {
  const outDir = process.argv[2] || "./backups";
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outFile = path.join(outDir, `db-${stamp}.json`);

  const client = await new MongoClient(url).connect();
  try {
    const db = client.db();
    const names = (await db.listCollections().toArray()).map((c) => c.name);
    const dump: Record<string, unknown> = {};
    for (const name of names) {
      if (name.startsWith("system.")) continue;
      const docs = await db.collection(name).find({}).toArray();
      dump[name] = BSON.EJSON.serialize(docs, { relaxed: false });
    }
    fs.writeFileSync(outFile, JSON.stringify(dump));
    console.log(`Zaxira nusxa yaratildi: ${outFile}`);
    console.log(`Tiklash uchun: npm run restore -- ${outFile}`);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error("XATO:", e instanceof Error ? e.message : e);
  process.exit(1);
});
