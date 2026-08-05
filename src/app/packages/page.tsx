import { PackagesPage } from "@/components/packages/PackagesPage";
import type { Audience } from "@/lib/pricing/types";

export default async function PackagesRoute({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const audience: Audience =
    params.type === "business" ? "business" : "personal";
  return <PackagesPage initialAudience={audience} />;
}
