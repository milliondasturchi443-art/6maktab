import { describe, it, expect } from "vitest";
import { filenameFromUrl, safeStoredFilename, isAllowedMime, extensionForMime, MAX_UPLOAD_SIZE } from "@/lib/storage";

describe("filenameFromUrl", () => {
  it("extracts filename from /media/ url", () => {
    expect(filenameFromUrl("/media/abc.png")).toBe("abc.png");
  });

  it("rejects traversal segments", () => {
    expect(filenameFromUrl("/media/../secret.png")).toBeNull();
    expect(filenameFromUrl("/media/..%2Fsecret.png")).toBeNull();
  });

  it("rejects nested paths", () => {
    expect(filenameFromUrl("/media/2026/01/abc.png")).toBeNull();
  });

  it("rejects non-media urls", () => {
    expect(filenameFromUrl("https://evil.com/x.png")).toBeNull();
    expect(filenameFromUrl("/uploads/x.png")).toBeNull();
    expect(filenameFromUrl("javascript:alert(1)")).toBeNull();
  });

  it("returns null for empty", () => {
    expect(filenameFromUrl("")).toBeNull();
    expect(filenameFromUrl(null as never)).toBeNull();
  });

  it("rejects names with unsafe characters", () => {
    expect(filenameFromUrl("/media/abc;.png")).toBeNull();
    expect(filenameFromUrl("/media/abc def.png")).toBeNull();
  });
});

describe("safeStoredFilename", () => {
  it("generates uuid name with extension for allowed mime", () => {
    const name = safeStoredFilename("image/png");
    expect(name).toMatch(/^[0-9a-f-]{36}\.png$/);
  });

  it("throws for disallowed mime", () => {
    expect(() => safeStoredFilename("text/html")).toThrow();
  });
});

describe("mime helpers", () => {
  it("allows only images and pdf", () => {
    expect(isAllowedMime("image/jpeg")).toBe(true);
    expect(isAllowedMime("application/pdf")).toBe(true);
    expect(isAllowedMime("text/html")).toBe(false);
    expect(isAllowedMime("application/x-sh")).toBe(false);
  });

  it("maps mime to extension", () => {
    expect(extensionForMime("image/webp")).toBe(".webp");
    expect(extensionForMime("unknown/x")).toBe("");
  });

  it("caps upload size at 10MB", () => {
    expect(MAX_UPLOAD_SIZE).toBe(10 * 1024 * 1024);
  });
});
