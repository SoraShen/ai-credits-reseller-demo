import type { Audience, Billing, PricingState, StorefrontPlan } from "./types";
import { DEFAULT_STATE, HUAWEI_MAAS_MODELS, templateState } from "./templates";
import {
  formatCredits,
  formatPct,
  formatZar,
  formatZarPrecise,
  planPricing,
  tiersLabel,
} from "./formulas";

export const STORAGE_KEY = "vodacom-ai-pricing-state-v4";

function withFreshModels(state: PricingState): PricingState {
  const needsModelRefresh =
    !state.models?.length ||
    state.models.length !== HUAWEI_MAAS_MODELS.length ||
    state.models.some((m) => {
      const src = HUAWEI_MAAS_MODELS.find((x) => x.id === m.id);
      return (
        !src ||
        m.inputPrice !== src.inputPrice ||
        m.outputPrice !== src.outputPrice
      );
    });
  if (!needsModelRefresh) return state;
  return { ...state, models: HUAWEI_MAAS_MODELS.map((m) => ({ ...m })) };
}

export function loadPricingState(): PricingState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as PricingState;
    if (!parsed?.params || !parsed?.packages?.length) return DEFAULT_STATE;
    return withFreshModels({
      ...parsed,
      params: { ...DEFAULT_STATE.params, ...parsed.params },
    });
  } catch {
    return DEFAULT_STATE;
  }
}

export function savePricingState(state: PricingState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("vodacom-pricing-updated"));
}

export function applyTemplate(id: "A" | "B") {
  const state = templateState(id);
  savePricingState(state);
  return state;
}

export function toStorefrontPlans(
  state: PricingState,
  audience: Audience,
  billing: Billing
): StorefrontPlan[] {
  const promo = state.params.promoDiscount;
  const promoActive = new Date(state.params.promoEndsAt).getTime() > Date.now();
  const d = promoActive ? promo : 1;

  return state.packages
    .filter((p) => p.audience === audience)
    .map((p) => {
      const opts = {
        promoStacksOnAnnual: state.params.promoStacksOnAnnual === true,
      };
      const pricing = planPricing(p, billing, d, opts);
      const yearlyPricing = planPricing(p, "yearly", d, opts);
      const yearly = billing === "yearly";

      return {
        id: p.id,
        name: p.name,
        price: pricing.payPeriod,
        priceOriginal: pricing.listPeriod,
        priceYearly: yearlyPricing.payPeriod,
        priceYearlyOriginal: p.yearlyPrice,
        currency: "R",
        period:
          audience === "business"
            ? yearly
              ? "per seat / year"
              : "per seat / month"
            : yearly
              ? "per year"
              : "per month",
        credits: p.credits,
        periodCredits: pricing.periodCredits,
        creditsLabel: `${formatCredits(p.credits)} Credits / month`,
        creditsSubLabel: yearly
          ? `${formatCredits(pricing.periodCredits)} Credits over 12 months`
          : undefined,
        discountLabel:
          pricing.promoOff > 0.0001
            ? `${formatPct(pricing.promoOff)} Off`
            : undefined,
        savingsLabel:
          yearly && pricing.totalOffVsMonthly > 0.0001
            ? `Save ${formatPct(pricing.totalOffVsMonthly)} vs monthly`
            : undefined,
        monthlyEquivalentLabel: yearly
          ? `≈ ${formatZar(pricing.payMonthly)} / month`
          : undefined,
        bonusLabel: undefined,
        cta: p.cta,
        popular: p.popular,
        marginLabel: `${formatPct(p.designMargin)} design GM`,
        effectiveMarginLabel: `${formatPct(pricing.effectiveMargin, 1)} GM at this price`,
        effectiveMargin: pricing.effectiveMargin,
        unitPriceLabel: `${formatZarPrecise(pricing.unitPer1M)} / 1M Credits`,
        tiersLabel: tiersLabel(p.tiers),
        features: p.features,
        models: p.models,
      };
    });
}
