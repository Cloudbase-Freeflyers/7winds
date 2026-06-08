"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

const STORAGE_KEY = "7winds_aff";
const VISIT_KEY = "7winds_aff_visit";

export interface AffiliateInfo {
  id: string;
  code: string;
  name: string;
}

interface AffiliateContextValue {
  affiliate: AffiliateInfo | null;
}

const AffiliateContext = createContext<AffiliateContextValue>({ affiliate: null });

export function AffiliateProvider({
  affiliate,
  children,
}: {
  affiliate: AffiliateInfo | null;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!affiliate) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(affiliate));
    } catch {
      // ignore storage errors
    }

    const visitFlag = `${VISIT_KEY}:${affiliate.code}`;
    try {
      if (sessionStorage.getItem(visitFlag)) return;
      sessionStorage.setItem(visitFlag, "1");
    } catch {
      // continue to log visit even if flag fails
    }

    fetch("/api/affiliates/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: affiliate.code }),
    }).catch(() => {});
  }, [affiliate]);

  const value = useMemo(() => ({ affiliate }), [affiliate]);

  return (
    <AffiliateContext.Provider value={value}>{children}</AffiliateContext.Provider>
  );
}

export function useAffiliate() {
  return useContext(AffiliateContext).affiliate;
}

export function getStoredAffiliate(): AffiliateInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AffiliateInfo;
    if (parsed?.code && parsed?.id) return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function useAffiliateCode(): string | null {
  const ctx = useAffiliate();
  if (ctx?.code) return ctx.code;
  const stored = getStoredAffiliate();
  return stored?.code ?? null;
}
