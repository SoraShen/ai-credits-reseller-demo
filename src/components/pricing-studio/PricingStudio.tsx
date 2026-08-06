"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePricingState } from "@/hooks/usePricingState";
import {
  breakevenDiscount,
  creditsForCall,
  creditsPerZar,
  formatCredits,
  formatZar,
  marginAtDiscount,
  safetyOk,
  unitPricePer1M,
} from "@/lib/pricing/formulas";
import { COPY, PHILOSOPHY, type Lang } from "@/lib/pricing/i18n";
import { applyTemplate } from "@/lib/pricing/storage";
import type { PackageRow, PricingState } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";
import { FxPurchasingPower } from "./FxPurchasingPower";

const DISCOUNTS = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7];

export function PricingStudio() {
  const { state, update, ready } = usePricingState();
  const [lang, setLang] = useState<Lang>("en");
  const [toast, setToast] = useState(false);
  const [simModel, setSimModel] = useState("ds-v4-pro");
  const [simIn, setSimIn] = useState(1000);
  const [simOut, setSimOut] = useState(2000);
  const t = COPY[lang];

  const personal = state.packages.filter((p) => p.audience === "personal");
  const business = state.packages.filter((p) => p.audience === "business");
  const cpz = creditsPerZar(state.params);

  const sim = useMemo(() => {
    const model = state.models.find((m) => m.id === simModel) ?? state.models[0];
    const credits = creditsForCall(
      model,
      simIn,
      simOut,
      state.params.creditsPerUsd
    );
    const usd =
      (simIn / 1e6) * model.inputPrice + (simOut / 1e6) * model.outputPrice;
    return { model, credits, usd };
  }, [state.models, state.params.creditsPerUsd, simModel, simIn, simOut]);

  function patchParams(partial: Partial<PricingState["params"]>) {
    update({
      ...state,
      templateId: "custom",
      params: { ...state.params, ...partial },
    });
  }

  function patchPackage(id: string, partial: Partial<PackageRow>) {
    update({
      ...state,
      templateId: "custom",
      packages: state.packages.map((p) =>
        p.id === id ? { ...p, ...partial } : p
      ),
    });
  }

  function patchModel(
    id: string,
    field: "inputPrice" | "outputPrice" | "tierCoeff",
    value: number
  ) {
    update({
      ...state,
      templateId: "custom",
      models: state.models.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    });
  }

  function useTemplate(id: "A" | "B") {
    const next = applyTemplate(id);
    update(next);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  function applyCurrent() {
    update(state);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  if (!ready) {
    return <div className="p-10 text-sm text-muted-foreground">{t.loading}</div>;
  }

  const paramFields = [
    ["usdZar", t.usdZar, state.params.usdZar, 0.01],
    ["creditsPerUsd", t.creditsPerUsd, state.params.creditsPerUsd, 1000],
    ["markupRate", t.markupRate, state.params.markupRate, 0.01],
    ["minDiscount", t.minDiscount, state.params.minDiscount, 0.01],
    ["promoDiscount", t.promoDiscount, state.params.promoDiscount, 0.01],
  ] as const;

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#e60000]">
              Vodacom AI
            </p>
            <h1 className="text-xl font-extrabold">{t.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-muted p-1">
              {(["en", "zh"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold",
                    lang === l
                      ? "bg-[#e60000] text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {l === "zh" ? "中文" : "EN"}
                </button>
              ))}
            </div>
            <Link
              href="/"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
            >
              {t.back}
            </Link>
            <button
              type="button"
              onClick={applyCurrent}
              className="btn-vodacom rounded-full px-4 py-1.5 text-xs font-bold"
            >
              {t.apply}
            </button>
          </div>
        </div>
      </header>

      {toast ? (
        <div className="bg-[#0b7a3e] px-4 py-2 text-center text-sm font-semibold text-white">
          {t.applied}
        </div>
      ) : null}

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <p className="max-w-3xl text-sm text-muted-foreground">{t.subtitle}</p>

        <section>
          <h2 className="text-lg font-extrabold">{t.templates}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {(
              [
                ["A", t.templateA, t.templateADesc],
                ["B", t.templateB, t.templateBDesc],
              ] as const
            ).map(([id, name, desc]) => (
              <article
                key={id}
                className={cn(
                  "rounded-2xl border bg-white p-5 shadow-card",
                  state.templateId === id
                    ? "border-[#e60000] ring-1 ring-[#e60000]/30"
                    : "border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                  {state.templateId === id ? (
                    <span className="rounded-full bg-[#ffe5e5] px-2 py-0.5 text-[11px] font-bold text-[#e60000]">
                      {t.active}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => useTemplate(id)}
                  className="btn-vodacom mt-4 rounded-full px-4 py-2 text-sm font-bold"
                >
                  {t.select}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-extrabold">{t.philosophy}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {PHILOSOPHY[lang].map((item) => (
              <div key={item.t} className="rounded-xl bg-[#fff8f8] p-4">
                <p className="font-bold text-[#e60000]">{item.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <h2 className="text-lg font-extrabold">{t.params}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {paramFields.map(([key, label, value, step]) => (
              <label key={key} className="text-sm">
                <span className="font-medium text-muted-foreground">{label}</span>
                <input
                  type="number"
                  step={step}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                  value={value}
                  onChange={(e) =>
                    patchParams({ [key]: Number(e.target.value) } as never)
                  }
                />
              </label>
            ))}
            <label className="text-sm sm:col-span-2 lg:col-span-3">
              <span className="font-medium text-muted-foreground">
                {t.promoEnds}
              </span>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                value={toLocalInput(state.params.promoEndsAt)}
                onChange={(e) =>
                  patchParams({
                    promoEndsAt: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </label>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {t.zarCredits} {Math.round(cpz).toLocaleString("en-ZA")}{" "}
            {t.creditsUnit} · {t.safety}:{" "}
            <span
              className={
                safetyOk(state.params, state.params.promoDiscount)
                  ? "font-bold text-[#0b7a3e]"
                  : "font-bold text-[#e60000]"
              }
            >
              {safetyOk(state.params, state.params.promoDiscount)
                ? t.ok
                : t.risk}{" "}
              (
              {(
                (1 + state.params.markupRate) *
                state.params.promoDiscount
              ).toFixed(3)}
              )
            </span>
          </p>

          <h3 className="mt-6 font-bold">{t.modelTable}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.modelSource}{" "}
            <a
              className="text-[#e60000] underline"
              href="https://support.huaweicloud.com/intl/en-us/price-maas/price-maas-0002.html"
              target="_blank"
              rel="noreferrer"
            >
              price-maas-0002
            </a>
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">{t.colModel}</th>
                  <th className="py-2 pr-3 font-semibold">{t.colTier}</th>
                  <th className="py-2 pr-3 font-semibold">{t.colCoeff}</th>
                  <th className="py-2 pr-3 font-semibold">{t.colInput}</th>
                  <th className="py-2 pr-3 font-semibold">{t.colOutput}</th>
                  <th className="py-2 font-semibold">{t.colNote}</th>
                </tr>
              </thead>
              <tbody>
                {state.models.map((m) => (
                  <tr key={m.id} className="border-b border-border/70 align-top">
                    <td className="py-2 pr-3 font-medium">{m.name}</td>
                    <td className="py-2 pr-3">{m.tier}</td>
                    <td className="py-2 pr-3">
                      <Num
                        value={m.tierCoeff}
                        step={0.1}
                        onChange={(v) => patchModel(m.id, "tierCoeff", v)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <Num
                        value={m.inputPrice}
                        step={0.001}
                        onChange={(v) => patchModel(m.id, "inputPrice", v)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <Num
                        value={m.outputPrice}
                        step={0.001}
                        onChange={(v) => patchModel(m.id, "outputPrice", v)}
                      />
                    </td>
                    <td className="max-w-[220px] py-2 text-xs text-muted-foreground">
                      {m.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <h2 className="text-lg font-extrabold">{t.packages}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t.gmExplain}</p>
          <PackageTable
            title={t.personal}
            rows={personal}
            discount={state.params.promoDiscount}
            onChange={patchPackage}
            labels={t}
          />
          <PackageTable
            title={t.business}
            rows={business}
            discount={state.params.promoDiscount}
            onChange={patchPackage}
            labels={t}
          />
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <h2 className="text-lg font-extrabold">{t.sensitivity}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">{t.colDiscount}</th>
                  {personal.map((p) => (
                    <th key={p.id} className="py-2 pr-3 font-semibold">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISCOUNTS.map((d) => (
                  <tr key={d} className="border-b border-border/70">
                    <td className="py-2 pr-3 font-medium">
                      {Math.round(d * 100)}%
                    </td>
                    {personal.map((p) => {
                      const m = marginAtDiscount(p, d).margin;
                      const be = breakevenDiscount(p);
                      const bad = d < be || !safetyOk(state.params, d);
                      return (
                        <td
                          key={p.id}
                          className={cn(
                            "py-2 pr-3 tabular-nums",
                            bad
                              ? "font-semibold text-[#e60000]"
                              : "text-[#0b7a3e]"
                          )}
                        >
                          {(m * 100).toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <h2 className="text-lg font-extrabold">{t.bonus}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">{t.colBonus}</th>
                  <th className="py-2 pr-3 font-semibold">{t.colGift}</th>
                  <th className="py-2 pr-3 font-semibold">{t.colCostUp}</th>
                  <th className="py-2 font-semibold">{t.colBonusNote}</th>
                </tr>
              </thead>
              <tbody>
                {t.bonusRows.map(([name, gift]) => {
                  const costUp = gift / (1 + gift);
                  return (
                    <tr key={name} className="border-b border-border/70">
                      <td className="py-2 pr-3">{name}</td>
                      <td className="py-2 pr-3">{Math.round(gift * 100)}%</td>
                      <td className="py-2 pr-3">
                        +{(costUp * 100).toFixed(1)}%
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {t.bonusNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <h2 className="text-lg font-extrabold">{t.simulator}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.simFormula}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="text-muted-foreground">{t.simModel}</span>
              <select
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                value={simModel}
                onChange={(e) => setSimModel(e.target.value)}
              >
                {state.models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">{t.simIn}</span>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                value={simIn}
                onChange={(e) => setSimIn(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">{t.simOut}</span>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                value={simOut}
                onChange={(e) => setSimOut(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="mt-4 rounded-xl bg-[#fff1f1] p-4 text-sm">
            <p>
              <span className="text-muted-foreground">{t.simApi}: </span>
              <strong>${sim.usd.toFixed(6)}</strong>
            </p>
            <p className="mt-1">
              <span className="text-muted-foreground">{t.simCredits}: </span>
              <strong className="text-[#e60000]">
                {Math.round(sim.credits).toLocaleString("en-ZA")} (
                {formatCredits(sim.credits)})
              </strong>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t.simExample}</p>
          </div>
        </section>

        <FxPurchasingPower
          params={state.params}
          pkg={
            personal.find((p) => p.popular) ??
            personal[1] ??
            personal[0] ??
            state.packages[0]
          }
          model={sim.model}
          lang={lang}
        />
      </main>
    </div>
  );
}

function Num({
  value,
  step,
  onChange,
}: {
  value: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      step={step}
      className="w-24 rounded-lg border border-border px-2 py-1"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

function PackageTable({
  title,
  rows,
  discount,
  onChange,
  labels,
}: {
  title: string;
  rows: PackageRow[];
  discount: number;
  onChange: (id: string, partial: Partial<PackageRow>) => void;
  labels: (typeof COPY)[Lang];
}) {
  return (
    <div className="mt-5">
      <h3 className="font-bold text-[#e60000]">{title}</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="py-2 pr-2 font-semibold">{labels.colPlan}</th>
              <th className="py-2 pr-2 font-semibold">{labels.colMonthly}</th>
              <th className="py-2 pr-2 font-semibold">{labels.colYearly}</th>
              <th className="py-2 pr-2 font-semibold">{labels.colCredits}</th>
              <th className="py-2 pr-2 font-semibold">{labels.colDesignGm}</th>
              <th className="py-2 pr-2 font-semibold">{labels.colPromoGm}</th>
              <th className="py-2 font-semibold">{labels.colUnit}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const promo = marginAtDiscount(p, discount);
              return (
                <tr key={p.id} className="border-b border-border/70 align-top">
                  <td className="py-2 pr-2 font-medium">{p.name}</td>
                  <td className="py-2 pr-2">
                    <Num
                      value={p.monthlyPrice}
                      step={1}
                      onChange={(v) => onChange(p.id, { monthlyPrice: v })}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Num
                      value={p.yearlyPrice}
                      step={1}
                      onChange={(v) => onChange(p.id, { yearlyPrice: v })}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Num
                      value={p.credits}
                      step={100000}
                      onChange={(v) => onChange(p.id, { credits: v })}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Num
                      value={Number((p.designMargin * 100).toFixed(1))}
                      step={0.5}
                      onChange={(v) =>
                        onChange(p.id, { designMargin: v / 100 })
                      }
                    />
                    %
                  </td>
                  <td
                    className={cn(
                      "py-2 pr-2 tabular-nums",
                      promo.margin < 0.2
                        ? "text-[#e60000]"
                        : "text-[#0b7a3e]"
                    )}
                  >
                    {(promo.margin * 100).toFixed(1)}%
                    <div className="text-[11px] text-muted-foreground">
                      {formatZar(promo.profit)}
                    </div>
                  </td>
                  <td className="py-2 tabular-nums">
                    {formatZar(unitPricePer1M(p))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
