"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import GiftVoucherBanner from "@/components/GiftVoucherBanner";
import {
  calculateBookingPrice,
  formatNis,
  getBookingAudience,
  MAX_FLIGHT_COUNT,
} from "@/lib/booking-pricing";
import {
  DEV_TEST_PACKAGE,
  VOUCHER_PACKAGES,
  type ProductPackage,
} from "@/lib/constants";
import { useAffiliateCode } from "@/context/AffiliateContext";

type State = "idle" | "submitting" | "error";

export default function BookingForm({
  includeTestPackage = false,
}: {
  includeTestPackage?: boolean;
}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [flightCount, setFlightCount] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | "">("");
  const affiliateCode = useAffiliateCode();

  const audience = getBookingAudience(flightCount);

  const pricing = useMemo(() => {
    if (!selectedPackage) return null;
    return calculateBookingPrice(selectedPackage, flightCount);
  }, [selectedPackage, flightCount]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const pkg = String(fd.get("package") || "") as ProductPackage;
    const count = Number(fd.get("flightCount") || flightCount);
    const payload = {
      type: "direct" as const,
      package: pkg,
      flightCount: count,
      buyerName: String(fd.get("buyerName") || "").trim(),
      buyerPhone: String(fd.get("buyerPhone") || "").trim(),
      buyerEmail: String(fd.get("buyerEmail") || "").trim(),
      bookingAudience: getBookingAudience(count),
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
      track.voucher(payload.package, affiliateCode ?? undefined);
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא צפויה");
      setState("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-brand-soft ring-1 ring-black/5 p-7 sm:p-8 shadow-sm"
      noValidate
    >
      <GiftVoucherBanner className="mb-5" />

      <div className="mb-5">
        <label
          htmlFor="flightCount"
          className="block text-sm font-bold text-brand-black mb-1.5"
        >
          כמה טיסות?
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="הפחת כמות"
            disabled={flightCount <= 1}
            onClick={() => setFlightCount((n) => Math.max(1, n - 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-lg font-bold text-brand-black transition hover:border-brand-sky disabled:opacity-40"
          >
            −
          </button>
          <input
            id="flightCount"
            name="flightCount"
            type="number"
            min={1}
            max={MAX_FLIGHT_COUNT}
            value={flightCount}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n)) {
                setFlightCount(Math.min(MAX_FLIGHT_COUNT, Math.max(1, n)));
              }
            }}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
          />
          <button
            type="button"
            aria-label="הוסף כמות"
            disabled={flightCount >= MAX_FLIGHT_COUNT}
            onClick={() =>
              setFlightCount((n) => Math.min(MAX_FLIGHT_COUNT, n + 1))
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-lg font-bold text-brand-black transition hover:border-brand-sky disabled:opacity-40"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-xs text-brand-dark">
          {audience === "solo" ? (
            <>
              <span className="font-bold text-brand-sky">טיסה אישית</span> — 1–2
              טיסות ללא הנחה
            </>
          ) : (
            <>
              <span className="font-bold text-brand-sky">הזמנה קבוצתית</span> —
              מ-3 טיסות: צילום חינם לכל טיסה + הנחות נוספות
            </>
          )}
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-bold text-brand-black mb-1.5">
            איזה מסלול?
          </label>
          <select
            name="package"
            required
            value={selectedPackage}
            onChange={(e) =>
              setSelectedPackage(e.target.value as ProductPackage | "")
            }
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
          >
            <option value="" disabled>
              בחרו מסלול…
            </option>
            {includeTestPackage && (
              <option value={DEV_TEST_PACKAGE.value}>{DEV_TEST_PACKAGE.label}</option>
            )}
            {VOUCHER_PACKAGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {pricing && (flightCount >= 2 || pricing.videoDiscount > 0 || pricing.percentDiscount > 0) && (
          <PriceSummary pricing={pricing} />
        )}

        <Field
          label="שם מלא"
          name="buyerName"
          placeholder="ישראל ישראלי"
          required
          autoComplete="name"
        />
        <Field
          label="טלפון"
          name="buyerPhone"
          type="tel"
          placeholder="050-0000000"
          required
          autoComplete="tel"
          inputMode="tel"
        />
        <Field
          label="אימייל (לקבלה)"
          name="buyerEmail"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-6 btn-primary btn-lg w-full"
      >
        {state === "submitting"
          ? "מעביר לתשלום…"
          : audience === "group"
            ? "המשך לתשלום קבוצתי 🔒"
            : "המשך לתשלום מאובטח 🔒"}
      </button>

      <p className="mt-3 text-xs text-brand-dark/70 text-center">
        בלחיצה על הכפתור תועברו לדף תשלום מאובטח. לאחר התשלום ניצור קשר לתיאום.
      </p>
    </form>
  );
}

function PriceSummary({
  pricing,
}: {
  pricing: ReturnType<typeof calculateBookingPrice>;
}) {
  return (
    <div className="rounded-2xl border border-brand-sky/20 bg-brand-sky/5 px-4 py-3 text-sm">
      <p className="font-bold text-brand-black mb-2">סיכום מחיר</p>
      <dl className="space-y-1 text-brand-dark">
        <div className="flex justify-between">
          <dt>
            מחיר בסיס ({pricing.flightCount}× {formatNis(pricing.unitPrice)})
          </dt>
          <dd>{formatNis(pricing.subtotal)}</dd>
        </div>
        {pricing.videoDiscount > 0 && (
          <div className="flex justify-between text-green-700">
            <dt>צילום חינם לכל טיסה</dt>
            <dd>−{formatNis(pricing.videoDiscount)}</dd>
          </div>
        )}
        {pricing.percentDiscount > 0 && (
          <div className="flex justify-between text-green-700">
            <dt>הנחה {Math.round(pricing.percentRate * 100)}%</dt>
            <dd>−{formatNis(pricing.percentDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-brand-sky/20 pt-2 font-bold text-brand-black">
          <dt>סה״כ לתשלום</dt>
          <dd>{formatNis(pricing.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

function Field({ label, ...rest }: FieldProps) {
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
