/**
 * Front-end brand skin only — pricing math is brand-agnostic.
 * Selected at build/runtime via NEXT_PUBLIC_BRAND=vodacom|mtn|rain
 */
export type BrandId = "vodacom" | "mtn" | "rain";

export interface Brand {
  id: BrandId;
  name: string;
  shortName: string;
  productName: string;
  /** Path under public/, without basePath — for next/image */
  logo: string;
  /** Absolute path including basePath — for <img> / metadata */
  logoHref: string;
  logoAlt: string;
  favicon: string;
  /** Demo disclaimer under the hero */
  disclaimer: string;
  promoPrefix: string;
  partnerLabel: string;
  customerLabel: string;
  /** CSS data-brand value */
  dataBrand: BrandId;
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
  logoAlt: "Vodacom AI",
  favicon: withBase("/images/vodacom-logo.svg"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for Vodacom customer reference only (not an official Vodacom product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "vodacom",
};

const MTN: Brand = {
  id: "mtn",
  name: "MTN",
  shortName: "MTN",
  productName: "MTN AI",
  logo: "/images/mtn-logo.svg",
  logoHref: withBase("/images/mtn-logo.svg"),
  logoAlt: "MTN AI",
  favicon: withBase("/images/mtn-logo.svg"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for MTN South Africa customer reference only (not an official MTN product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "mtn",
};

const RAIN: Brand = {
  id: "rain",
  name: "rain",
  shortName: "rain",
  productName: "rain AI",
  logo: "/images/rain-logo.svg",
  logoHref: withBase("/images/rain-logo.svg"),
  logoAlt: "rain AI",
  favicon: withBase("/images/rain-logo.svg"),
  disclaimer:
    "Huawei Cloud demo environment — designs above are for rain customer reference only (not an official rain product).",
  promoPrefix: "Limited-time Early Bird",
  partnerLabel: "Partner view",
  customerLabel: "Customer view",
  dataBrand: "rain",
};

export function resolveBrand(raw?: string | null): Brand {
  const id = (raw || process.env.NEXT_PUBLIC_BRAND || "vodacom").toLowerCase();
  if (id === "mtn") return MTN;
  if (id === "rain") return RAIN;
  return VODACOM;
}

export const brand = resolveBrand();
