import type { ModelCost, PackageRow, PricingParams, PricingState } from "./types";

/** Huawei Cloud International MaaS — USD / 1M tokens (doc 2026-07-28). */
export const HUAWEI_MAAS_MODELS: ModelCost[] = [
  {
    id: "ds-v4-flash",
    name: "DeepSeek-V4-Flash",
    tier: 1,
    tierCoeff: 1.0,
    inputPrice: 0.135,
    outputPrice: 0.27,
    note: "Matches Huawei intl doc",
  },
  {
    id: "glm-5",
    name: "GLM-5",
    tier: 1,
    tierCoeff: 1.0,
    inputPrice: 0.539,
    outputPrice: 2.426,
    inputPriceLong: 0.809,
    outputPriceLong: 2.965,
    cacheHitPrice: 0.135,
    note: "<32K band; ≥32K: 0.809 / 2.965; cache hit 0.135",
  },
  {
    id: "ds-v3",
    name: "DeepSeek-V3",
    tier: 2,
    tierCoeff: 1.2,
    inputPrice: 0.27,
    outputPrice: 1.078,
    note: "Matches Huawei intl doc",
  },
  {
    id: "ds-v32",
    name: "DeepSeek-V3.2",
    tier: 2,
    tierCoeff: 1.2,
    inputPrice: 0.27,
    outputPrice: 0.404,
    note: "Matches Huawei intl doc",
  },
  {
    id: "ds-r1",
    name: "DeepSeek-R1-0528",
    tier: 2,
    tierCoeff: 1.2,
    inputPrice: 0.539,
    outputPrice: 2.156,
    note: "Matches Huawei intl doc",
  },
  {
    id: "glm-51",
    name: "GLM-5.1",
    tier: 2,
    tierCoeff: 1.2,
    inputPrice: 0.809,
    outputPrice: 3.235,
    inputPriceLong: 1.078,
    outputPriceLong: 3.774,
    cacheHitPrice: 0.175,
    note: "<32K band; ≥32K: 1.078 / 3.774; cache hit 0.175 / 0.27",
  },
  {
    id: "ds-v4-pro",
    name: "DeepSeek-V4-Pro",
    tier: 3,
    tierCoeff: 1.3,
    inputPrice: 1.617,
    outputPrice: 3.235,
    note: "Matches Huawei intl doc",
  },
  {
    id: "glm-52",
    name: "GLM-5.2",
    tier: 3,
    tierCoeff: 1.3,
    inputPrice: 1.4,
    outputPrice: 4.4,
    cacheHitPrice: 0.26,
    note: "Cache hit input 0.26",
  },
];

const MODELS = HUAWEI_MAAS_MODELS;

const SHARED_FEATURES_T1 = [
  "Text & chat generation",
  "Smart model routing",
  "Web search tools",
  "Prompt assist",
  "Usage dashboard",
];

const SHARED_FEATURES_FULL = [
  ...SHARED_FEATURES_T1,
  "Image generation",
  "Video generation",
  "Deep research",
  "Agent creation",
  "Priority support",
];

function personalFeatures(tiers: Array<1 | 2 | 3>) {
  return tiers.length === 3 ? SHARED_FEATURES_FULL : SHARED_FEATURES_T1;
}

function modelsForTiers(tiers: Array<1 | 2 | 3>) {
  return MODELS.filter((m) => tiers.includes(m.tier)).map((m) => m.name);
}

const PROMO_END = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
})();

export const PARAMS_A: PricingParams = {
  usdZar: 19,
  creditsPerUsd: 500_000,
  markupRate: 0.4,
  minDiscount: 0.72,
  promoDiscount: 0.85,
  promoEndsAt: PROMO_END,
  promoLabelEn: "Limited-time Early Bird: 15% Off all plans",
  promoLabelZh: "限时早鸟价：全场套餐 85 折",
};

export const PARAMS_B: PricingParams = {
  ...PARAMS_A,
  markupRate: 0.3,
  minDiscount: 0.7,
  promoDiscount: 0.85,
  promoLabelEn: "Launch Offer: 15% Off + aggressive entry pricing",
  promoLabelZh: "上线特惠：85 折 + 激进入门价",
};

export function buildPackagesA(): PackageRow[] {
  return [
    {
      id: "lite",
      name: "Lite",
      audience: "personal",
      monthlyPrice: 99,
      yearlyPrice: 899,
      yearlyDiscountLabel: "24% Off",
      credits: 3_000_000,
      tiers: [1],
      designMargin: 0.32,
      cta: "Get Started",
      features: personalFeatures([1]),
      models: modelsForTiers([1]),
    },
    {
      id: "standard",
      name: "Standard",
      audience: "personal",
      monthlyPrice: 299,
      yearlyPrice: 2699,
      yearlyDiscountLabel: "25% Off",
      credits: 10_000_000,
      tiers: [1, 2],
      designMargin: 0.35,
      popular: true,
      cta: "Get Started",
      features: personalFeatures([1, 2]),
      models: modelsForTiers([1, 2]),
    },
    {
      id: "pro",
      name: "Pro",
      audience: "personal",
      monthlyPrice: 499,
      yearlyPrice: 4499,
      yearlyDiscountLabel: "25% Off",
      credits: 18_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.38,
      cta: "Get Started",
      features: personalFeatures([1, 2, 3]),
      models: modelsForTiers([1, 2, 3]),
    },
    {
      id: "ultra",
      name: "Ultra",
      audience: "personal",
      monthlyPrice: 899,
      yearlyPrice: 7999,
      yearlyDiscountLabel: "26% Off",
      credits: 35_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.4,
      cta: "Get Started",
      features: personalFeatures([1, 2, 3]),
      models: modelsForTiers([1, 2, 3]),
    },
    {
      id: "seat-standard",
      name: "Standard Seat",
      audience: "business",
      monthlyPrice: 249,
      yearlyPrice: 2199,
      yearlyDiscountLabel: "26% Off",
      credits: 5_000_000,
      tiers: [1, 2],
      designMargin: 0.34,
      cta: "Get a Quote",
      features: [
        "Multi-seat admin",
        "Tier 1 + 2 models",
        "Shared team workspace",
        "Usage controls",
        "Invoice billing",
      ],
      models: modelsForTiers([1, 2]),
    },
    {
      id: "seat-pro",
      name: "Pro Seat",
      audience: "business",
      monthlyPrice: 699,
      yearlyPrice: 6199,
      yearlyDiscountLabel: "26% Off",
      credits: 20_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.36,
      popular: true,
      cta: "Get a Quote",
      features: [
        "Full tier access",
        "High-frequency workflows",
        "Agent creation",
        "Deep research",
        "Priority support",
      ],
      models: modelsForTiers([1, 2, 3]),
    },
    {
      id: "seat-max",
      name: "Max Seat",
      audience: "business",
      monthlyPrice: 1399,
      yearlyPrice: 12399,
      yearlyDiscountLabel: "26% Off",
      credits: 50_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.38,
      cta: "Get a Quote",
      features: [
        "Heavy AI core teams",
        "Highest credit quota",
        "Enterprise controls",
        "Dedicated success manager",
        "Custom SLA (demo)",
      ],
      models: modelsForTiers([1, 2, 3]),
    },
  ];
}

export function buildPackagesB(): PackageRow[] {
  return [
    {
      id: "lite",
      name: "Lite",
      audience: "personal",
      monthlyPrice: 69,
      yearlyPrice: 599,
      yearlyDiscountLabel: "28% Off",
      credits: 3_000_000,
      tiers: [1],
      designMargin: 0.22,
      cta: "Get Started",
      features: personalFeatures([1]),
      models: modelsForTiers([1]),
    },
    {
      id: "standard",
      name: "Standard",
      audience: "personal",
      monthlyPrice: 199,
      yearlyPrice: 1699,
      yearlyDiscountLabel: "29% Off",
      credits: 10_000_000,
      tiers: [1, 2],
      designMargin: 0.28,
      popular: true,
      cta: "Get Started",
      features: personalFeatures([1, 2]),
      models: modelsForTiers([1, 2]),
    },
    {
      id: "pro",
      name: "Pro",
      audience: "personal",
      monthlyPrice: 399,
      yearlyPrice: 3399,
      yearlyDiscountLabel: "29% Off",
      credits: 18_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.3,
      cta: "Get Started",
      features: personalFeatures([1, 2, 3]),
      models: modelsForTiers([1, 2, 3]),
    },
    {
      id: "ultra",
      name: "Ultra",
      audience: "personal",
      monthlyPrice: 699,
      yearlyPrice: 5899,
      yearlyDiscountLabel: "30% Off",
      credits: 35_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.35,
      cta: "Get Started",
      features: personalFeatures([1, 2, 3]),
      models: modelsForTiers([1, 2, 3]),
    },
    {
      id: "seat-standard",
      name: "Standard Seat",
      audience: "business",
      monthlyPrice: 199,
      yearlyPrice: 1699,
      yearlyDiscountLabel: "29% Off",
      credits: 5_000_000,
      tiers: [1, 2],
      designMargin: 0.25,
      cta: "Get a Quote",
      features: [
        "Multi-seat admin",
        "Tier 1 + 2 models",
        "Shared team workspace",
        "Usage controls",
        "Invoice billing",
      ],
      models: modelsForTiers([1, 2]),
    },
    {
      id: "seat-pro",
      name: "Pro Seat",
      audience: "business",
      monthlyPrice: 549,
      yearlyPrice: 4599,
      yearlyDiscountLabel: "30% Off",
      credits: 20_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.3,
      popular: true,
      cta: "Get a Quote",
      features: [
        "Full tier access",
        "High-frequency workflows",
        "Agent creation",
        "Deep research",
        "Priority support",
      ],
      models: modelsForTiers([1, 2, 3]),
    },
    {
      id: "seat-max",
      name: "Max Seat",
      audience: "business",
      monthlyPrice: 1099,
      yearlyPrice: 9199,
      yearlyDiscountLabel: "30% Off",
      credits: 50_000_000,
      tiers: [1, 2, 3],
      designMargin: 0.33,
      cta: "Get a Quote",
      features: [
        "Heavy AI core teams",
        "Highest credit quota",
        "Enterprise controls",
        "Dedicated success manager",
        "Custom SLA (demo)",
      ],
      models: modelsForTiers([1, 2, 3]),
    },
  ];
}

export function templateState(id: "A" | "B"): PricingState {
  return {
    templateId: id,
    params: id === "A" ? { ...PARAMS_A } : { ...PARAMS_B },
    models: MODELS.map((m) => ({ ...m })),
    packages: id === "A" ? buildPackagesA() : buildPackagesB(),
  };
}

export const DEFAULT_STATE = templateState("A");
