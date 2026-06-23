"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type FontSize = 0 | 1 | 2;
type A11yPrefs = {
  fontSize: FontSize;
  highContrast: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  noAnimations: boolean;
  grayscale: boolean;
};

const STORAGE_KEY = "7winds-a11y-prefs";

const DEFAULT_PREFS: A11yPrefs = {
  fontSize: 0,
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  noAnimations: false,
  grayscale: false,
};

function loadPrefs(): A11yPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyPrefs(prefs: A11yPrefs) {
  const root = document.documentElement;
  root.dataset.a11yFont = String(prefs.fontSize);
  root.dataset.a11yHighContrast = prefs.highContrast ? "1" : "0";
  root.dataset.a11yHighlightLinks = prefs.highlightLinks ? "1" : "0";
  root.dataset.a11yReadableFont = prefs.readableFont ? "1" : "0";
  root.dataset.a11yNoAnimations = prefs.noAnimations ? "1" : "0";
  root.dataset.a11yGrayscale = prefs.grayscale ? "1" : "0";
}

export default function AccessibilityWidget() {
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const saved = loadPrefs();
    setPrefs(saved);
    applyPrefs(saved);
  }, []);

  const update = useCallback((next: Partial<A11yPrefs>) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...next };
      applyPrefs(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const reset = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    applyPrefs(DEFAULT_PREFS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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

  const toggle = (key: keyof Omit<A11yPrefs, "fontSize">) => {
    update({ [key]: !prefs[key] });
  };

  return (
    <div
      className="fixed bottom-4 start-4 z-[9999] flex flex-col items-start gap-2"
      dir="rtl"
      lang="he"
    >
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="תפריט נגישות"
          className="w-72 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden"
        >
          <div className="bg-brand-sky text-white px-4 py-3 flex items-center justify-between">
            <h2 className="font-display font-bold text-base">נגישות</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="סגירת תפריט נגישות"
            >
              ✕
            </button>
          </div>

          <div className="p-3 space-y-2 text-sm">
            <fieldset className="space-y-2">
              <legend className="font-semibold text-brand-dark px-1">גודל טקסט</legend>
              <div className="flex gap-2">
                <A11yButton
                  active={prefs.fontSize === 1}
                  onClick={() => update({ fontSize: prefs.fontSize === 1 ? 0 : 1 })}
                  label="הגדלת טקסט"
                >
                  A+
                </A11yButton>
                <A11yButton
                  active={prefs.fontSize === 2}
                  onClick={() => update({ fontSize: prefs.fontSize === 2 ? 0 : 2 })}
                  label="הגדלה נוספת"
                >
                  A++
                </A11yButton>
                <A11yButton
                  active={prefs.fontSize === 0}
                  onClick={() => update({ fontSize: 0 })}
                  label="איפוס גודל טקסט"
                >
                  A
                </A11yButton>
              </div>
            </fieldset>

            <A11yToggle
              active={prefs.highContrast}
              onClick={() => toggle("highContrast")}
              label="ניגודיות גבוהה"
            />
            <A11yToggle
              active={prefs.highlightLinks}
              onClick={() => toggle("highlightLinks")}
              label="הדגשת קישורים"
            />
            <A11yToggle
              active={prefs.readableFont}
              onClick={() => toggle("readableFont")}
              label="גופן קריא"
            />
            <A11yToggle
              active={prefs.noAnimations}
              onClick={() => toggle("noAnimations")}
              label="עצירת אנימציות"
            />
            <A11yToggle
              active={prefs.grayscale}
              onClick={() => toggle("grayscale")}
              label="גווני אפור"
            />

            <button
              type="button"
              onClick={reset}
              className="w-full mt-2 rounded-xl border border-brand-dark/20 px-3 py-2 font-semibold text-brand-dark hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
            >
              איפוס הגדרות
            </button>

            <a
              href="/accessibility-statement"
              className="block text-center text-xs text-brand-sky hover:underline pt-1"
            >
              הצהרת נגישות
            </a>
          </div>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-sky text-white text-2xl shadow-xl hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-sky/40"
      >
        ♿
      </button>
    </div>
  );
}

function A11yButton({
  children,
  active,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex-1 rounded-xl px-2 py-2 font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky ${
        active
          ? "bg-brand-sky text-white"
          : "bg-brand-soft text-brand-dark hover:bg-brand-sky/10"
      }`}
    >
      {children}
    </button>
  );
}

function A11yToggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-2.5 text-start font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky ${
        active
          ? "bg-brand-green/15 text-brand-black ring-1 ring-brand-green/40"
          : "bg-brand-soft text-brand-dark hover:bg-brand-sky/10"
      }`}
    >
      {active ? "✓ " : ""}
      {label}
    </button>
  );
}
