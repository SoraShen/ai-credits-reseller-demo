/**
 * Illustrative USD/ZAR path for demo storytelling.
 * Shaped on published Rand-per-USD ranges (FRED AEXSFUS annual averages plus
 * well-known intra-year swings such as the Apr-2025 spike) — not a live feed.
 */
export interface FxPoint {
  label: string;
  /** calendar quarter */
  t: string;
  usdZar: number;
}

/** ~3.5 years of quarterly USD→ZAR (Rand per 1 USD). */
export const USD_ZAR_QUARTERS: FxPoint[] = [
  { label: "Q1'23", t: "2023-03", usdZar: 17.9 },
  { label: "Q2'23", t: "2023-06", usdZar: 19.1 },
  { label: "Q3'23", t: "2023-09", usdZar: 18.9 },
  { label: "Q4'23", t: "2023-12", usdZar: 18.5 },
  { label: "Q1'24", t: "2024-03", usdZar: 18.9 },
  { label: "Q2'24", t: "2024-06", usdZar: 18.6 },
  { label: "Q3'24", t: "2024-09", usdZar: 17.6 },
  { label: "Q4'24", t: "2024-12", usdZar: 18.1 },
  { label: "Q1'25", t: "2025-03", usdZar: 18.5 },
  { label: "Q2'25", t: "2025-06", usdZar: 19.3 },
  { label: "Q3'25", t: "2025-09", usdZar: 17.6 },
  { label: "Q4'25", t: "2025-12", usdZar: 17.3 },
  { label: "Q1'26", t: "2026-03", usdZar: 17.1 },
  { label: "Q2'26", t: "2026-06", usdZar: 16.9 },
];

export function fxRange(points: FxPoint[]) {
  const vals = points.map((p) => p.usdZar);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}
