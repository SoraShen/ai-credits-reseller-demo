import type { ModelCost, PackageRow, PricingParams } from "./types";

export function creditsPerZar(params: PricingParams) {
  return params.creditsPerUsd / params.usdZar;
}

/** Face ZAR value of credits at USD peg (no efficiency). */
export function faceValueZar(credits: number, params: PricingParams) {
  return (credits / params.creditsPerUsd) * params.usdZar;
}

/** Cost ZAR implied by design margin at list price. */
export function packageCostZar(pkg: PackageRow) {
  return pkg.monthlyPrice * (1 - pkg.designMargin);
}

export function unitPricePer10k(pkg: PackageRow) {
  return (pkg.monthlyPrice / pkg.credits) * 10000;
}

/** Shelf unit price: Rand per 1M Credits (consumer-friendly scale). */
export function unitPricePer1M(pkg: PackageRow) {
  if (pkg.credits <= 0) return 0;
  return (pkg.monthlyPrice / pkg.credits) * 1_000_000;
}

export function marginAtDiscount(pkg: PackageRow, discount: number) {
  const revenue = pkg.monthlyPrice * discount;
  const cost = packageCostZar(pkg);
  const profit = revenue - cost;
  return {
    revenue,
    cost,
    profit,
    margin: revenue > 0 ? profit / revenue : 0,
  };
}

export function breakevenDiscount(pkg: PackageRow) {
  if (pkg.monthlyPrice <= 0) return 1;
  return packageCostZar(pkg) / pkg.monthlyPrice;
}

/** Safety rule: (1+r)*d > 1 */
export function safetyOk(params: PricingParams, discount: number) {
  return (1 + params.markupRate) * discount > 1;
}

/**
 * Credits consumed for one call.
 * prices are USD per million tokens.
 */
export function creditsForCall(
  model: ModelCost,
  inputTokens: number,
  outputTokens: number,
  creditsPerUsd: number
) {
  const usd =
    (inputTokens / 1_000_000) * model.inputPrice +
    (outputTokens / 1_000_000) * model.outputPrice;
  return usd * model.tierCoeff * creditsPerUsd;
}

export function formatCredits(n: number) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return Number.isInteger(m) ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1000)}K`;
  return String(Math.round(n));
}

export function formatZar(n: number) {
  return `R${Math.round(n).toLocaleString("en-ZA")}`;
}

export function tiersLabel(tiers: Array<1 | 2 | 3>) {
  if (tiers.length === 3) return "All Tiers";
  if (tiers.includes(1) && tiers.includes(2)) return "Tier 1 + 2";
  if (tiers.length === 1 && tiers[0] === 1) return "Tier 1";
  return tiers.map((t) => `Tier ${t}`).join(" + ");
}
