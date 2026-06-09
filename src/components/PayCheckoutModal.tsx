"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import {
  PACKAGE_PRICES,
  VOUCHER_PACKAGES,
  type VoucherPackage,
} from "@/lib/constants";
import { useAffiliateCode } from "@/context/AffiliateContext";

type State = "idle" | "submitting" | "error";

type Props = {
  packageKey: VoucherPackage;
  label?: string;
  className?: string;
  orderType?: "voucher" | "direct";
};

export default function PayCheckoutModal({
  packageKey,
  label = "שלמו עכשיו",
  className = "btn-secondary btn-sm",
  orderType = "direct",
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const affiliateCode = useAffiliateCode();

  const pkg = VOUCHER_PACKAGES.find((p) => p.value === packageKey);
  const amount = PACKAGE_PRICES[packageKey];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      type: orderType,
      package: packageKey,
      buyerName: String(fd.get("buyerName") || "").trim(),
      buyerPhone: String(fd.get("buyerPhone") || "").trim(),
      buyerEmail: String(fd.get("buyerEmail") || "").trim(),
      ...(affiliateCode ? { affiliateCode } : {}),
    };

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "שליחה נכשלה. נסו שוב.");
      track.voucher(packageKey, affiliateCode ?? undefined);
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא צפויה");
      setState("error");
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pay-modal-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="pay-modal-title"
                  className="font-display text-xl font-extrabold text-brand-black"
                >
                  המשך לתשלום מאובטח
                </h3>
                <p className="mt-1 text-sm text-brand-dark">
                  {pkg?.label ?? packageKey} · ₪{amount}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setState("idle");
                  setError(null);
                }}
                className="text-brand-dark/60 hover:text-brand-black text-xl leading-none"
                aria-label="סגור"
              >
                ×
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-5 grid gap-4">
              <Field
                label="שם מלא"
                name="buyerName"
                required
                autoComplete="name"
                placeholder="ישראל ישראלי"
              />
              <Field
                label="טלפון"
                name="buyerPhone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="050-0000000"
              />
              <Field
                label="אימייל (לקבלה)"
                name="buyerEmail"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />

              {error && (
                <p className="text-sm text-red-600 font-medium" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="btn-primary btn-lg w-full"
              >
                {state === "submitting" ? "מעביר לתשלום…" : "המשך ל-iCount 🔒"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-bold text-brand-black mb-1.5">
        {label}
      </label>
      <input
        {...rest}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
      />
    </div>
  );
}
