import crypto from "crypto";
import { MongoClient, GridFSBucket, Db, GridFSFile } from "mongodb";

/**
 * Media-fayllar GridFS (Atlas MongoDB) da saqlanadi.
 * Sabab: bepul Render xizmatlarida persistent disk yo'q — fayllar
 * redeploy/ restart da yo'qoladi. Atlas esa doimiy ombor.
 */

const MONGODB_URL = process.env.MONGODB_URL;

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (!MONGODB_URL || MONGODB_URL.trim().length === 0) {
    throw new Error(
      "MONGODB_URL muhit o'zgaruvchisi sozlanmagan. Media-fayllarni saqlash uchun MongoDB ulanishini kiriting."
    );
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(MONGODB_URL, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    }).connect();
    clientPromise.catch(() => {
      clientPromise = null;
    });
  }
  return clientPromise;
}

async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}

function bucket(db: Db): GridFSBucket {
  return new GridFSBucket(db, { bucketName: "media" });
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

export const ALLOWED_MIME_TYPES = Object.keys(EXT_BY_MIME);
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mime);
}

export function extensionForMime(mime: string): string {
  return EXT_BY_MIME[mime] || "";
}

/** Xavfsiz, katalogdan chiqib ketmaydigan fayl nomi generatsiya qiladi. */
export function safeStoredFilename(mime: string): string {
  const ext = extensionForMime(mime);
  if (!ext) throw new Error(`Noto'g'ri fayl turi: ${mime}`);
  return `${crypto.randomUUID()}${ext}`;
}

/** URL ichidan xavfsiz fayl nomi ajratadi (faqat oddiy nom, katalog chiqishi yo'q). */
export function filenameFromUrl(url: string): string | null {
  if (!url || !url.startsWith("/media/")) return null;
  let name: string;
  try {
    name = decodeURIComponent(url.slice("/media/".length));
  } catch {
    return null;
  }
  if (!name || name.includes("/") || name.includes("\\") || name.includes("..")) return null;
  if (!/^[A-Za-z0-9._-]+$/.test(name)) return null;
  return name;
}

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export function contentTypeForFilename(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const ext = dot >= 0 ? filename.slice(dot).toLowerCase() : "";
  return CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream";
}

/** Faylni GridFS ga yozadi va /media/ URL qaytaradi. */
export async function saveMediaFile(data: Uint8Array, mime: string): Promise<{ url: string; filename: string }> {
  const filename = safeStoredFilename(mime);
  const db = await getDb();
  const b = bucket(db);
  await new Promise<void>((resolve, reject) => {
    const stream = b.openUploadStream(filename, { metadata: { contentType: mime, uploadedAt: new Date() } });
    stream.on("error", reject);
    stream.on("finish", () => resolve());
    stream.end(Buffer.from(data));
  });
  return { url: `/media/${filename}`, filename };
}

/** URL bo'yicha GridFS dan faylni o'chiradi (topilmasa - jim o'tadi). */
export async function deleteMediaFile(url: string): Promise<void> {
  const filename = filenameFromUrl(url);
  if (!filename) return;
  try {
    const db = await getDb();
    const file = await bucket(db).find({ filename }, { limit: 1 }).next();
    if (file) await bucket(db).delete(file._id);
  } catch {
    // fayl allaqachon o'chirilgan bo'lishi mumkin
  }
}

export type MediaFileMeta = {
  id: unknown;
  filename: string;
  contentType: string;
  length: number;
  uploadDate: Date;
};

/** Fayl meta-malumotlarini topadi (topilmasa null). */
export async function findMediaFile(filename: string): Promise<MediaFileMeta | null> {
  if (!/^[A-Za-z0-9._-]+$/.test(filename)) return null;
  const db = await getDb();
  const doc = (await bucket(db).find({ filename }, { limit: 1 }).next()) as GridFSFile | null;
  if (!doc) return null;
  const contentType =
    (doc.metadata as { contentType?: string } | undefined)?.contentType ||
    contentTypeForFilename(filename);
  return {
    id: doc._id,
    filename: doc.filename,
    contentType,
    length: doc.length,
    uploadDate: doc.uploadDate,
  };
}

/** Fayl stream ini ochadi (topilmasa null). */
export async function openMediaStream(filename: string): Promise<NodeJS.ReadableStream | null> {
  const meta = await findMediaFile(filename);
  if (!meta) return null;
  const db = await getDb();
  return bucket(db).openDownloadStream(meta.id as never);
}
