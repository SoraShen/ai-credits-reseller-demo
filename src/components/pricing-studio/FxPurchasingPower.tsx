"use client";

import { useEffect, useMemo, useState } from "react";
import { creditsForCall, formatCredits } from "@/lib/pricing/formulas";
import { USD_ZAR_QUARTERS, fxRange } from "@/lib/pricing/fxHistory";
import type { ModelCost, PackageRow, PricingParams } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

/**
 * Vodacom story: Huawei MaaS is USD-priced; Vodacom settles in ZAR and resells
 * ZAR-priced Credits. End users keep a stable Rand shelf price; FX risk sits
 * with the reseller (not the subscriber bill).
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
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % points.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [playing, points.length]);

  const callCredits = useMemo(
    () => creditsForCall(model, inputTok, outputTok, params.creditsPerUsd),
    [model, inputTok, outputTok, params.creditsPerUsd]
  );

  const current = points[idx];
  const usdPerCall =
    (inputTok / 1e6) * model.inputPrice + (outputTok / 1e6) * model.outputPrice;
  const usdPerCallTier = usdPerCall * model.tierCoeff;

  // Stable Credits package: requests ≈ credits / callCredits
  const zarPackRequests = Math.floor(pkg.credits / callCredits);

  // If end user paid Huawei USD API converted at spot FX with same Rand budget:
  const spotZarPerCall = usdPerCallTier * current.usdZar;
  const spotRequests =
    spotZarPerCall > 0 ? Math.floor(pkg.monthlyPrice / spotZarPerCall) : 0;

  const pad = max - min || 1;
  const y = (v: number) => 100 - ((v - min) / pad) * 80 - 10;
  const x = (i: number) => (i / (points.length - 1)) * 100;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(p.usdZar).toFixed(2)}`)
    .join(" ");

  const copy =
    lang === "zh"
      ? {
          title: "6 · 汇率波动与 Credits 购买力",
          subtitle:
            "华为云 MaaS 官网以美元计价；Vodacom 以兰特向华为云结算，再以兰特套餐卖给终端用户。套餐标价锁定兰特，用户不必盯汇率。",
          play: "播放",
          pause: "暂停",
          fx: "当期 USD/ZAR",
          pack: "Vodacom Credits 套餐（兰特标价固定）",
          spot: "若按美元 API×即期汇率直付（对比）",
          reqs: "约可调用次数",
          note: "示意数据基于 FRED 年度均价插值季度路径，仅用于客户讲解，非实时行情。",
          logicTitle: "给客户怎么讲",
          logic: [
            "终端只看兰特：套餐价、Credits 额度、可调用次数。",
            "毛利率 / 美元锚点是运营商内部指标，不进 C 端页面。",
            "汇率波动由 Vodacom 在批发侧消化；必要时调 Credits 供给或促销，而不是让用户账单随美元跳动。",
          ],
          inTok: "每请求输入 Token",
          outTok: "每请求输出 Token",
        }
      : {
          title: "6 · FX volatility & Credits purchasing power",
          subtitle:
            "Huawei Cloud MaaS is priced in USD. Vodacom settles Huawei in ZAR and resells ZAR packages to end users — so subscribers see stable Rand pricing, not FX swings.",
          play: "Play",
          pause: "Pause",
          fx: "Spot USD/ZAR",
          pack: "Vodacom Credits pack (fixed Rand shelf price)",
          spot: "If billed as USD API × spot FX (contrast)",
          reqs: "Approx. requests",
          note: "Illustrative path interpolated from Fed annual averages (FRED AEXSFUS) — for customer storytelling, not a live feed.",
          logicTitle: "How to explain it",
          logic: [
            "End users only see Rand: package price, Credits quota, usable requests.",
            "Gross margin and USD anchors stay in Pricing Studio / partner view — not on the consumer storefront.",
            "FX moves are absorbed on the wholesale side; Vodacom can retune Credits economics without making bills FX-volatile.",
          ],
          inTok: "Input tokens / request",
          outTok: "Output tokens / request",
        };

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-lg font-extrabold">{copy.title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{copy.subtitle}</p>

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
        Example pack: <strong>{pkg.name}</strong> R{pkg.monthlyPrice} /{" "}
        {formatCredits(pkg.credits)} Credits · Model{" "}
        <strong>{model.name}</strong> · ~{Math.round(callCredits).toLocaleString("en-ZA")}{" "}
        Credits / request
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <svg viewBox="0 0 100 110" className="h-48 w-full overflow-visible">
            <path
              d={path}
              fill="none"
              stroke="#e60000"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            {points.map((p, i) => (
              <circle
                key={p.t}
                cx={x(i)}
                cy={y(p.usdZar)}
                r={i === idx ? 1.8 : 0.9}
                className={cn(i === idx ? "fill-[#e60000]" : "fill-[#cfcfcf]")}
              />
            ))}
            <text x="2" y="8" className="fill-[#667085] text-[3px]">
              USD/ZAR ↑
            </text>
            <text x="2" y="108" className="fill-[#667085] text-[3px]">
              {points[0]?.label}
            </text>
            <text x="78" y="108" className="fill-[#667085] text-[3px]">
              {points[points.length - 1]?.label}
            </text>
          </svg>
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
            {current.label}: {copy.fx}{" "}
            <span className="text-[#e60000]">{current.usdZar.toFixed(2)}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-[#e8f8ef] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#0b7a3e]">
              {copy.pack}
            </p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-[#0b7a3e]">
              {zarPackRequests.toLocaleString("en-ZA")}
            </p>
            <p className="text-xs text-muted-foreground">{copy.reqs}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Stable — Credits quota does not move with this quarter&apos;s FX
              in the demo model.
            </p>
          </div>
          <div className="rounded-xl bg-[#fff1f1] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#e60000]">
              {copy.spot}
            </p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-[#e60000]">
              {spotRequests.toLocaleString("en-ZA")}
            </p>
            <p className="text-xs text-muted-foreground">{copy.reqs}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Moves with USD/ZAR — same Rand budget buys fewer/more USD API calls.
            </p>
          </div>
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
