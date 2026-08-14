import { describe, expect, it } from "vitest";
import { enquirySchema, readUtm, validateAttachment } from "@/lib/enquiry";

const valid = {
  name: "Wanjiku Mwangi",
  email: "wanjiku@example.com",
  phone: "0711 722 331",
  whatsappOptIn: true,
  rooms: ["lounge"],
  message: "Our lounge has a long empty wall above the sofa.",
  consent: true as const,
};

describe("enquirySchema", () => {
  it("accepts a complete enquiry", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });

  it("normalises the email address", () => {
    const result = enquirySchema.parse({ ...valid, email: "  Wanjiku@Example.COM " });
    expect(result.email).toBe("wanjiku@example.com");
  });

  it("rejects a malformed email", () => {
    const result = enquirySchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires a message with real content", () => {
    expect(enquirySchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });

  it("requires consent", () => {
    expect(enquirySchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejects letters in the phone number", () => {
    expect(enquirySchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
  });

  it("allows an empty phone number", () => {
    expect(enquirySchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
  });

  it("fails when the honeypot is filled", () => {
    expect(enquirySchema.safeParse({ ...valid, company: "spam co" }).success).toBe(false);
  });
});

describe("readUtm", () => {
  it("picks up campaign parameters", () => {
    expect(readUtm("?utm_source=instagram&utm_campaign=mirrors&other=1")).toEqual({
      utm_source: "instagram",
      utm_campaign: "mirrors",
    });
  });

  it("returns an empty object when there are none", () => {
    expect(readUtm("?page=2")).toEqual({});
  });
});

describe("validateAttachment", () => {
  const file = (name: string, type: string, size: number) =>
    Object.defineProperty(new File([""], name, { type }), "size", { value: size });

  it("accepts a normal photo", () => {
    expect(validateAttachment(file("room.jpg", "image/jpeg", 1_000_000))).toBeNull();
  });

  it("rejects anything over 5 MB", () => {
    expect(validateAttachment(file("big.jpg", "image/jpeg", 6_000_000))).toMatch(/larger than 5 MB/);
  });

  it("rejects non-images", () => {
    expect(validateAttachment(file("plans.pdf", "application/pdf", 1_000))).toMatch(/supported image/);
  });
});
