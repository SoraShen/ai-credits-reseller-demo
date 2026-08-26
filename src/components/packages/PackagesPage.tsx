"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { brand } from "@/lib/brand";
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
  const isMt = brand.id === "mt";
  const isRain = brand.id === "rain";
  const isMtn = brand.id === "mtn";
  const isCellc = brand.id === "cellc";
  const headerLogo = isMt || isCellc ? brand.logoOnDarkHref : brand.logoHref;

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

      <header
        className={cn(
          "sticky top-0 z-50",
          isMt
            ? "bg-[#140078] text-white"
            : isCellc
              ? "bg-[#0f0f0f] text-white"
              : "border-b border-border/80 bg-white/90 backdrop-blur-xl"
        )}
      >
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center justify-self-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={headerLogo}
              alt={brand.logoAlt}
              width={isMtn ? 64 : isRain ? 104 : isMt ? 176 : isCellc ? 120 : 160}
              height={isMtn || isRain ? 32 : isMt || isCellc ? 40 : 36}
              className={
                isMtn || isRain
                  ? "h-8 w-auto"
                  : isMt || isCellc
                    ? "h-10 w-auto"
                    : "h-9 w-auto"
              }
            />
            {isMtn ? (
              <span className="text-[1.35rem] font-extrabold leading-none tracking-tight text-black">
                AI
              </span>
            ) : null}
            {isRain ? (
              <span className="text-[1.15rem] font-semibold leading-none tracking-tight text-[#202020]">
                AI
              </span>
            ) : null}
            {isCellc ? (
              <span className="text-[1.1rem] font-extrabold leading-none tracking-tight text-[#ea5b0c]">
                AI
              </span>
            ) : null}
          </Link>

          <nav className="hidden items-center gap-6 justify-self-center md:flex">
            <a
              href="#plans"
              className={cn(
                "text-sm font-medium",
                isMt || isCellc
                  ? "text-white"
                  : isRain
                    ? "lowercase text-[#202020]"
                    : "text-brand-ink"
              )}
            >
              {isRain ? "packages" : "Packages"}
            </a>
            <Link
              href="/image-studio"
              className={cn(
                "text-sm font-medium",
                isMt || isCellc
                  ? "text-white/75 hover:text-white"
                  : isRain
                    ? "lowercase text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRain ? "image studio" : "Image Studio"}
            </Link>
            <Link
              href="/pricing-studio"
              className={cn(
                "text-sm font-medium",
                isMt || isCellc
                  ? "text-white/75 hover:text-white"
                  : isRain
                    ? "lowercase text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRain ? "pricing studio" : "Pricing Studio"}
            </Link>
          </nav>

          <div className="flex items-center justify-self-end gap-3">
            <div className="hidden items-center gap-3 md:flex">
              {unlocked ? (
                <button
                  type="button"
                  onClick={() => setPartnerView(!partnerView)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-bold",
                    partnerView
                      ? "bg-[#1a1a1a] text-white"
                      : isCellc
                        ? "border border-white/30 text-white/80"
                        : "border border-border text-muted-foreground"
                  )}
                >
                  {partnerView ? "Partner view" : "Customer view"}
                </button>
              ) : null}
              {partnerView ? (
                <span
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-semibold",
                    isCellc
                      ? "border-white/25 text-white/70"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {templateLabel}
                </span>
              ) : null}
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold",
                  brand.id === "mtn"
                    ? "border-2 border-black text-black"
                    : brand.id === "rain"
                      ? "border border-[#0077C8] text-[#0077C8] lowercase"
                      : isMt
                        ? "bg-[#00B4C8] text-[#07003a]"
                        : isCellc
                          ? "bg-[#ea5b0c] text-white"
                          : "border border-primary text-brand-ink"
                )}
              >
                {brand.id === "rain" ? "sign in" : "Login"}
              </button>
            </div>

            <button
              type="button"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden",
                isMt || isCellc ? "border border-white/25" : "border border-border"
              )}
              onClick={() => setOpenNav((v) => !v)}
              aria-label="Menu"
            >
              {openNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {openNav ? (
          <div
            className={cn(
              "space-y-3 border-t px-4 py-4 md:hidden",
              isMt
                ? "border-white/10 bg-[#0d0060]"
                : isCellc
                  ? "border-white/10 bg-[#141414]"
                  : "border-border bg-white"
            )}
          >
            <a href="#plans" className="block text-sm font-medium">
              Packages
            </a>
            <Link href="/image-studio" className="block text-sm font-medium">
              Image Studio
            </Link>
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
          {isRain ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7eb8e0]">
              south africa&apos;s unlimited network
            </p>
          ) : isCellc ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ea5b0c]">
              your ally for AI
            </p>
          ) : (
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                isMtn
                  ? "bg-[#ffcb05] text-black"
                  : isMt
                    ? "bg-[#00B4C8] text-[#07003a]"
                    : "bg-brand-muted text-brand-ink"
              )}
            >
              {brand.productName} Credits
            </span>
          )}
          <h1
            className={cn(
              "mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl",
              isRain &&
                "font-semibold lowercase tracking-tight text-[#202020]",
              isMt && "font-semibold text-[#07003a]",
              isCellc && "font-extrabold text-[#0f0f0f]"
            )}
          >
            {isRain ? (
              <>
                choose your{" "}
                <span className="font-bold text-[#0077C8]">unlimited AI.</span>
              </>
            ) : isMt ? (
              <>
                Choose your package.
                <span className="block text-[#140078]">Build with AI.</span>
              </>
            ) : isCellc ? (
              <>
                Choose your package.
                <span className="block text-[#ea5b0c]">Powered by AI Credits.</span>
              </>
            ) : (
              "Choose Your Package"
            )}
          </h1>
          <p
            className={cn(
              "mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base",
              isRain && "lowercase text-[#5a6a7a]",
              isCellc && "text-[#6b6b6b]"
            )}
          >
            {isRain ? (
              <>
                every plan includes AI Credits priced in Rand on rain&apos;s
                network. configure wholesale logic in{" "}
                <Link
                  href="/pricing-studio"
                  className="font-semibold text-[#0077C8]"
                >
                  pricing studio
                </Link>
                .
              </>
            ) : isMt ? (
              <>
                Simple rupee pricing for AI Credits — the trusted digital
                foundation for an AI-powered Mauritius. Configure wholesale
                logic in{" "}
                <Link
                  href="/pricing-studio"
                  className="font-semibold text-[#140078]"
                >
                  Pricing Studio
                </Link>
                .
              </>
            ) : isCellc ? (
              <>
                Bold Rand pricing for AI Credits — value without the fluff.
                Configure wholesale logic in{" "}
                <Link
                  href="/pricing-studio"
                  className="font-semibold text-[#ea5b0c]"
                >
                  Pricing Studio
                </Link>
                .
              </>
            ) : (
              <>
                Simple Rand pricing for AI Credits. Configure wholesale logic in{" "}
                <Link
                  href="/pricing-studio"
                  className="font-semibold text-brand-ink"
                >
                  Pricing Studio
                </Link>
                .
              </>
            )}
          </p>
          <p
            className="mx-auto mt-3 max-w-2xl cursor-default text-[11px] leading-relaxed text-muted-foreground/90"
            onClick={registerSecretClick}
            title="Demo disclaimer"
          >
            {brand.disclaimer}
          </p>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-md rounded-full bg-white p-1 shadow-card">
          {(
            [
              [
                "personal",
                brand.id === "rain" ? "individual" : "Individual",
              ],
              [
                "business",
                brand.id === "rain" ? "team / business" : "Team / Business",
              ],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setAudience(key)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-colors",
                brand.id === "rain" && "lowercase font-semibold",
                audience === key
                  ? "bg-primary text-primary-foreground"
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
              billing === "yearly" ? "bg-primary" : "bg-[#cfcfcf]"
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
                ~R0.65 of every {brand.moneyName} of revenue is reserved for model cost and
                ops.
              </li>
              <li>
                <strong>GM at this price</strong> is the same margin recomputed
                on what the customer actually pays this period, so promo and
                annual discounts show up here. Red means it fell under 15%.
              </li>
              <li>
                Annual plans divide the once-off price by 12 before comparing to
                monthly cost. Both figures are {brand.name} planning metrics, never
                consumer-facing claims.
              </li>
            </ul>
          </div>
        ) : null}
      </main>

      <footer
        className={cn(
          isMt
            ? "bg-[#030507] text-white"
            : isCellc
              ? "bg-[#0f0f0f] text-white"
              : "border-t border-border bg-white"
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isMt || isCellc ? brand.logoOnDarkHref : brand.logoHref}
                alt={brand.logoAlt}
                width={
                  isMtn ? 56 : isRain ? 90 : isMt ? 160 : isCellc ? 110 : 140
                }
                height={isMtn || isRain ? 28 : isMt || isCellc ? 36 : 32}
                className={
                  isMtn || isRain
                    ? "h-7 w-auto"
                    : isMt || isCellc
                      ? "h-9 w-auto"
                      : "h-8 w-auto"
                }
              />
              {brand.id === "mtn" ? (
                <span className="text-xl font-extrabold leading-none tracking-tight text-black">
                  AI
                </span>
              ) : null}
              {brand.id === "rain" ? (
                <span className="text-lg font-semibold leading-none tracking-tight text-[#202020]">
                  AI
                </span>
              ) : null}
              {isCellc ? (
                <span className="text-lg font-extrabold leading-none tracking-tight text-[#ea5b0c]">
                  AI
                </span>
              ) : null}
            </div>
            <p
              className={cn(
                "mt-2 max-w-md cursor-default text-xs",
                isMt || isCellc ? "text-white/55" : "text-muted-foreground"
              )}
              onClick={registerSecretClick}
            >
              Huawei Cloud demo environment. Designs are for {brand.name}{" "}
              customer reference only — not an official {brand.name} product. No
              payment or backend connected.
            </p>
          </div>
          <Link
            href="/pricing-studio"
            className="btn-brand inline-flex rounded-full px-5 py-2.5 text-sm font-bold"
          >
            Open Pricing Studio
          </Link>
        </div>
      </footer>
    </div>
  );
}
