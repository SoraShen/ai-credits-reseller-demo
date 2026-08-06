import type { Billing, ModelCost, PackageRow, PricingParams } from "./types";

export const MONTHS_PER_YEAR = 12;

export function creditsPerZar(params: PricingParams) {
  return params.creditsPerUsd / params.usdZar;
}

/** Face ZAR value of credits at USD peg (no efficiency). */
export function faceValueZar(credits: number, params: PricingParams) {
  return (credits / params.creditsPerUsd) * params.usdZar;
}

/** Monthly ZAR cost implied by design margin at monthly list price. */
export function packageCostZar(pkg: PackageRow) {
  return pkg.monthlyPrice * (1 - pkg.designMargin);
}

/** Rand per 1M Credits for an arbitrary price / credit pair. */
export function unitPricePer1MOf(price: number, credits: number) {
  if (credits <= 0) return 0;
  return (price / credits) * 1_000_000;
}

/** List monthly shelf unit price: Rand per 1M Credits. */
export function unitPricePer1M(pkg: PackageRow) {
  return unitPricePer1MOf(pkg.monthlyPrice, pkg.credits);
}

/**
 * Single source of truth for every price shown to a customer.
 * `credits` on a package is always the MONTHLY quota, so a yearly plan
 * delivers 12× that quota for the yearly price.
 */
export function planPricing(
  pkg: PackageRow,
  billing: Billing,
  promoDiscount: number,
  opts: { promoStacksOnAnnual?: boolean } = {}
) {
  const yearly = billing === "yearly";
  const promoApplies = yearly ? opts.promoStacksOnAnnual === true : true;
  const d = promoApplies ? Math.min(Math.max(promoDiscount, 0), 1) : 1;

  const listPeriod = yearly ? pkg.yearlyPrice : pkg.monthlyPrice;
  const payPeriod = Math.round(listPeriod * d);
  const periodCredits = yearly ? pkg.credits * MONTHS_PER_YEAR : pkg.credits;

  // Effective monthly economics (comparable across billing modes).
  const payMonthly = yearly ? payPeriod / MONTHS_PER_YEAR : payPeriod;
  const monthlyListTotal = yearly
    ? pkg.monthlyPrice * MONTHS_PER_YEAR
    : pkg.monthlyPrice;

  const promoOff = 1 - d;
  const totalOffVsMonthly =
    monthlyListTotal > 0 ? 1 - payPeriod / monthlyListTotal : 0;
  const annualOnlyOff =
    monthlyListTotal > 0 ? 1 - listPeriod / monthlyListTotal : 0;

  const costMonthly = packageCostZar(pkg);
  const profitMonthly = payMonthly - costMonthly;
  const effectiveMargin = payMonthly > 0 ? profitMonthly / payMonthly : 0;

  return {
    billing,
    listPeriod,
    payPeriod,
    periodCredits,
    payMonthly,
    monthlyListTotal,
    unitPer1M: unitPricePer1MOf(payPeriod, periodCredits),
    unitPer1MList: unitPricePer1MOf(listPeriod, periodCredits),
    promoOff,
    annualOnlyOff,
    totalOffVsMonthly,
    costMonthly,
    profitMonthly,
    effectiveMargin,
  };
}

/** Annual saving vs paying month-to-month at list price. */
export function annualSaving(pkg: PackageRow) {
  const monthlyTotal = pkg.monthlyPrice * MONTHS_PER_YEAR;
  if (monthlyTotal <= 0) return 0;
  return 1 - pkg.yearlyPrice / monthlyTotal;
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

/** USD Huawei API cost for one call, including tier coefficient. */
export function usdForCall(
  model: ModelCost,
  inputTokens: number,
  outputTokens: number
) {
  const usd =
    (inputTokens / 1_000_000) * model.inputPrice +
    (outputTokens / 1_000_000) * model.outputPrice;
  return usd * model.tierCoeff;
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
  return usdForCall(model, inputTokens, outputTokens) * creditsPerUsd;
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

/** Keeps sub-R10 unit prices readable (e.g. R7.40 / 1M). */
export function formatZarPrecise(n: number) {
  if (Math.abs(n) >= 100) return formatZar(n);
  if (Math.abs(n) >= 10) return `R${n.toFixed(1)}`;
  return `R${n.toFixed(2)}`;
}

export function formatPct(x: number, digits = 0) {
  return `${(x * 100).toFixed(digits)}%`;
}

export function tiersLabel(tiers: Array<1 | 2 | 3>) {
  if (tiers.length === 3) return "All Tiers";
  if (tiers.includes(1) && tiers.includes(2)) return "Tier 1 + 2";
  if (tiers.length === 1 && tiers[0] === 1) return "Tier 1";
  return tiers.map((t) => `Tier ${t}`).join(" + ");
}
