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
  if (brand.id === "mt") {
    return <MtPackageCard plan={plan} partnerView={partnerView} />;
  }
  if (brand.id === "cellc") {
    return <CellcPackageCard plan={plan} partnerView={partnerView} />;
  }
  return <DefaultPackageCard plan={plan} partnerView={partnerView} />;
}

/** UI accents only — blue / dark blue / light grey (not product burgundy). */
const RAIN_ACCENTS: Record<
  string,
  {
    banner: string;
    bannerText: string;
    soft: string;
    label: string;
    title: string;
  }
> = {
  lite: {
    banner: "#E8EDF2",
    bannerText: "#202020",
    soft: "#F5F7FA",
    label: "starter",
    title: "unlimited lite",
  },
  standard: {
    banner: "#0077C8",
    bannerText: "#FFFFFF",
    soft: "#E8F4FC",
    label: "most popular",
    title: "unlimited standard",
  },
  pro: {
    banner: "#005FA0",
    bannerText: "#FFFFFF",
    soft: "#EAF4FB",
    label: "pro",
    title: "unlimited pro",
  },
  ultra: {
    banner: "#003A62",
    bannerText: "#FFFFFF",
    soft: "#E6EEF6",
    label: "max",
    title: "unlimited ultra",
  },
  "seat-standard": {
    banner: "#E8EDF2",
    bannerText: "#202020",
    soft: "#F5F7FA",
    label: "team",
    title: "unlimited team",
  },
  "seat-pro": {
    banner: "#0077C8",
    bannerText: "#FFFFFF",
    soft: "#E8F4FC",
    label: "team+",
    title: "unlimited team pro",
  },
  "seat-max": {
    banner: "#003A62",
    bannerText: "#FFFFFF",
    soft: "#E6EEF6",
    label: "enterprise",
    title: "unlimited team max",
  },
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
    banner: "#0077C8",
    bannerText: "#FFFFFF",
    soft: "#E8F4FC",
    label: "plan",
    title: plan.name.toLowerCase(),
  };

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#e4e8ee] bg-white",
        plan.popular && "shadow-[0_12px_40px_rgba(0,119,200,0.12)]"
      )}
    >
      {/* Plan name banner — light grey / blue / dark blue */}
      <div
        className="px-5 py-4"
        style={{ background: accent.banner, color: accent.bannerText }}
      >
        <p className="text-[11px] font-medium lowercase tracking-wide opacity-80">
          {accent.label}
          {plan.discountLabel ? ` · ${plan.discountLabel.toLowerCase()}` : ""}
        </p>
        <h3 className="mt-1 text-xl font-semibold lowercase tracking-tight">
          {accent.title}
        </h3>
        <p className="mt-0.5 text-sm opacity-75">{plan.tiersLabel}</p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <p className="text-xs text-[#8a97a5]">from</p>
        {hasDiscount ? (
          <p className="text-sm text-[#8a97a5] line-through">
            {plan.currency}
            {plan.priceOriginal.toLocaleString(brand.locale)}
          </p>
        ) : null}
        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-semibold tracking-tight text-[#0077C8]">
            {plan.currency}
            {plan.price.toLocaleString(brand.locale)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#8a97a5]">
          {plan.period.includes("year") ? "billed yearly" : "month-to-month"}
        </p>
        {plan.monthlyEquivalentLabel ? (
          <p className="mt-1 text-xs text-[#8a97a5]">
            {plan.monthlyEquivalentLabel}
          </p>
        ) : null}
        {plan.savingsLabel ? (
          <p className="mt-2 text-xs font-semibold text-[#0077C8]">
            {plan.savingsLabel.toLowerCase()}
          </p>
        ) : null}

        <p className="mt-5 text-sm text-[#202020]">
          <span className="font-semibold">
            {formatCredits(plan.credits)} Credits
          </span>
          <span className="text-[#8a97a5]"> / month</span>
        </p>
        <p className="mt-0.5 text-xs text-[#8a97a5]">{plan.unitPriceLabel}</p>
        {plan.creditsSubLabel ? (
          <p className="mt-0.5 text-xs text-[#8a97a5]">{plan.creditsSubLabel}</p>
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

        <ul className="mt-5 space-y-3">
          <li className="flex items-start gap-2.5 text-sm text-[#202020]">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[#0077C8]"
              strokeWidth={2.5}
            />
            <span>priced in Rand — no FX surprise on your bill</span>
          </li>
          {plan.features.slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-[#202020]">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-[#0077C8]"
                strokeWidth={2.5}
              />
              <span className="lowercase">{f}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="mt-auto w-full rounded-full bg-[#0077C8] px-4 py-3.5 text-sm font-semibold lowercase text-white transition-colors hover:bg-[#005FA0]"
          style={{ marginTop: "1.75rem" }}
        >
          {plan.cta.toLowerCase() === "get started" ? "buy now" : plan.cta.toLowerCase()}
        </button>

        <div className="mt-4 border-t border-[#eef1f5] pt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a97a5]">
            models
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-[#8a97a5]">
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

function MtPackageCard({
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
        "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white",
        plan.popular
          ? "border-[#00B4C8] shadow-[0_12px_40px_rgba(20,0,120,0.12)]"
          : "border-[#d9e0ea]"
      )}
    >
      <div className="bg-[#140078] px-5 py-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5ecbd6]">
          {plan.popular ? "Recommended" : "AI Credits"}
          {plan.discountLabel ? ` · ${plan.discountLabel}` : ""}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">{plan.name}</h3>
        <p className="mt-0.5 text-sm text-white/70">{plan.tiersLabel}</p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        {hasDiscount ? (
          <p className="text-sm text-[#8a97a5] line-through">
            {plan.currency}
            {plan.priceOriginal.toLocaleString(brand.locale)}
          </p>
        ) : null}
        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-semibold tracking-tight text-[#140078]">
            {plan.currency}
            {plan.price.toLocaleString(brand.locale)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#8a97a5]">{plan.period}</p>
        {plan.monthlyEquivalentLabel ? (
          <p className="mt-1 text-xs text-[#8a97a5]">{plan.monthlyEquivalentLabel}</p>
        ) : null}
        {plan.savingsLabel ? (
          <p className="mt-2 text-xs font-semibold text-[#00B4C8]">{plan.savingsLabel}</p>
        ) : null}

        <p className="mt-5 text-sm text-[#07003a]">
          <span className="font-semibold">{plan.creditsLabel}</span>
        </p>
        {plan.creditsSubLabel ? (
          <p className="mt-0.5 text-xs text-[#8a97a5]">{plan.creditsSubLabel}</p>
        ) : null}
        <p className="mt-0.5 text-xs text-[#8a97a5]">{plan.unitPriceLabel}</p>

        {partnerView ? (
          <p
            className={cn(
              "mt-3 rounded-xl bg-[#140078]/5 px-2 py-1 text-[11px] font-semibold",
              plan.effectiveMargin < 0.15 ? "text-[#b00000]" : "text-[#0b7a3e]"
            )}
          >
            {plan.marginLabel} · {plan.effectiveMarginLabel}
          </p>
        ) : null}

        <ul className="mt-5 space-y-3">
          <li className="flex items-start gap-2.5 text-sm text-[#07003a]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00B4C8]" strokeWidth={2.5} />
            <span>Priced in rupees — no FX surprise on your bill</span>
          </li>
          {plan.features.slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-[#07003a]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00B4C8]" strokeWidth={2.5} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={cn(
            "mt-auto w-full rounded-full px-4 py-3.5 text-sm font-semibold transition-colors",
            plan.popular
              ? "bg-[#00B4C8] text-[#07003a] hover:brightness-95"
              : "bg-[#140078] text-white hover:bg-[#1b1488]"
          )}
          style={{ marginTop: "1.75rem" }}
        >
          {plan.cta}
        </button>

        <div className="mt-4 border-t border-[#eef1f5] pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a97a5]">
            Models
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-[#8a97a5]">
            {plan.models.slice(0, 5).map((m) => (
              <li key={m}>{m}</li>
            ))}
            {plan.models.length > 5 ? (
              <li className="font-semibold text-[#140078]">
                +{plan.models.length - 5} more
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </article>
  );
}

function CellcPackageCard({
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
        "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white",
        plan.popular
          ? "border-[#ea5b0c] shadow-[0_14px_40px_rgba(234,91,12,0.18)]"
          : "border-[#d6d6d6]"
      )}
    >
      <div className="bg-[#0f0f0f] px-5 py-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ea5b0c]">
            {plan.popular ? "Most popular" : "AI Credits"}
          </p>
          {plan.discountLabel ? (
            <span className="rounded-full bg-[#ea5b0c] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {plan.discountLabel}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 text-xl font-bold tracking-tight">{plan.name}</h3>
        <p className="mt-0.5 text-sm text-white/65">{plan.tiersLabel}</p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b6b6b]">
          From
        </p>
        {hasDiscount ? (
          <p className="text-sm text-[#6b6b6b] line-through">
            {plan.currency}
            {plan.priceOriginal.toLocaleString(brand.locale)}
          </p>
        ) : null}
        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-extrabold tracking-tight text-[#ea5b0c]">
            {plan.currency}
            {plan.price.toLocaleString(brand.locale)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#6b6b6b]">{plan.period}</p>
        {plan.monthlyEquivalentLabel ? (
          <p className="mt-1 text-xs text-[#6b6b6b]">{plan.monthlyEquivalentLabel}</p>
        ) : null}
        {plan.savingsLabel ? (
          <p className="mt-2 text-xs font-bold text-[#0f0f0f]">{plan.savingsLabel}</p>
        ) : null}

        <p className="mt-5 text-sm text-[#0f0f0f]">
          <span className="font-bold">{plan.creditsLabel}</span>
        </p>
        {plan.creditsSubLabel ? (
          <p className="mt-0.5 text-xs text-[#6b6b6b]">{plan.creditsSubLabel}</p>
        ) : null}
        <p className="mt-0.5 text-xs text-[#6b6b6b]">{plan.unitPriceLabel}</p>

        {partnerView ? (
          <p
            className={cn(
              "mt-3 rounded-xl bg-[#0f0f0f]/5 px-2 py-1 text-[11px] font-semibold",
              plan.effectiveMargin < 0.15 ? "text-[#b00000]" : "text-[#0b7a3e]"
            )}
          >
            {plan.marginLabel} · {plan.effectiveMarginLabel}
          </p>
        ) : null}

        <ul className="mt-5 space-y-3">
          <li className="flex items-start gap-2.5 text-sm text-[#0f0f0f]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ea5b0c]" strokeWidth={2.75} />
            <span>Priced in Rand — no FX surprise on your bill</span>
          </li>
          {plan.features.slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-[#0f0f0f]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ea5b0c]" strokeWidth={2.75} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={cn(
            "mt-auto w-full rounded-full px-4 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors",
            plan.popular
              ? "bg-[#ea5b0c] text-white hover:bg-[#d85109]"
              : "bg-[#0f0f0f] text-white hover:bg-[#292929]"
          )}
          style={{ marginTop: "1.75rem" }}
        >
          {plan.cta}
        </button>

        <div className="mt-4 border-t border-[#ececec] pt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6b6b]">
            Models
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-[#6b6b6b]">
            {plan.models.slice(0, 5).map((m) => (
              <li key={m}>{m}</li>
            ))}
            {plan.models.length > 5 ? (
              <li className="font-semibold text-[#ea5b0c]">
                +{plan.models.length - 5} more
              </li>
            ) : null}
          </ul>
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
            {plan.priceOriginal.toLocaleString(brand.locale)}
          </p>
        ) : null}
        <div className="flex items-end gap-1">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {plan.currency}
            {plan.price.toLocaleString(brand.locale)}
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
