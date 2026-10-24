import { describe, it, expect } from "vitest";
import { translate, isLocale, baseDictionary, LOCALES } from "@/lib/dictionary";

describe("dictionary", () => {
  it("has uz as default locale", () => {
    expect(LOCALES).toContain("uz");
    expect(isLocale("uz")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });

  it("translate falls back to key", () => {
    expect(translate({}, "nav.home")).toBe(baseDictionary["nav.home"]);
    expect(translate({ "nav.home": "Home" }, "nav.home")).toBe("Home");
    expect(translate({}, "nonexistent.key")).toBe("nonexistent.key");
  });

  it("base dictionary has no empty values", () => {
    for (const [k, v] of Object.entries(baseDictionary)) {
      expect(v.trim().length, `empty value for ${k}`).toBeGreaterThan(0);
    }
  });
});
