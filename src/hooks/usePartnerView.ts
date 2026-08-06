"use client";

import { useCallback, useEffect, useState } from "react";

export const PARTNER_VIEW_KEY = "vodacom-partner-view";

/**
 * Hidden switch between end-customer storefront and Vodacom-partner preview.
 * Unlock: Alt+Shift+P, or 5× click the demo disclaimer.
 */
export function usePartnerView() {
  const [unlocked, setUnlocked] = useState(false);
  const [partnerView, setPartnerView] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PARTNER_VIEW_KEY);
      if (raw === "1" || raw === "0") {
        setUnlocked(true);
        setPartnerView(raw === "1");
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setUnlocked(true);
        setPartnerView((v) => {
          const next = !v;
          try {
            localStorage.setItem(PARTNER_VIEW_KEY, next ? "1" : "0");
          } catch {
            /* ignore */
          }
          return next;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const persist = useCallback((next: boolean) => {
    setPartnerView(next);
    setUnlocked(true);
    try {
      localStorage.setItem(PARTNER_VIEW_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const registerSecretClick = useCallback(() => {
    setClicks((c) => {
      const n = c + 1;
      if (n >= 5) {
        setUnlocked(true);
        return 0;
      }
      return n;
    });
  }, []);

  return {
    unlocked,
    partnerView,
    setPartnerView: persist,
    registerSecretClick,
  };
}
