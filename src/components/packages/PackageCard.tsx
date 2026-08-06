import { Check } from "lucide-react";
import type { StorefrontPlan } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

export function PackageCard({
  plan,
  partnerView = false,
}: {
  plan: StorefrontPlan;
  partnerView?: boolean;
}) {
  const hasDiscount = plan.price < plan.priceOriginal;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[1.5rem] border bg-white p-5 shadow-card",
        plan.popular
          ? "border-[#e60000] bg-[#fff8f8] ring-1 ring-[#e60000]/20"
          : "border-border"
      )}
    >
      {plan.popular ? (
        <span className="absolute -top-3 right-5 rounded-full bg-[#e60000] px-3 py-1 text-[11px] font-bold text-white">
          Recommended
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
        {plan.discountLabel ? (
          <span className="rounded-full bg-[#ffe5e5] px-2 py-0.5 text-[11px] font-semibold text-[#e60000]">
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
        <p className="mt-1 text-xs text-muted-foreground">
          {plan.unitPriceLabel}
          {partnerView ? (
            <span className="text-[#e60000]"> · {plan.marginLabel}</span>
          ) : null}
        </p>
      </div>

      <div className="mt-3 rounded-2xl bg-[#fff1f1] px-3 py-2">
        <p className="text-sm font-semibold text-[#e60000]">{plan.creditsLabel}</p>
        <p className="text-[11px] text-muted-foreground">
          Priced in Rand — no FX surprise on your bill
        </p>
      </div>

      <button
        type="button"
        className={cn(
          "mt-5 w-full rounded-full px-4 py-3 text-sm font-bold transition-colors",
          plan.popular
            ? "btn-vodacom"
            : "border border-[#e60000] bg-white text-[#e60000] hover:bg-[#fff1f1]"
        )}
      >
        {plan.cta}
      </button>

      <ul className="mt-5 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e60000]">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
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
              <span className="h-1.5 w-1.5 rounded-full bg-[#e60000]" />
              {m}
            </li>
          ))}
          {plan.models.length > 8 ? (
            <li className="text-xs text-[#e60000]">
              +{plan.models.length - 8} more
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
