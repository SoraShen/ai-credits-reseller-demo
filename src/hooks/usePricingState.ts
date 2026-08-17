"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  PRICING_EVENT,
  STORAGE_KEY,
  loadPricingState,
  savePricingState,
} from "@/lib/pricing/storage";
import type { PricingState } from "@/lib/pricing/types";
import { DEFAULT_STATE } from "@/lib/pricing/templates";

// getSnapshot must be referentially stable, so re-parse only when the raw
// localStorage value actually changed.
let cachedRaw: string | null | undefined;
let cachedState: PricingState = DEFAULT_STATE;

function getSnapshot(): PricingState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = loadPricingState();
  }
  return cachedState;
}

function subscribe(listener: () => void) {
  window.addEventListener(PRICING_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(PRICING_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

const noopSubscribe = () => () => {};

export function usePricingState() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULT_STATE
  );
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const update = useCallback((next: PricingState) => {
    savePricingState(next);
  }, []);

  return { state, update, ready };
}
