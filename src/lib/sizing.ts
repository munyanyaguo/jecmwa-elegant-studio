import type { FrameFinish, SizeOption } from "./content/types";

/**
 * Interior-styling rules of thumb used by the wall-fit guide.
 * A piece reads best when it spans roughly two-thirds of the wall (or of the
 * furniture beneath it) and is centred near standing eye level.
 */
export const IDEAL_SPAN = 0.66;
export const MIN_SPAN = 0.5;
export const MAX_SPAN = 0.78;
export const EYE_LEVEL_CM = 145;
export const MIN_SIDE_CLEARANCE_CM = 15;
/** Gap between the top of a console/sofa and the bottom of the piece. */
export const FURNITURE_GAP_CM = 20;

export type WallInput = {
  wallWidthCm: number;
  wallHeightCm: number;
  /** Width of the console, sofa or bed the piece will hang above. */
  furnitureWidthCm?: number | null;
  /** Height from floor to the top of that furniture. */
  furnitureHeightCm?: number | null;
};

export type SizeSuggestion = {
  option: SizeOption;
  widthCm: number;
  heightCm: number;
  /** 0–1. How closely this option matches the ideal span. */
  score: number;
  spanRatio: number;
  /** Height from floor to the bottom edge of the piece. */
  hangBottomCm: number;
  /** Height from floor to the centre of the piece. */
  hangCentreCm: number;
  fits: boolean;
  note: string;
};

function dimensionsOf(option: SizeOption): { width: number; height: number } | null {
  if (option.diameterCm) return { width: option.diameterCm, height: option.diameterCm };
  if (option.widthCm && option.heightCm) return { width: option.widthCm, height: option.heightCm };
  return null;
}

export function isWallInputValid(input: Partial<WallInput>): input is WallInput {
  return (
    typeof input.wallWidthCm === "number" &&
    input.wallWidthCm > 0 &&
    typeof input.wallHeightCm === "number" &&
    input.wallHeightCm > 0
  );
}

/**
 * Ranks the studio's standard sizes against a wall. Returns every option with a
 * score so the UI can show near-misses rather than hiding them.
 */
export function suggestSizes(input: WallInput, options: SizeOption[]): SizeSuggestion[] {
  const reference =
    input.furnitureWidthCm && input.furnitureWidthCm > 0 ? input.furnitureWidthCm : input.wallWidthCm;

  const suggestions: SizeSuggestion[] = [];

  for (const option of options) {
    const dims = dimensionsOf(option);
    if (!dims) continue;

    const spanRatio = dims.width / reference;
    const widthFits = dims.width + MIN_SIDE_CLEARANCE_CM * 2 <= input.wallWidthCm;

    const hangBottomCm =
      input.furnitureHeightCm && input.furnitureHeightCm > 0
        ? input.furnitureHeightCm + FURNITURE_GAP_CM
        : Math.max(0, EYE_LEVEL_CM - dims.height / 2);

    const hangCentreCm = hangBottomCm + dims.height / 2;
    const heightFits = hangBottomCm + dims.height <= input.wallHeightCm;

    // Score falls off symmetrically either side of the ideal two-thirds span.
    const distance = Math.abs(spanRatio - IDEAL_SPAN);
    const score = Math.max(0, 1 - distance / IDEAL_SPAN);

    suggestions.push({
      option,
      widthCm: dims.width,
      heightCm: dims.height,
      score: widthFits && heightFits ? score : score * 0.25,
      spanRatio,
      hangBottomCm: Math.round(hangBottomCm),
      hangCentreCm: Math.round(hangCentreCm),
      fits: widthFits && heightFits,
      note: describe({ spanRatio, widthFits, heightFits }),
    });
  }

  return suggestions.sort((a, b) => b.score - a.score);
}

function describe({
  spanRatio,
  widthFits,
  heightFits,
}: {
  spanRatio: number;
  widthFits: boolean;
  heightFits: boolean;
}): string {
  if (!widthFits) return "Too wide — it would crowd the wall.";
  if (!heightFits) return "Too tall to hang at a comfortable height here.";
  if (spanRatio > MAX_SPAN) return "Generous. Dominates the wall — striking if that's the intent.";
  if (spanRatio < MIN_SPAN) return "Small for this wall. Best used as part of a cluster.";
  if (Math.abs(spanRatio - IDEAL_SPAN) < 0.08) return "Well proportioned for this wall.";
  return spanRatio > IDEAL_SPAN ? "Slightly bold, but balanced." : "Quietly proportioned.";
}

/** A grid of smaller pieces is often the better answer on a wide wall. */
export function suggestCluster(input: WallInput, suggestion: SizeSuggestion): string | null {
  const reference =
    input.furnitureWidthCm && input.furnitureWidthCm > 0 ? input.furnitureWidthCm : input.wallWidthCm;
  const target = reference * IDEAL_SPAN;
  const gap = 8;

  for (const columns of [2, 3, 4]) {
    const total = suggestion.widthCm * columns + gap * (columns - 1);
    if (Math.abs(total - target) / target < 0.12) {
      return `${columns} across at ${gap} cm spacing reads as one composition (${Math.round(total)} cm total).`;
    }
  }
  return null;
}

export type QuoteLine = {
  option: SizeOption;
  finish: FrameFinish | null;
  quantity: number;
  unitPriceKes: number;
  totalKes: number;
};

export function priceLine(
  option: SizeOption,
  finish: FrameFinish | null,
  quantity: number,
): QuoteLine {
  const unit = Math.round(option.basePriceKes * (finish?.priceMultiplier ?? 1));
  return {
    option,
    finish,
    quantity,
    unitPriceKes: unit,
    totalKes: unit * quantity,
  };
}

export function quoteTotal(lines: QuoteLine[]): number {
  return lines.reduce((sum, line) => sum + line.totalKes, 0);
}
