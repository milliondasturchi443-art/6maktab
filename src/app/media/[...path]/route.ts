import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { filenameFromUrl, findMediaFile, openMediaStream } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const rawName = segments.join("/");
  const filename = filenameFromUrl(`/media/${rawName}`);
  if (!filename) return new NextResponse(null, { status: 404 });

  try {
    const meta = await findMediaFile(filename);
    if (!meta) return new NextResponse(null, { status: 404 });
    const stream = await openMediaStream(filename);
    if (!stream) return new NextResponse(null, { status: 404 });

    const webStream = Readable.toWeb(stream as never) as ReadableStream;
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": meta.contentType,
        "Content-Length": String(meta.length),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(meta.contentType === "application/pdf"
          ? { "Content-Disposition": `inline; filename="${filename}"` }
          : {}),
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes("MONGODB_URL")) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return new NextResponse(null, { status: 404 });
  }
}
