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
  return <DefaultPackageCard plan={plan} partnerView={partnerView} />;
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
