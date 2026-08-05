"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadPricingState,
  savePricingState,
} from "@/lib/pricing/storage";
import type { PricingState } from "@/lib/pricing/types";
import { DEFAULT_STATE } from "@/lib/pricing/templates";

export function usePricingState() {
  const [state, setState] = useState<PricingState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadPricingState());
    setReady(true);
    const onUpdate = () => setState(loadPricingState());
    window.addEventListener("vodacom-pricing-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("vodacom-pricing-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const update = useCallback((next: PricingState) => {
    setState(next);
    savePricingState(next);
  }, []);

  return { state, update, ready };
}
