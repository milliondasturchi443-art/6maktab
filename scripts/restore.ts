/**
 * MongoDB zaxira nusxasini tiklash (EJSON dump → kolleksiyalar).
 * Ishlatish: npm run restore -- backups/db-....json
 * OGOH: mavjud kolleksiyalar to'liq almashtiriladi.
 */
import "./_env";
import fs from "fs";
import { MongoClient, BSON } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error("XATO: MONGODB_URL sozlanmagan.");
  process.exit(1);
}
const url: string = MONGODB_URL;

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("XATO: fayl parametri kerak. Misol: npm run restore -- backups/db-2026-01-01.json");
    process.exit(1);
  }
  const dump = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;

  const client = await new MongoClient(url).connect();
  try {
    const db = client.db();
    for (const [name, serialized] of Object.entries(dump)) {
      const docs = BSON.EJSON.deserialize(serialized as never, { relaxed: false });
      await db.collection(name).deleteMany({});
      if (Array.isArray(docs) && docs.length) await db.collection(name).insertMany(docs as never[]);
      console.log(`Tiklandi: ${name} (${Array.isArray(docs) ? docs.length : 0} yozuv)`);
    }
    console.log("Tiklash yakunlandi.");
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error("XATO:", e instanceof Error ? e.message : e);
  process.exit(1);
});
