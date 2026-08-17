/**
 * Front-end brand skin only — pricing math is brand-agnostic.
 * Selected at build/runtime via NEXT_PUBLIC_BRAND=vodacom|mtn
 */
export type BrandId = "vodacom" | "mtn";

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

export function resolveBrand(raw?: string | null): Brand {
  const id = (raw || process.env.NEXT_PUBLIC_BRAND || "vodacom").toLowerCase();
  return id === "mtn" ? MTN : VODACOM;
}

export const brand = resolveBrand();
