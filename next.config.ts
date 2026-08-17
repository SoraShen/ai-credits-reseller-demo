import type { NextConfig } from "next";

const brand = (process.env.NEXT_PUBLIC_BRAND || "vodacom").toLowerCase();
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath ? { basePath } : {}),
  env: {
    NEXT_PUBLIC_BRAND: brand,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
