const KES = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

/**
 * Returns null when no real price is set, so callers can render
 * "Price on request" rather than a misleading zero.
 */
export function formatPrice(amount: number | null | undefined): string | null {
  if (amount === null || amount === undefined || amount <= 0) return null;
  return KES.format(amount);
}

export function formatPriceFrom(amount: number | null | undefined): string {
  const price = formatPrice(amount);
  return price ? `From ${price}` : "Price on request";
}

/** Indicative band, since quoting happens after a conversation. */
export function formatPriceBand(amount: number | null | undefined, spread = 0.15): string {
  if (!amount || amount <= 0) return "Price on request";
  const low = Math.round((amount * (1 - spread)) / 500) * 500;
  const high = Math.round((amount * (1 + spread)) / 500) * 500;
  return `${KES.format(low)} – ${KES.format(high)}`;
}

export function formatLeadTime(days: number | null | undefined): string | null {
  if (!days || days <= 0) return null;
  if (days < 14) return `${days} days`;
  const weeks = Math.round(days / 7);
  return `${weeks} weeks`;
}

export function formatDimensions(width: number | null, height: number | null, diameter: number | null): string {
  if (diameter) return `${diameter} cm diameter`;
  if (width && height) return `${width} × ${height} cm`;
  return "";
}
