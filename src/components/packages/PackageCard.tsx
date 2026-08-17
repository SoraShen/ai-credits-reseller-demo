import { Check } from "lucide-react";
import { brand } from "@/lib/brand";
import { formatCredits } from "@/lib/pricing/formulas";
import type { StorefrontPlan } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

export function PackageCard({
  plan,
  partnerView = false,
}: {
  plan: StorefrontPlan;
  partnerView?: boolean;
}) {
  if (brand.id === "mtn") {
    return <MtnPackageCard plan={plan} partnerView={partnerView} />;
  }
  if (brand.id === "rain") {
    return <RainPackageCard plan={plan} partnerView={partnerView} />;
  }
  return <DefaultPackageCard plan={plan} partnerView={partnerView} />;
}

/** Accent colours mirrored from rain.co.za/mobile package screens. */
const RAIN_ACCENTS: Record<string, { bg: string; soft: string; label: string }> = {
  lite: { bg: "#0077C8", soft: "#E8F4FC", label: "city" },
  standard: { bg: "#6B2D5C", soft: "#F6EAF2", label: "province" },
  pro: { bg: "#5A6A7A", soft: "#EEF1F4", label: "countrywide" },
  ultra: { bg: "#0096FF", soft: "#EAF5FF", label: "max" },
  "seat-standard": { bg: "#0077C8", soft: "#E8F4FC", label: "team" },
  "seat-pro": { bg: "#6B2D5C", soft: "#F6EAF2", label: "team+" },
  "seat-max": { bg: "#0096FF", soft: "#EAF5FF", label: "enterprise" },
};

function RainPackageCard({
  plan,
  partnerView,
}: {
  plan: StorefrontPlan;
  partnerView: boolean;
}) {
  const hasDiscount = plan.price < plan.priceOriginal;
  const accent = RAIN_ACCENTS[plan.id] ?? {
    bg: "#0077C8",
    soft: "#E8F4FC",
    label: "plan",
  };

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white shadow-card",
        plan.popular ? "border-[#0077C8] ring-2 ring-[#0077C8]/25" : "border-[#dce3ea]"
      )}
    >
      <div
        className="h-2 w-full"
        style={{ background: accent.bg }}
        aria-hidden
      />

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ color: accent.bg }}
            >
              {accent.label}
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#202020] lowercase">
              {plan.name}
            </h3>
            <p className="mt-0.5 text-sm text-[#5a6a7a]">{plan.tiersLabel}</p>
          </div>
          {plan.popular ? (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
              style={{ background: accent.bg }}
            >
              recommended
            </span>
          ) : plan.discountLabel ? (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: accent.soft, color: accent.bg }}
            >
              {plan.discountLabel}
            </span>
          ) : null}
        </div>

        <div
          className="mt-5 rounded-2xl px-4 py-4"
          style={{ background: accent.soft }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5a6a7a]">
            from
          </p>
          {hasDiscount ? (
            <p className="text-sm text-[#5a6a7a] line-through">
              {plan.currency}
              {plan.priceOriginal.toLocaleString("en-ZA")}
            </p>
          ) : null}
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-semibold tracking-tight text-[#202020]">
              {plan.currency}
              {plan.price.toLocaleString("en-ZA")}
            </span>
            <span className="mb-1.5 text-sm text-[#5a6a7a]">{plan.period}</span>
          </div>
          {plan.monthlyEquivalentLabel ? (
            <p className="mt-1 text-xs text-[#5a6a7a]">
              {plan.monthlyEquivalentLabel}
            </p>
          ) : null}
          {plan.savingsLabel ? (
            <p className="mt-2 text-xs font-bold text-[#0b7a3e]">
              {plan.savingsLabel}
            </p>
          ) : null}
        </div>

        <p className="mt-4 text-sm font-semibold text-[#202020]">
          {formatCredits(plan.credits)} Credits
          <span className="font-normal text-[#5a6a7a]"> / month</span>
        </p>
        <p className="mt-0.5 text-xs text-[#5a6a7a]">{plan.unitPriceLabel}</p>
        {plan.creditsSubLabel ? (
          <p className="mt-0.5 text-xs text-[#5a6a7a]">{plan.creditsSubLabel}</p>
        ) : null}

        {partnerView ? (
          <p
            className={cn(
              "mt-3 rounded-xl bg-[#202020]/5 px-2 py-1 text-[11px] font-semibold",
              plan.effectiveMargin < 0.15 ? "text-[#b00000]" : "text-[#0b7a3e]"
            )}
          >
            {plan.marginLabel} · {plan.effectiveMarginLabel}
          </p>
        ) : null}

        <ul className="mt-4 space-y-2.5">
          <li className="flex items-start gap-2.5 text-sm text-[#202020]/90">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent.bg }}
            />
            <span>Priced in Rand — no FX surprise on your bill</span>
          </li>
          {plan.features.slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-[#202020]/90">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: accent.bg }}
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="mt-auto w-full rounded-full px-4 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: accent.bg, marginTop: "1.5rem" }}
        >
          {plan.cta}
        </button>

        <div className="mt-4 border-t border-[#e7ecf2] pt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5a6a7a]">
            models
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-[#5a6a7a]">
            {plan.models.slice(0, 5).map((m) => (
              <li key={m}>{m}</li>
            ))}
            {plan.models.length > 5 ? (
              <li className="font-semibold text-[#0077C8]">
                +{plan.models.length - 5} more
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </article>
  );
}

function MtnPackageCard({
  plan,
  partnerView,
}: {
  plan: StorefrontPlan;
  partnerView: boolean;
}) {
  const hasDiscount = plan.price < plan.priceOriginal;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border bg-white shadow-card",
        plan.popular ? "border-black ring-2 ring-[#ffcb05]" : "border-[#e5e5e0]"
      )}
    >
      {plan.popular ? (
        <span className="absolute right-4 top-3 z-10 rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-black">
          Recommended
        </span>
      ) : null}

      {/* Yellow Plans–style header */}
      <div className="relative bg-[#ffcb05] px-5 pb-5 pt-5">
        <p className="text-[13px] font-bold italic text-black/80">AI Credits</p>
        <p className="mt-2 text-[1.65rem] font-black leading-none tracking-tight text-black sm:text-[1.85rem]">
          {formatCredits(plan.credits)}
          <span className="ml-1.5 text-base font-bold">Credits</span>
        </p>
        <p className="mt-1.5 text-xs font-semibold text-black/70">
          {plan.tiersLabel} · / month
        </p>
        {plan.discountLabel ? (
          <span className="mt-3 inline-flex rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-black">
            {plan.discountLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl font-extrabold text-black">{plan.name}</h3>
          {plan.savingsLabel ? (
            <span className="text-[11px] font-bold text-[#0b7a3e]">
              {plan.savingsLabel}
            </span>
          ) : null}
        </div>

        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2.5 text-sm text-black/85">
            <span className="mt-1 h-4 w-[3px] shrink-0 rounded-full bg-[#ffcb05]" />
            <span>{plan.unitPriceLabel}</span>
          </li>
          {plan.creditsSubLabel ? (
            <li className="flex items-start gap-2.5 text-sm text-black/85">
              <span className="mt-1 h-4 w-[3px] shrink-0 rounded-full bg-[#ffcb05]" />
              <span>{plan.creditsSubLabel}</span>
            </li>
          ) : null}
          <li className="flex items-start gap-2.5 text-sm text-black/85">
            <span className="mt-1 h-4 w-[3px] shrink-0 rounded-full bg-[#ffcb05]" />
            <span>Priced in Rand — no FX surprise</span>
          </li>
          {plan.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-black/85">
              <span className="mt-1 h-4 w-[3px] shrink-0 rounded-full bg-[#ffcb05]" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {partnerView ? (
          <p
            className={cn(
              "mt-3 rounded-lg bg-black/5 px-2 py-1 text-[11px] font-semibold",
              plan.effectiveMargin < 0.15 ? "text-[#b00000]" : "text-[#0b7a3e]"
            )}
          >
            {plan.marginLabel} · {plan.effectiveMarginLabel}
          </p>
        ) : null}

        <div className="mt-auto border-t border-[#e5e5e0] pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
            From
          </p>
          {hasDiscount ? (
            <p className="text-sm text-black/40 line-through">
              {plan.currency}
              {plan.priceOriginal.toLocaleString("en-ZA")}
            </p>
          ) : null}
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-black tracking-tight text-black">
              {plan.currency}
              {plan.price.toLocaleString("en-ZA")}
            </span>
            <span className="mb-1 text-sm text-black/55">{plan.period}</span>
          </div>
          {plan.monthlyEquivalentLabel ? (
            <p className="mt-0.5 text-xs text-black/50">
              {plan.monthlyEquivalentLabel}
            </p>
          ) : null}

          <button
            type="button"
            className={cn(
              "mt-4 w-full rounded-full px-4 py-3 text-sm font-extrabold transition-colors",
              plan.popular
                ? "bg-black text-[#ffcb05] hover:bg-black/90"
                : "bg-[#ffcb05] text-black hover:brightness-95"
            )}
          >
            {plan.cta}
          </button>

          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
              Models
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-black/70">
              {plan.models.slice(0, 5).map((m) => (
                <li key={m} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#ffcb05]" />
                  {m}
                </li>
              ))}
              {plan.models.length > 5 ? (
                <li className="font-semibold text-black">
                  +{plan.models.length - 5} more
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function DefaultPackageCard({
  plan,
  partnerView,
}: {
  plan: StorefrontPlan;
  partnerView: boolean;
}) {
  const hasDiscount = plan.price < plan.priceOriginal;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[1.5rem] border bg-white p-5 shadow-card",
        plan.popular
          ? "border-primary bg-brand-soft ring-1 ring-primary/20"
          : "border-border"
      )}
    >
      {plan.popular ? (
        <span className="absolute -top-3 right-5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
          Recommended
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
        {plan.discountLabel ? (
          <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[11px] font-semibold text-brand-ink">
            {plan.discountLabel}
          </span>
        ) : null}
      </div>

      <p className="mt-1 text-xs font-medium text-muted-foreground">
        {plan.tiersLabel}
      </p>

      <div className="mt-4">
        {hasDiscount ? (
          <p className="text-sm text-muted-foreground line-through">
            {plan.currency}
            {plan.priceOriginal.toLocaleString("en-ZA")}
          </p>
        ) : null}
        <div className="flex items-end gap-1">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {plan.currency}
            {plan.price.toLocaleString("en-ZA")}
          </span>
          <span className="mb-1 text-sm text-muted-foreground">{plan.period}</span>
        </div>
        {plan.monthlyEquivalentLabel ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {plan.monthlyEquivalentLabel}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          {plan.unitPriceLabel}
        </p>
        {plan.savingsLabel ? (
          <p className="mt-1 inline-flex rounded-full bg-[#e8f8ef] px-2 py-0.5 text-[11px] font-bold text-[#0b7a3e]">
            {plan.savingsLabel}
          </p>
        ) : null}
        {partnerView ? (
          <p
            className={cn(
              "mt-2 rounded-lg bg-[#1a1a1a]/5 px-2 py-1 text-[11px] font-semibold",
              plan.effectiveMargin < 0.15 ? "text-brand-ink" : "text-[#0b7a3e]"
            )}
          >
            {plan.marginLabel} · {plan.effectiveMarginLabel}
          </p>
        ) : null}
      </div>

      <div className="mt-3 rounded-2xl bg-brand-soft px-3 py-2">
        <p className="text-sm font-semibold text-brand-ink">{plan.creditsLabel}</p>
        {plan.creditsSubLabel ? (
          <p className="text-[11px] font-medium text-brand-ink/80">
            {plan.creditsSubLabel}
          </p>
        ) : null}
        <p className="text-[11px] text-muted-foreground">
          Priced in Rand — no FX surprise on your bill
        </p>
      </div>

      <button
        type="button"
        className={cn(
          "mt-5 w-full rounded-full px-4 py-3 text-sm font-bold transition-colors",
          plan.popular
            ? "btn-brand"
            : "border border-primary bg-white text-brand-ink hover:bg-brand-soft"
        )}
      >
        {plan.cta}
      </button>

      <ul className="mt-5 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
              <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Models
        </p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {plan.models.slice(0, 8).map((m) => (
            <li key={m} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {m}
            </li>
          ))}
          {plan.models.length > 8 ? (
            <li className="text-xs text-brand-ink">
              +{plan.models.length - 8} more
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
