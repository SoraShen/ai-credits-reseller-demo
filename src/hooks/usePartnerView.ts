"use client";

import { brand } from "@/lib/brand";
import { useCallback, useRef, useSyncExternalStore } from "react";

export const PARTNER_VIEW_KEY = `${brand.id}-partner-view`;

interface PartnerState {
  unlocked: boolean;
  partnerView: boolean;
}

const SERVER_STATE: PartnerState = { unlocked: false, partnerView: false };

let snapshot: PartnerState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function publish(next: PartnerState) {
  snapshot = next;
  for (const listener of listeners) listener();
}

function write(next: PartnerState) {
  try {
    localStorage.setItem(PARTNER_VIEW_KEY, next.partnerView ? "1" : "0");
  } catch {
    /* private mode — session-only toggle is fine */
  }
  publish(next);
}

function onKey(e: KeyboardEvent) {
  if (e.altKey && e.shiftKey && e.key.toLowerCase() === "p") {
    e.preventDefault();
    write({ unlocked: true, partnerView: !snapshot.partnerView });
  }
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    try {
      const raw = localStorage.getItem(PARTNER_VIEW_KEY);
      if (raw === "1" || raw === "0") {
        snapshot = { unlocked: true, partnerView: raw === "1" };
      }
    } catch {
      /* ignore */
    }
  }
  if (listeners.size === 0) window.addEventListener("keydown", onKey);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("keydown", onKey);
  };
}

/**
 * Hidden switch between the end-customer storefront and the partner preview.
 */
export function usePartnerView() {
  const state = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => SERVER_STATE
  );
  const clicks = useRef(0);

  const setPartnerView = useCallback((next: boolean) => {
    write({ unlocked: true, partnerView: next });
  }, []);

  const registerSecretClick = useCallback(() => {
    clicks.current += 1;
    if (clicks.current >= 5) {
      clicks.current = 0;
      publish({ ...snapshot, unlocked: true });
    }
  }, []);

  return {
    unlocked: state.unlocked,
    partnerView: state.partnerView,
    setPartnerView,
    registerSecretClick,
  };
}
