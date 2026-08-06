"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Audience, Billing } from "@/lib/pricing/types";
import { annualSaving, formatPct } from "@/lib/pricing/formulas";
import { toStorefrontPlans } from "@/lib/pricing/storage";
import { usePricingState } from "@/hooks/usePricingState";
import { usePartnerView } from "@/hooks/usePartnerView";
import { cn } from "@/lib/utils";
import { CountdownBanner } from "./CountdownBanner";
import { PackageCard } from "./PackageCard";

export function PackagesPage({
  initialAudience = "personal",
}: {
  initialAudience?: Audience;
}) {
  const { state, ready } = usePricingState();
  const { unlocked, partnerView, setPartnerView, registerSecretClick } =
    usePartnerView();
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [openNav, setOpenNav] = useState(false);

  const plans = useMemo(
    () => (ready ? toStorefrontPlans(state, audience, billing) : []),
    [state, audience, billing, ready]
  );

  const annualSavingLabel = useMemo(() => {
    const rows = state.packages.filter((p) => p.audience === audience);
    const savings = rows.map(annualSaving).filter((s) => s > 0);
    if (!savings.length) return null;
    const lo = Math.min(...savings);
    const hi = Math.max(...savings);
    return Math.round(lo * 100) === Math.round(hi * 100)
      ? `Save ${formatPct(hi)}`
      : `Save ${formatPct(lo)}–${formatPct(hi)}`;
  }, [state.packages, audience]);

  const templateLabel =
    state.templateId === "A"
      ? "Template A · Profit"
      : state.templateId === "B"
        ? "Template B · Growth"
        : "Custom";

  return (
    <div className="page-wash min-h-screen">
      <CountdownBanner params={state.params} />

      {unlocked && partnerView ? (
        <div className="bg-[#1a1a1a] px-4 py-2 text-center text-[11px] font-semibold text-white">
          Partner preview — Gross Margin & internal cost metrics visible. End
          customers do not see this.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => setPartnerView(false)}
          >
            Switch to customer view
          </button>
        </div>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/vodacom-logo.svg"
              alt="Vodacom AI"
              width={160}
              height={36}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#plans" className="text-sm font-medium text-[#e60000]">
              Packages
            </a>
            <Link
              href="/pricing-studio"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Pricing Studio
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {unlocked ? (
              <button
                type="button"
                onClick={() => setPartnerView(!partnerView)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-bold",
                  partnerView
                    ? "bg-[#1a1a1a] text-white"
                    : "border border-border text-muted-foreground"
                )}
              >
                {partnerView ? "Partner view" : "Customer view"}
              </button>
            ) : null}
            {partnerView ? (
              <span className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
                {templateLabel}
              </span>
            ) : null}
            <button
              type="button"
              className="rounded-full border border-[#e60000] px-4 py-2 text-sm font-bold text-[#e60000]"
            >
              Login
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
            onClick={() => setOpenNav((v) => !v)}
            aria-label="Menu"
          >
            {openNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {openNav ? (
          <div className="space-y-3 border-t border-border bg-white px-4 py-4 md:hidden">
            <a href="#plans" className="block text-sm font-medium">
              Packages
            </a>
            <Link href="/pricing-studio" className="block text-sm font-medium">
              Pricing Studio
            </Link>
            {unlocked ? (
              <button
                type="button"
                className="block text-sm font-medium"
                onClick={() => setPartnerView(!partnerView)}
              >
                {partnerView ? "Partner view ✓" : "Customer view"}
              </button>
            ) : null}
          </div>
        ) : null}
      </header>

      <main id="plans" className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#ffe5e5] px-3 py-1 text-xs font-bold text-[#e60000]">
            Vodacom AI Credits
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Choose Your Package
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Simple Rand pricing for AI Credits. Configure wholesale logic in{" "}
            <Link href="/pricing-studio" className="font-semibold text-[#e60000]">
              Pricing Studio
            </Link>
            .
          </p>
          <p
            className="mx-auto mt-3 max-w-2xl cursor-default text-[11px] leading-relaxed text-muted-foreground/90"
            onClick={registerSecretClick}
            title="Demo disclaimer"
          >
            Huawei Cloud demo environment — designs above are for Vodacom
            customer reference only (not an official Vodacom product).
          </p>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-md rounded-full bg-white p-1 shadow-card">
          {(
            [
              ["personal", "Individual"],
              ["business", "Team / Business"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setAudience(key)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-colors",
                audience === key
                  ? "bg-[#e60000] text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-semibold",
              billing === "monthly" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <button
            type="button"
            aria-label="Toggle billing"
            onClick={() =>
              setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))
            }
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              billing === "yearly" ? "bg-[#e60000]" : "bg-[#cfcfcf]"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                billing === "yearly" ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-semibold",
              billing === "yearly" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
          </span>
          {annualSavingLabel ? (
            <span className="rounded-full bg-[#e8f8ef] px-2 py-0.5 text-[11px] font-bold text-[#0b7a3e]">
              {annualSavingLabel}
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "mt-10 grid gap-5",
            plans.length >= 4
              ? "md:grid-cols-2 xl:grid-cols-4"
              : "md:grid-cols-3"
          )}
        >
          {plans.map((plan) => (
            <PackageCard
              key={plan.id}
              plan={plan}
              partnerView={partnerView}
            />
          ))}
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-border bg-white px-5 py-5 shadow-card sm:px-8">
          <p className="text-base font-bold">Credits last up to 3 months</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Oldest Credits are consumed first. Active subscription required.
            Night-time Bonus and referral Bonus can be configured in Pricing
            Studio (demo).
          </p>
          {billing === "yearly" ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Yearly plans are billed once and release the same monthly Credit
              quota each month for 12 months.
            </p>
          ) : null}
        </div>

        {partnerView ? (
          <div className="mt-6 rounded-[1.5rem] border border-[#1a1a1a]/15 bg-[#f6f7f9] px-5 py-4 text-sm text-muted-foreground">
            <p className="font-bold text-foreground">
              Reading the partner numbers
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Design GM</strong> is the planned profit share after
                estimated Huawei MaaS cost at monthly list price — 35% GM means
                ~R0.65 of every Rand of revenue is reserved for model cost and
                ops.
              </li>
              <li>
                <strong>GM at this price</strong> is the same margin recomputed
                on what the customer actually pays this period, so promo and
                annual discounts show up here. Red means it fell under 15%.
              </li>
              <li>
                Annual plans divide the once-off price by 12 before comparing to
                monthly cost. Both figures are Vodacom planning metrics, never
                consumer-facing claims.
              </li>
            </ul>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Image
              src="/images/vodacom-logo.svg"
              alt="Vodacom AI"
              width={140}
              height={32}
              style={{ width: "auto", height: "auto" }}
            />
            <p
              className="mt-2 max-w-md cursor-default text-xs text-muted-foreground"
              onClick={registerSecretClick}
            >
              Huawei Cloud demo environment. Designs are for Vodacom customer
              reference only — not an official Vodacom product. No payment or
              backend connected.
            </p>
          </div>
          <Link
            href="/pricing-studio"
            className="btn-vodacom inline-flex rounded-full px-5 py-2.5 text-sm font-bold"
          >
            Open Pricing Studio
          </Link>
        </div>
      </footer>
    </div>
  );
}
