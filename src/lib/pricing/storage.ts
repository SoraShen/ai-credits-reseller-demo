import type { Audience, Billing, PricingState, StorefrontPlan } from "./types";
import { DEFAULT_STATE, HUAWEI_MAAS_MODELS, templateState } from "./templates";
import {
  formatCredits,
  formatZar,
  tiersLabel,
  unitPricePer1M,
} from "./formulas";

export const STORAGE_KEY = "vodacom-ai-pricing-state-v3";

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
    return withFreshModels(parsed);
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
      const monthlyPromo = Math.round(p.monthlyPrice * d);
      const yearlyPromo = Math.round(p.yearlyPrice * d);
      const unit = unitPricePer1M(p);
      return {
        id: p.id,
        name: p.name,
        price: billing === "yearly" ? yearlyPromo : monthlyPromo,
        priceOriginal: billing === "yearly" ? p.yearlyPrice : p.monthlyPrice,
        priceYearly: yearlyPromo,
        priceYearlyOriginal: p.yearlyPrice,
        currency: "R",
        period:
          audience === "business"
            ? billing === "yearly"
              ? "per seat / year"
              : "per seat / month"
            : billing === "yearly"
              ? "per year"
              : "per month",
        credits: p.credits,
        creditsLabel: `${formatCredits(p.credits)} Credits / ${
          billing === "yearly" ? "Month*" : "Month"
        }`,
        discountLabel:
          d < 1 ? `${Math.round((1 - d) * 100)}% Off` : undefined,
        bonusLabel: undefined,
        cta: p.cta,
        popular: p.popular,
        marginLabel: `${Math.round(p.designMargin * 100)}% Gross Margin`,
        unitPriceLabel: `${formatZar(unit)} / 1M Credits`,
        tiersLabel: tiersLabel(p.tiers),
        features: p.features,
        models: p.models,
      };
    });
}
