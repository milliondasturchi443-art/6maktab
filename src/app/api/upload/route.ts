import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { isAllowedMime, MAX_UPLOAD_SIZE, saveMediaFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "Fayl hajmi 10MB dan oshmasligi kerak" }, { status: 400 });
    }
    if (!file.type || !isAllowedMime(file.type)) {
      return NextResponse.json({ error: "Fayl formati qo'llab-quvvatlanmaydi" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const { url, filename } = await saveMediaFile(buffer, file.type);
    return NextResponse.json({ url, filename, size: file.size, type: file.type });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server xatosi";
    console.error("Upload error:", e);
    // MONGODB_URL sozlanmagan bo'lsa — aniq konfiguratsiya xatosi qaytariladi
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
