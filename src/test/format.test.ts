import { describe, expect, it } from "vitest";
import { formatDimensions, formatLeadTime, formatPrice, formatPriceBand, formatPriceFrom } from "@/lib/format";

describe("formatPrice", () => {
  it("returns null when no real price is set", () => {
    expect(formatPrice(0)).toBeNull();
    expect(formatPrice(null)).toBeNull();
    expect(formatPrice(undefined)).toBeNull();
    expect(formatPrice(-100)).toBeNull();
  });

  it("formats a price without decimals", () => {
    expect(formatPrice(45000)).toMatch(/45,000/);
  });
});

describe("formatPriceFrom", () => {
  it("falls back to on-request rather than showing zero", () => {
    expect(formatPriceFrom(0)).toBe("Price on request");
  });

  it("prefixes a real price", () => {
    expect(formatPriceFrom(45000)).toMatch(/^From /);
  });
});

describe("formatPriceBand", () => {
  it("returns a rounded band around the price", () => {
    const band = formatPriceBand(10000);
    expect(band).toMatch(/8,500/);
    expect(band).toMatch(/11,500/);
  });

  it("falls back when unpriced", () => {
    expect(formatPriceBand(null)).toBe("Price on request");
  });
});

describe("formatLeadTime", () => {
  it("uses days under a fortnight and weeks beyond", () => {
    expect(formatLeadTime(10)).toBe("10 days");
    expect(formatLeadTime(21)).toBe("3 weeks");
  });

  it("returns null when unset", () => {
    expect(formatLeadTime(0)).toBeNull();
    expect(formatLeadTime(null)).toBeNull();
  });
});

describe("formatDimensions", () => {
  it("prefers diameter for round pieces", () => {
    expect(formatDimensions(null, null, 100)).toBe("100 cm diameter");
  });

  it("renders width by height", () => {
    expect(formatDimensions(120, 80, null)).toBe("120 × 80 cm");
  });

  it("returns an empty string when unknown", () => {
    expect(formatDimensions(null, null, null)).toBe("");
  });
});
