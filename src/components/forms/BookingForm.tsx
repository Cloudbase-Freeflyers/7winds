"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import GiftVoucherBanner from "@/components/GiftVoucherBanner";
import {
  DEV_TEST_PACKAGE,
  VOUCHER_PACKAGES,
  type ProductPackage,
} from "@/lib/constants";
import { useAffiliateCode } from "@/context/AffiliateContext";

type State = "idle" | "submitting" | "error";
type BookingAudience = "solo" | "group";

export default function BookingForm({
  includeTestPackage = false,
}: {
  includeTestPackage?: boolean;
}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [audience, setAudience] = useState<BookingAudience>("solo");
  const affiliateCode = useAffiliateCode();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      type: "direct" as const,
      package: String(fd.get("package") || "") as ProductPackage,
      buyerName: String(fd.get("buyerName") || "").trim(),
      buyerPhone: String(fd.get("buyerPhone") || "").trim(),
      buyerEmail: String(fd.get("buyerEmail") || "").trim(),
      bookingAudience: audience,
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

      {/* Solo / Group toggle */}
      <fieldset className="mb-5">
        <legend className="block text-sm font-bold text-brand-black mb-2">
          למי הטיסה?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <AudienceOption
            id="audience-solo"
            label="בשבילי"
            sub="טיסה אישית"
            emoji="🪂"
            checked={audience === "solo"}
            onChange={() => setAudience("solo")}
          />
          <AudienceOption
            id="audience-group"
            label="קבוצה"
            sub="מספר משתתפים"
            emoji="👥"
            checked={audience === "group"}
            onChange={() => setAudience("group")}
          />
        </div>
        {audience === "group" && (
          <p className="mt-2 text-xs text-brand-dark">
            תשלום קבוצתי — ניצור איתכם קשר לתיאום מספר המשתתפים לאחר הרכישה.
          </p>
        )}
      </fieldset>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-bold text-brand-black mb-1.5">
            איזה מסלול?
          </label>
          <select
            name="package"
            required
            defaultValue=""
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

function AudienceOption({
  id,
  label,
  sub,
  emoji,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  sub: string;
  emoji: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 transition ${
        checked
          ? "border-brand-sky bg-brand-sky/10 ring-2 ring-brand-sky/20"
          : "border-black/10 bg-white hover:border-brand-sky/40"
      }`}
    >
      <input
        id={id}
        type="radio"
        name="audience"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span>
        <span className="block font-bold text-brand-black">{label}</span>
        <span className="block text-xs text-brand-dark">{sub}</span>
      </span>
    </label>
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
