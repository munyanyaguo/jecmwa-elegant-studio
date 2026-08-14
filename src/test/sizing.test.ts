import { describe, expect, it } from "vitest";
import {
  EYE_LEVEL_CM,
  FURNITURE_GAP_CM,
  isWallInputValid,
  priceLine,
  quoteTotal,
  suggestCluster,
  suggestSizes,
} from "@/lib/sizing";
import type { FrameFinish, SizeOption } from "@/lib/content/types";

const size = (label: string, widthCm: number, heightCm: number, basePriceKes = 0): SizeOption => ({
  id: label,
  category: "mirror",
  label,
  widthCm,
  heightCm,
  diameterCm: null,
  basePriceKes,
});

const round = (label: string, diameterCm: number): SizeOption => ({
  id: label,
  category: "mirror",
  label,
  widthCm: null,
  heightCm: null,
  diameterCm,
  basePriceKes: 0,
});

const OPTIONS = [
  size("50 × 50 cm", 50, 50),
  size("100 × 100 cm", 100, 100),
  size("180 × 90 cm", 180, 90),
  size("200 × 100 cm", 200, 100),
  round("100 cm diameter", 100),
];

describe("isWallInputValid", () => {
  it("requires positive width and height", () => {
    expect(isWallInputValid({ wallWidthCm: 240, wallHeightCm: 280 })).toBe(true);
    expect(isWallInputValid({ wallWidthCm: 0, wallHeightCm: 280 })).toBe(false);
    expect(isWallInputValid({ wallWidthCm: 240 })).toBe(false);
  });
});

describe("suggestSizes", () => {
  it("ranks the size closest to two-thirds of the wall first", () => {
    const [best] = suggestSizes({ wallWidthCm: 300, wallHeightCm: 280 }, OPTIONS);
    // 200cm on a 300cm wall is 0.66 — the ideal span.
    expect(best.option.label).toBe("200 × 100 cm");
    expect(best.fits).toBe(true);
  });

  it("measures against the furniture when one is given", () => {
    const [best] = suggestSizes(
      { wallWidthCm: 400, wallHeightCm: 280, furnitureWidthCm: 150 },
      OPTIONS,
    );
    expect(best.option.label).toBe("100 × 100 cm");
  });

  it("marks pieces that cannot physically fit and pushes them down the ranking", () => {
    const results = suggestSizes({ wallWidthCm: 120, wallHeightCm: 280 }, OPTIONS);
    const tooWide = results.find((r) => r.option.label === "200 × 100 cm");
    expect(tooWide?.fits).toBe(false);
    expect(tooWide?.note).toMatch(/too wide/i);
    expect(results[0].fits).toBe(true);
  });

  it("hangs at eye level with no furniture below", () => {
    const results = suggestSizes({ wallWidthCm: 300, wallHeightCm: 280 }, OPTIONS);
    const hundred = results.find((r) => r.option.label === "100 × 100 cm");
    expect(hundred?.hangCentreCm).toBe(EYE_LEVEL_CM);
  });

  it("clears the furniture by the standard gap when one is given", () => {
    const results = suggestSizes(
      { wallWidthCm: 300, wallHeightCm: 280, furnitureHeightCm: 80 },
      OPTIONS,
    );
    expect(results[0].hangBottomCm).toBe(80 + FURNITURE_GAP_CM);
  });

  it("treats a round piece as square for fit purposes", () => {
    const results = suggestSizes({ wallWidthCm: 300, wallHeightCm: 280 }, OPTIONS);
    const circle = results.find((r) => r.option.label === "100 cm diameter");
    expect(circle?.widthCm).toBe(100);
    expect(circle?.heightCm).toBe(100);
  });

  it("skips options with no usable dimensions", () => {
    const broken: SizeOption = {
      id: "x", category: "mirror", label: "A4",
      widthCm: null, heightCm: null, diameterCm: null, basePriceKes: 0,
    };
    expect(suggestSizes({ wallWidthCm: 300, wallHeightCm: 280 }, [broken])).toHaveLength(0);
  });
});

describe("suggestCluster", () => {
  it("proposes a multiple when smaller pieces would fill the ideal span", () => {
    const [suggestion] = suggestSizes({ wallWidthCm: 320, wallHeightCm: 280 }, [size("100 × 100 cm", 100, 100)]);
    expect(suggestCluster({ wallWidthCm: 320, wallHeightCm: 280 }, suggestion)).toMatch(/2 across/);
  });

  it("returns null when no clean multiple works", () => {
    const [suggestion] = suggestSizes({ wallWidthCm: 300, wallHeightCm: 280 }, [size("200 × 100 cm", 200, 100)]);
    expect(suggestCluster({ wallWidthCm: 300, wallHeightCm: 280 }, suggestion)).toBeNull();
  });
});

describe("pricing", () => {
  const finish = (multiplier: number): FrameFinish => ({
    id: "f", slug: "f", name: "Finish", note: "", imageUrl: null, imageAlt: "",
    priceMultiplier: multiplier,
  });

  it("applies the frame multiplier and quantity", () => {
    const line = priceLine(size("100 × 100 cm", 100, 100, 10_000), finish(1.15), 3);
    expect(line.unitPriceKes).toBe(11_500);
    expect(line.totalKes).toBe(34_500);
  });

  it("treats a missing finish as no surcharge", () => {
    expect(priceLine(size("A", 10, 10, 5_000), null, 2).totalKes).toBe(10_000);
  });

  it("sums the lines", () => {
    const lines = [
      priceLine(size("A", 10, 10, 1_000), null, 1),
      priceLine(size("B", 10, 10, 2_000), null, 2),
    ];
    expect(quoteTotal(lines)).toBe(5_000);
  });
});
