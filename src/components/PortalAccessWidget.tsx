"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type SessionState = {
  admin: { loggedIn: boolean; email?: string };
  affiliate: { loggedIn: boolean; name?: string | null };
};

const EMPTY_SESSION: SessionState = {
  admin: { loggedIn: false },
  affiliate: { loggedIn: false },
};

export default function PortalAccessWidget() {
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<SessionState>(EMPTY_SESSION);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/session", { credentials: "include" });
      if (!res.ok) throw new Error("session fetch failed");
      setSession(await res.json());
    } catch {
      setSession(EMPTY_SESSION);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function affiliateLogout() {
    await fetch("/api/affiliate/logout", { method: "POST", credentials: "include" });
    await refresh();
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[9998] flex flex-col items-start gap-2"
      dir="rtl"
      lang="he"
    >
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "סגירת כניסה לפורטלים" : "פתיחת כניסה לפורטלים"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-black text-white text-lg shadow-xl hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-black/30"
      >
        🔐
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="כניסה לפורטלים"
          className="w-64 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden"
        >
          <div className="bg-brand-black text-white px-4 py-3 flex items-center justify-between">
            <h2 className="font-display font-bold text-sm">כניסה לפורטלים</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="סגירה"
            >
              ✕
            </button>
          </div>

          <div className="p-3 space-y-3 text-sm">
            {loading ? (
              <p className="text-brand-dark text-center py-2">טוען…</p>
            ) : (
              <>
                <PortalSection
                  title="ניהול"
                  subtitle={
                    session.admin.loggedIn
                      ? session.admin.email || "מחובר"
                      : "לא מחובר"
                  }
                  loggedIn={session.admin.loggedIn}
                  dashboardHref="/admin"
                  loginHref="/admin/login"
                  onLogout={null}
                />

                <PortalSection
                  title="שותפים"
                  subtitle={
                    session.affiliate.loggedIn
                      ? session.affiliate.name || "מחובר"
                      : "לא מחובר"
                  }
                  loggedIn={session.affiliate.loggedIn}
                  dashboardHref="/affiliate/dashboard"
                  loginHref="/affiliate/login"
                  onLogout={affiliateLogout}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PortalSection({
  title,
  subtitle,
  loggedIn,
  dashboardHref,
  loginHref,
  onLogout,
}: {
  title: string;
  subtitle: string;
  loggedIn: boolean;
  dashboardHref: string;
  loginHref: string;
  onLogout: (() => void | Promise<void>) | null;
}) {
  return (
    <div className="rounded-xl bg-brand-soft p-3">
      <p className="font-display font-extrabold text-brand-black">{title}</p>
      <p className="mt-0.5 text-xs text-brand-dark truncate">{subtitle}</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {loggedIn ? (
          <>
            <Link href={dashboardHref} className="btn-primary btn-sm flex-1 text-center">
              לוח בקרה
            </Link>
            {onLogout ? (
              <button
                type="button"
                onClick={() => void onLogout()}
                className="btn-secondary btn-sm flex-1"
              >
                יציאה
              </button>
            ) : (
              <form action="/api/admin/auth/logout" method="POST" className="flex-1">
                <button type="submit" className="btn-secondary btn-sm w-full">
                  יציאה
                </button>
              </form>
            )}
          </>
        ) : (
          <Link href={loginHref} className="btn-primary btn-sm w-full text-center">
            כניסה
          </Link>
        )}
      </div>
    </div>
  );
}
