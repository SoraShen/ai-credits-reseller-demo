/**
 * Front-end brand skin only — pricing math is brand-agnostic.
 * Selected at build/runtime via NEXT_PUBLIC_BRAND=vodacom|mtn|rain|mt|cellc
 */
export type BrandId = "vodacom" | "mtn" | "rain" | "mt" | "cellc";

export interface Brand {
  id: BrandId;
  name: string;
  shortName: string;
  productName: string;
  /** Path under public/, without basePath — for next/image */
  logo: string;
  /** Absolute path including basePath — for <img> / metadata */
  logoHref: string;
  logoOnDarkHref: string;
  logoAlt: string;
  favicon: string;
  /** Demo disclaimer under the hero */
  disclaimer: string;
  promoPrefix: string;
  partnerLabel: string;
  customerLabel: string;
  /** CSS data-brand value */
  dataBrand: BrandId;
  currency: string;
  locale: string;
  moneyName: string;
  studioWord: string;
}

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

function withBase(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${p}`;
}

const VODACOM: Brand = {
  id: "vodacom",
  name: "Vodacom",
  shortName: "Vodacom",
  productName: "Vodacom AI",
  logo: "/images/vodacom-logo.svg",
  logoHref: withBase("/images/vodacom-logo.svg"),
  logoOnDarkHref: withBase("/images/vodacom-logo.svg"),
  logoAlt: "Vodacom AI",
  favicon: withBase("/images/vodacom-logo.svg"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for Vodacom customer reference only (not an official Vodacom product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "vodacom",
  currency: "R",
  locale: "en-ZA",
  moneyName: "Rand",
  studioWord: "vodacom",
};

const MTN: Brand = {
  id: "mtn",
  name: "MTN",
  shortName: "MTN",
  productName: "MTN AI",
  logo: "/images/mtn-logo.svg",
  logoHref: withBase("/images/mtn-logo.svg"),
  logoOnDarkHref: withBase("/images/mtn-logo.svg"),
  logoAlt: "MTN AI",
  favicon: withBase("/images/mtn-logo.svg"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for MTN South Africa customer reference only (not an official MTN product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "mtn",
  currency: "R",
  locale: "en-ZA",
  moneyName: "Rand",
  studioWord: "mtn",
};

const RAIN: Brand = {
  id: "rain",
  name: "rain",
  shortName: "rain",
  productName: "rain AI",
  logo: "/images/rain-logo.svg",
  logoHref: withBase("/images/rain-logo.svg"),
  logoOnDarkHref: withBase("/images/rain-logo.svg"),
  logoAlt: "rain AI",
  favicon: withBase("/images/rain-logo.svg"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for rain customer reference only (not an official rain product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "rain",
  currency: "R",
  locale: "en-ZA",
  moneyName: "Rand",
  studioWord: "rain",
};

const MT: Brand = {
  id: "mt",
  name: "Mauritius Telecom",
  shortName: "MT",
  productName: "Mauritius Telecom AI",
  logo: "/images/mt-logo.svg",
  logoHref: withBase("/images/mt-logo.svg"),
  logoOnDarkHref: withBase("/images/mt-logo-white.svg"),
  logoAlt: "Mauritius Telecom",
  favicon: withBase("/images/mt-favicon.png"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for Mauritius Telecom customer reference only (not an official Mauritius Telecom product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "mt",
  currency: "Rs ",
  locale: "en-MU",
  moneyName: "rupee",
  studioWord: "Mauritius Telecom",
};

const CELLC: Brand = {
  id: "cellc",
  name: "Cell C",
  shortName: "Cell C",
  productName: "Cell C AI",
  logo: "/images/cellc-logo-black.png",
  logoHref: withBase("/images/cellc-logo-black.png"),
  logoOnDarkHref: withBase("/images/cellc-logo-orange.png"),
  logoAlt: "Cell C AI",
  favicon: withBase("/images/cellc-logo-orange.png"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for Cell C customer reference only (not an official Cell C product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "cellc",
  currency: "R",
  locale: "en-ZA",
  moneyName: "Rand",
  studioWord: "Cell C",
};

export function resolveBrand(raw?: string | null): Brand {
  const id = (raw || process.env.NEXT_PUBLIC_BRAND || "vodacom").toLowerCase();
  if (id === "mtn") return MTN;
  if (id === "rain") return RAIN;
  if (id === "mt") return MT;
  if (id === "cellc") return CELLC;
  return VODACOM;
}

export function formatStorefrontMoney(n: number) {
  return `${brand.currency}${Math.round(n).toLocaleString(brand.locale)}`;
}

export const brand = resolveBrand();
