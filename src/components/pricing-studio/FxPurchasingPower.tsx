"use client";

import { useEffect, useMemo, useState } from "react";
import {
  faceValueZar,
  formatPct,
  formatZar,
  packageCostZar,
  usdForCall,
} from "@/lib/pricing/formulas";
import { USD_ZAR_QUARTERS, fxRange } from "@/lib/pricing/fxHistory";
import type { ModelCost, PackageRow, PricingParams } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

/**
 * The point of this section is ownership of FX risk, not just "prices move".
 *
 * Model A — fixed Credits anchor: quota and anchor stay put, so the Rand cost of
 * the USD Huawei bill moves and Vodacom's margin moves with it.
 * Model B — anchor re-pegged to hold target margin: Vodacom's Rand profit is
 * flat, and the swing lands on how many requests a quota actually buys.
 * The shelf price is Rand-stable in both models; only the risk owner changes.
 */
export function FxPurchasingPower({
  params,
  pkg,
  model,
  lang = "en",
}: {
  params: PricingParams;
  pkg: PackageRow;
  model: ModelCost;
  lang?: "en" | "zh";
}) {
  const points = USD_ZAR_QUARTERS;
  const { min, max } = fxRange(points);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inputTok, setInputTok] = useState(1000);
  const [outputTok, setOutputTok] = useState(2000);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % points.length),
      1100
    );
    return () => window.clearInterval(id);
  }, [playing, points.length]);

  const current = points[idx];

  const math = useMemo(() => {
    const fx0 = params.usdZar;
    const price = pkg.monthlyPrice;
    const anchor0 = params.creditsPerUsd;

    // Rand cost baked into the design margin at the planning FX rate.
    const designCost = packageCostZar(pkg);
    // Cost if the whole quota were burned at the anchor and planning FX.
    const fullBurnCost = faceValueZar(pkg.credits, params);
    // Implied quota utilisation that reconciles anchor + design margin.
    const utilisation = fullBurnCost > 0 ? designCost / fullBurnCost : 0;

    const usdPerCall = usdForCall(model, inputTok, outputTok);
    const rows = points.map((p) => {
      // Model A: anchor fixed -> Rand cost tracks FX, requests are constant.
      const costA = utilisation * (pkg.credits / anchor0) * p.usdZar;
      const profitA = price - costA;
      const requestsA =
        usdPerCall > 0 ? pkg.credits / (usdPerCall * anchor0) : 0;

      // Model B: anchor re-pegged so Rand cost (and margin) stay on plan.
      const costB = designCost;
      const profitB = price - costB;
      const anchorB =
        designCost > 0
          ? (utilisation * pkg.credits * p.usdZar) / designCost
          : anchor0;
      const requestsB = usdPerCall > 0 ? pkg.credits / (usdPerCall * anchorB) : 0;

      return {
        fx: p.usdZar,
        costA,
        profitA,
        marginA: price > 0 ? profitA / price : 0,
        requestsA,
        costB,
        profitB,
        marginB: price > 0 ? profitB / price : 0,
        requestsB,
        anchorB,
      };
    });

    const base = rows.reduce(
      (acc, r) => (Math.abs(r.fx - fx0) < Math.abs(acc.fx - fx0) ? r : acc),
      rows[0]
    );
    const profitSpread =
      Math.max(...rows.map((r) => r.profitA)) -
      Math.min(...rows.map((r) => r.profitA));
    const requestSpread =
      Math.max(...rows.map((r) => r.requestsB)) -
      Math.min(...rows.map((r) => r.requestsB));

    return {
      fx0,
      price,
      utilisation,
      usdPerCall,
      rows,
      base,
      profitSpread,
      requestSpread,
      maxProfit: Math.max(...rows.map((r) => Math.max(r.profitA, r.profitB)), 1),
    };
  }, [params, pkg, model, inputTok, outputTok, points]);

  const row = math.rows[idx];
  const copy = lang === "zh" ? ZH : EN;

  const pad = max - min || 1;
  const y = (v: number) => 100 - ((v - min) / pad) * 78 - 12;
  const x = (i: number) => (i / (points.length - 1)) * 100;
  const path = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(p.usdZar).toFixed(2)}`
    )
    .join(" ");

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-lg font-extrabold">{copy.title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        {copy.subtitle}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="text-muted-foreground">{copy.inTok}</span>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            value={inputTok}
            onChange={(e) => setInputTok(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">{copy.outTok}</span>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            value={outputTok}
            onChange={(e) => setOutputTok(Number(e.target.value))}
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="btn-vodacom w-full rounded-full px-4 py-2 text-sm font-bold"
          >
            {playing ? copy.pause : copy.play}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {copy.basis}: <strong>{pkg.name}</strong> · {formatZar(pkg.monthlyPrice)}
        /mo · {(pkg.credits / 1e6).toFixed(0)}M Credits · {model.name} ·{" "}
        {copy.planFx} {math.fx0.toFixed(2)} · {copy.utilisation}{" "}
        {formatPct(math.utilisation)}
      </p>

      <div className="mt-4 rounded-2xl border border-border bg-[#fbfbfc] p-4">
        <div className="relative h-44 w-full">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <line
              x1="0"
              x2="100"
              y1={y(math.fx0)}
              y2={y(math.fx0)}
              stroke="#98a2b3"
              strokeDasharray="4 4"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={path}
              fill="none"
              stroke="#e60000"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Markers live in HTML so the stretched viewBox cannot distort them. */}
          {points.map((p, i) => (
            <span
              key={p.t}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all",
                i === idx
                  ? "size-3 bg-[#e60000] ring-4 ring-[#e60000]/20"
                  : "size-1.5 bg-[#cfcfcf]"
              )}
              style={{ left: `${x(i)}%`, top: `${y(p.usdZar)}%` }}
            />
          ))}
          <span
            className="absolute right-0 -translate-y-1/2 bg-[#fbfbfc] pl-1 text-[10px] font-semibold text-[#98a2b3]"
            style={{ top: `${y(math.fx0)}%` }}
          >
            {copy.planFx} {math.fx0.toFixed(2)}
          </span>
          <span className="absolute left-0 top-0 text-[10px] text-muted-foreground">
            {max.toFixed(2)}
          </span>
          <span className="absolute bottom-0 left-0 text-[10px] text-muted-foreground">
            {min.toFixed(2)}
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between text-[11px] text-muted-foreground">
          <span>{points[0]?.label}</span>
          <span>{copy.axis}</span>
          <span>{points[points.length - 1]?.label}</span>
        </div>
        <input
          type="range"
          min={0}
          max={points.length - 1}
          value={idx}
          onChange={(e) => {
            setPlaying(false);
            setIdx(Number(e.target.value));
          }}
          className="mt-2 w-full accent-[#e60000]"
        />
        <p className="mt-1 text-center text-sm font-bold">
          {current.label} · {copy.fx}{" "}
          <span className="text-[#e60000]">{current.usdZar.toFixed(2)}</span>{" "}
          <span
            className={cn(
              "text-xs font-semibold",
              current.usdZar <= math.fx0 ? "text-[#0b7a3e]" : "text-[#e60000]"
            )}
          >
            ({current.usdZar <= math.fx0 ? copy.randStronger : copy.randWeaker})
          </span>
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ScenarioCard
          tone="risk"
          badge={copy.aBadge}
          title={copy.aTitle}
          note={copy.aNote}
          userLabel={copy.userRequests}
          userValue={Math.floor(row.requestsA).toLocaleString("en-ZA")}
          userDelta={copy.stable}
          userStable
          cost={row.costA}
          profit={row.profitA}
          margin={row.marginA}
          baseProfit={math.base.profitA}
          maxProfit={math.maxProfit}
          copy={copy}
        />
        <ScenarioCard
          tone="stable"
          badge={copy.bBadge}
          title={copy.bTitle}
          note={copy.bNote}
          userLabel={copy.userRequests}
          userValue={Math.floor(row.requestsB).toLocaleString("en-ZA")}
          userDelta={deltaPct(row.requestsB, math.base.requestsB)}
          cost={row.costB}
          profit={row.profitB}
          margin={row.marginB}
          baseProfit={math.base.profitB}
          maxProfit={math.maxProfit}
          copy={copy}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#fff1f1] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#e60000]">
            {copy.swingA}
          </p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-[#e60000]">
            {formatZar(math.profitSpread)}
          </p>
          <p className="text-[11px] text-muted-foreground">{copy.swingANote}</p>
        </div>
        <div className="rounded-xl bg-[#eef4ff] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1849a9]">
            {copy.swingB}
          </p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-[#1849a9]">
            {Math.round(math.requestSpread).toLocaleString("en-ZA")}
          </p>
          <p className="text-[11px] text-muted-foreground">{copy.swingBNote}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-border bg-[#fbfbfc] p-4">
        <p className="text-sm font-bold">{copy.logicTitle}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {copy.logic.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">{copy.note}</p>
      </div>
    </section>
  );
}

function ScenarioCard({
  tone,
  badge,
  title,
  note,
  userLabel,
  userValue,
  userDelta,
  userStable,
  cost,
  profit,
  margin,
  baseProfit,
  maxProfit,
  copy,
}: {
  tone: "risk" | "stable";
  badge: string;
  title: string;
  note: string;
  userLabel: string;
  userValue: string;
  userDelta: string;
  userStable?: boolean;
  cost: number;
  profit: number;
  margin: number;
  baseProfit: number;
  maxProfit: number;
  copy: Copy;
}) {
  const bar = Math.max(0, Math.min(100, (profit / maxProfit) * 100));
  return (
    <article
      className={cn(
        "rounded-2xl border p-4",
        tone === "risk"
          ? "border-[#e60000]/30 bg-[#fffafa]"
          : "border-[#1849a9]/25 bg-[#f8faff]"
      )}
    >
      <span
        className={cn(
          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold",
          tone === "risk"
            ? "bg-[#ffe5e5] text-[#e60000]"
            : "bg-[#e4ecff] text-[#1849a9]"
        )}
      >
        {badge}
      </span>
      <h3 className="mt-2 text-sm font-extrabold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>

      <div className="mt-3 rounded-xl bg-white p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {userLabel}
        </p>
        <p className="mt-0.5 text-2xl font-extrabold tabular-nums">
          {userValue}
        </p>
        <p
          className={cn(
            "text-[11px] font-semibold",
            userStable ? "text-[#0b7a3e]" : "text-[#1849a9]"
          )}
        >
          {userDelta}
        </p>
      </div>

      <dl className="mt-3 space-y-1 text-xs">
        <Line label={copy.cost} value={formatZar(cost)} />
        <Line
          label={copy.profit}
          value={formatZar(profit)}
          delta={deltaZar(profit, baseProfit)}
        />
        <Line
          label={copy.margin}
          value={formatPct(margin, 1)}
          danger={margin < 0.15}
        />
      </dl>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1a1a1a]/10">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            margin < 0.15 ? "bg-[#e60000]" : "bg-[#0b7a3e]"
          )}
          style={{ width: `${bar}%` }}
        />
      </div>
    </article>
  );
}

function Line({
  label,
  value,
  delta,
  danger,
}: {
  label: string;
  value: string;
  delta?: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "font-bold tabular-nums",
          danger ? "text-[#e60000]" : "text-foreground"
        )}
      >
        {value}
        {delta ? (
          <span className="ml-1 text-[11px] font-semibold text-muted-foreground">
            {delta}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function deltaPct(value: number, base: number) {
  if (!base) return "—";
  const d = value / base - 1;
  const sign = d > 0 ? "+" : "";
  return `${sign}${(d * 100).toFixed(1)}% vs plan`;
}

function deltaZar(value: number, base: number) {
  const d = value - base;
  if (Math.abs(d) < 0.5) return "on plan";
  return `${d > 0 ? "+" : "−"}${formatZar(Math.abs(d))}`;
}

type Copy = typeof EN;

const EN = {
  title: "6 · FX risk: who owns it, and what it costs",
  subtitle:
    "Huawei Cloud MaaS bills in USD; Vodacom settles Huawei in Rand and sells Rand-priced Credits. The shelf price is Rand-stable either way — the design choice is whether Vodacom's margin absorbs the FX move, or the Credits quota quietly buys more/fewer requests.",
  play: "Play",
  pause: "Pause",
  fx: "Spot USD/ZAR",
  planFx: "Planning FX",
  axis: "Rand per 1 USD",
  randStronger: "Rand stronger than plan",
  randWeaker: "Rand weaker than plan",
  basis: "Basis",
  utilisation: "assumed quota burn",
  inTok: "Input tokens / request",
  outTok: "Output tokens / request",
  aBadge: "Model A — Vodacom owns the FX",
  aTitle: "Fixed Credits anchor, fixed quota",
  aNote:
    "Anchor stays at the launch rate. The Rand cost of the USD bill moves with FX, so margin is the shock absorber.",
  bBadge: "Model B — end user owns the FX",
  bTitle: "Anchor re-pegged to hold target margin",
  bNote:
    "Credits per USD is retuned each period, so Rand profit lands on plan and the quota's real reach moves instead. Invisible on the bill.",
  userRequests: "Requests the quota buys",
  stable: "unchanged by FX",
  cost: "Vodacom cost (ZAR)",
  profit: "Vodacom gross profit",
  margin: "Gross margin",
  swingA: "Model A profit swing across the period",
  swingANote: "Per subscriber per month — this is the exposure Vodacom carries.",
  swingB: "Model B request swing across the period",
  swingBNote:
    "Per subscriber per month — the same exposure, expressed as purchasing power.",
  logicTitle: "How to run this conversation",
  logic: [
    "Both models keep the storefront in Rand. Neither shows a USD anchor or a margin figure to the subscriber.",
    "Model A is the customer-friendliest promise and the honest cost of it is a swinging margin — quantify it before committing.",
    "Model B holds margin flat by retuning the anchor; the subscriber still sees one Rand price and one Credits number, so the adjustment is not visible on the bill.",
    "A middle path usually wins: re-peg only outside a tolerance band (say ±5% FX), and publish Credits quotas rather than token counts so you keep the room to do it.",
    "Say the quiet part internally: Model B moves FX upside and downside onto the subscriber. Decide deliberately, document it, and keep the quota generous enough that the change stays below the noticeable threshold.",
  ],
  note: "Illustrative FX path shaped on published Rand-per-USD ranges — for customer storytelling, not a live market feed. Quota burn is inferred so the anchor and the design margin agree at the planning rate.",
};

const ZH: Copy = {
  title: "6 · 汇率风险：谁来承担，代价多大",
  subtitle:
    "华为云 MaaS 以美元计价；Vodacom 以兰特与华为云结算，再以兰特套餐售给终端用户。两种设计下前台标价都是兰特稳定的，真正的选择是：让 Vodacom 的毛利吸收汇率波动，还是让同样的 Credits 额度悄悄买到更多/更少的请求。",
  play: "播放",
  pause: "暂停",
  fx: "即期 USD/ZAR",
  planFx: "规划汇率",
  axis: "1 美元兑兰特",
  randStronger: "兰特强于规划值",
  randWeaker: "兰特弱于规划值",
  basis: "测算基准",
  utilisation: "假设额度消耗率",
  inTok: "每请求输入 Token",
  outTok: "每请求输出 Token",
  aBadge: "模式 A — Vodacom 承担汇率",
  aTitle: "锚定固定、额度固定",
  aNote:
    "Credits 锚点保持发布时的汇率。美元账单折算成兰特随汇率变化，毛利成为缓冲垫。",
  bBadge: "模式 B — 终端用户承担汇率",
  bTitle: "按目标毛利重新锚定",
  bNote:
    "每期重设每美元 Credits，兰特利润回到计划值，波动改由额度的实际可用量吸收，账单上看不出来。",
  userRequests: "该额度可支撑的请求数",
  stable: "不受汇率影响",
  cost: "Vodacom 成本（兰特）",
  profit: "Vodacom 毛利额",
  margin: "毛利率",
  swingA: "模式 A 期内毛利波动区间",
  swingANote: "单用户单月 —— 这就是 Vodacom 实际承担的敞口。",
  swingB: "模式 B 期内请求数波动区间",
  swingBNote: "单用户单月 —— 同样的敞口，换成购买力来表达。",
  logicTitle: "跟客户怎么谈",
  logic: [
    "两种模式的前台都是纯兰特：不出现美元锚点，也不出现毛利数字。",
    "模式 A 对用户最友好，代价是毛利随汇率摆动 —— 先把这个敞口算清楚再承诺。",
    "模式 B 通过重设锚点稳住毛利；用户看到的仍是一个兰特价格和一个 Credits 数字，调整不体现在账单上。",
    "通常折中方案最实用：设置容忍带（例如汇率 ±5%）之外才重设锚点，并且对外只公布 Credits 额度而非 Token 数，保留调整空间。",
    "内部要把话说透：模式 B 把汇率的红利与风险一并转给用户。这个决定要有意识地做、留档，并把额度留足，让调整幅度低于用户可感知的阈值。",
  ],
  note: "汇率路径依据公开的兰特兑美元区间构造，仅用于客户讲解，非实时行情。额度消耗率由锚点与设计毛利在规划汇率下反推得到，保证两者自洽。",
};
