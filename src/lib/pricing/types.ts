export type TemplateId = "A" | "B" | "custom";
export type Audience = "personal" | "business";
export type Billing = "monthly" | "yearly";

export interface PricingParams {
  usdZar: number;
  creditsPerUsd: number;
  markupRate: number; // r, e.g. 0.4
  minDiscount: number; // d_min, e.g. 0.72
  /** Early-bird / limited promo discount applied on storefront (1 = none) */
  promoDiscount: number;
  /**
   * Whether the promo stacks on annual plans. Annual list prices already carry
   * the annual saving, so stacking usually breaks the margin floor.
   */
  promoStacksOnAnnual: boolean;
  promoEndsAt: string; // ISO
  promoLabelEn: string;
  promoLabelZh: string;
}

export interface ModelCost {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  tierCoeff: number;
  /** Default / primary USD per 1M input tokens (usually <32K band) */
  inputPrice: number;
  /** Default / primary USD per 1M output tokens */
  outputPrice: number;
  /** Optional ≥32K band (USD / MTok) */
  inputPriceLong?: number;
  outputPriceLong?: number;
  cacheHitPrice?: number;
  note?: string;
}

export interface PackageRow {
  id: string;
  name: string;
  audience: Audience;
  monthlyPrice: number;
  yearlyPrice: number;
  /** Monthly Credit quota; a yearly plan releases this 12 times. */
  credits: number;
  tiers: Array<1 | 2 | 3>;
  designMargin: number; // 0.32 = 32%
  popular?: boolean;
  cta: string;
  features: string[];
  models: string[];
}

export interface PricingState {
  templateId: TemplateId;
  params: PricingParams;
  models: ModelCost[];
  packages: PackageRow[];
}

export interface StorefrontPlan {
  id: string;
  name: string;
  price: number;
  priceOriginal: number;
  priceYearly: number;
  priceYearlyOriginal: number;
  currency: string;
  period: string;
  credits: number;
  periodCredits: number;
  creditsLabel: string;
  creditsSubLabel?: string;
  discountLabel?: string;
  savingsLabel?: string;
  monthlyEquivalentLabel?: string;
  bonusLabel?: string;
  cta: string;
  popular?: boolean;
  /** Partner-only: design margin at list price. */
  marginLabel: string;
  /** Partner-only: realised margin at the price actually charged. */
  effectiveMarginLabel: string;
  effectiveMargin: number;
  unitPriceLabel: string;
  tiersLabel: string;
  features: string[];
  models: string[];
}
