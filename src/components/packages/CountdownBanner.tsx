"use client";

import { useEffect, useState } from "react";
import type { PricingParams } from "@/lib/pricing/types";

function parts(ms: number) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, h, m, s };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex min-w-[2.4rem] flex-col items-center rounded-md bg-white/15 px-1.5 py-0.5">
      <span className="font-mono text-sm font-bold leading-none tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] uppercase opacity-80">{label}</span>
    </span>
  );
}

export function CountdownBanner({ params }: { params: PricingParams }) {
  const [left, setLeft] = useState(() =>
    new Date(params.promoEndsAt).getTime() - Date.now()
  );

  useEffect(() => {
    const tick = () =>
      setLeft(new Date(params.promoEndsAt).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [params.promoEndsAt]);

  const p = parts(left);
  const active = left > 0;
  const off = Math.round((1 - params.promoDiscount) * 100);

  return (
    <div className="bg-[#e60000] text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-2.5 text-center sm:flex-row sm:gap-4">
        <p className="text-[13px] font-semibold">
          ⚡ {params.promoLabelEn}
          {active ? (
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">
              {off}% Off
            </span>
          ) : (
            <span className="ml-2 text-[11px] opacity-90">Ended</span>
          )}
        </p>
        {active ? (
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="opacity-90">Ends in</span>
            {p.d > 0 ? <Cell value={p.d} label="Day" /> : null}
            <Cell value={p.h} label="Hr" />
            <span className="font-bold opacity-70">:</span>
            <Cell value={p.m} label="Min" />
            <span className="font-bold opacity-70">:</span>
            <Cell value={p.s} label="Sec" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
