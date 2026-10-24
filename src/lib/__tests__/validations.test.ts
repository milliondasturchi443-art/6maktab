import { describe, it, expect } from "vitest";
import { scheduleSchema, loginSchema, settingsSchema } from "@/lib/validations";

describe("scheduleSchema", () => {
  it("accepts valid lesson", () => {
    const r = scheduleSchema.safeParse({ className: "1-A", dayOfWeek: 1, period: 2, subject: "Matematika" });
    expect(r.success).toBe(true);
  });

  it("rejects day outside 1..6", () => {
    expect(scheduleSchema.safeParse({ className: "1-A", dayOfWeek: 7, period: 1, subject: "Math" }).success).toBe(false);
    expect(scheduleSchema.safeParse({ className: "1-A", dayOfWeek: 0, period: 1, subject: "Math" }).success).toBe(false);
  });

  it("rejects missing subject", () => {
    expect(scheduleSchema.safeParse({ className: "1-A", dayOfWeek: 1, period: 1, subject: "" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires min lengths", () => {
    expect(loginSchema.safeParse({ username: "ab", password: "123456" }).success).toBe(false);
    expect(loginSchema.safeParse({ username: "abc", password: "12345" }).success).toBe(false);
    expect(loginSchema.safeParse({ username: "abc", password: "123456" }).success).toBe(true);
  });
});

describe("settingsSchema", () => {
  it("allows nullable counters", () => {
    const r = settingsSchema.safeParse({ studentsCount: null, phone: null });
    expect(r.success).toBe(true);
  });

  it("rejects negative counters", () => {
    expect(settingsSchema.safeParse({ studentsCount: -1 }).success).toBe(false);
  });
});
