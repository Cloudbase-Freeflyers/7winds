"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { useAffiliateCode } from "@/context/AffiliateContext";
import { VOUCHER_OCCASIONS, VOUCHER_PACKAGES } from "@/lib/constants";

type State = "idle" | "submitting" | "error";

export default function VoucherForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const affiliateCode = useAffiliateCode();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      type: "voucher" as const,
      buyerName: String(fd.get("buyerName") || "").trim(),
      buyerPhone: String(fd.get("buyerPhone") || "").trim(),
      buyerEmail: String(fd.get("buyerEmail") || "").trim(),
      recipientName: String(fd.get("recipientName") || "").trim(),
      occasion: String(fd.get("occasion") || "").trim(),
      package: String(fd.get("package") || ""),
      notes: String(fd.get("notes") || "").trim(),
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
      className="relative rounded-3xl overflow-hidden shadow-xl flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #faf6ee 0%, #f5efe3 100%)",
        border: "2px solid rgba(180,140,80,0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
      noValidate
    >
      {/* Perforated ticket edge */}
      <div
        className="relative h-3 shrink-0"
        style={{
          background: "repeating-linear-gradient(90deg, #1ABBEF 0 8px, transparent 8px 16px)",
          opacity: 0.35,
        }}
        aria-hidden
      />
      <div className="absolute top-1.5 start-4 end-4 flex justify-between pointer-events-none" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-brand-soft" />
        ))}
      </div>

      <div className="px-7 sm:px-8 pt-5 pb-7 sm:pb-8 flex flex-col flex-1">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #fde68a, #f59e0b)" }}
          >
            🎁
          </span>
          <div>
            <h3 className="font-display text-xl font-extrabold text-brand-black">
              רכישת שובר מתנה
            </h3>
            <p className="text-xs text-brand-dark mt-0.5">
              מלאו את הפרטים — ונפיק עבורכם שובר אישי
            </p>
          </div>
        </div>

      <div className="mt-5 grid gap-4 flex-1">
        <div>
          <label className="block text-sm font-bold text-brand-black mb-1.5">
            איזה מסלול לכלול בשובר?
          </label>
          <select
            name="package"
            required
            defaultValue=""
            className="w-full rounded-xl border border-[#d4c4a8]/60 bg-white/90 px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
          >
            <option value="" disabled>
              בחרו מסלול…
            </option>
            {VOUCHER_PACKAGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
          <Input
            label="השם שלכם"
            name="buyerName"
            required
            autoComplete="name"
            placeholder="ישראל ישראלי"
          />
          <Input
            label="טלפון"
            name="buyerPhone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="050-0000000"
          />
        </div>

        <Input
          label="אימייל (לקבלה)"
          name="buyerEmail"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
          <Input
            label="שם המקבל/ת (לא חובה)"
            name="recipientName"
            placeholder="למי השובר?"
          />
          <div>
            <label className="block text-sm font-bold text-brand-black mb-1.5">
              לאיזו הזדמנות?
            </label>
            <select
              name="occasion"
              defaultValue=""
              className="w-full rounded-xl border border-[#d4c4a8]/60 bg-white/90 px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
            >
              <option value="">— לא רלוונטי —</option>
              {VOUCHER_OCCASIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-black mb-1.5">
            הערות נוספות
          </label>
          <textarea
            name="notes"
            rows={3}
            maxLength={1000}
            className="w-full rounded-xl border border-[#d4c4a8]/60 bg-white/90 px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
            placeholder="נשמח לדעת כל פרט שיעזור לנו להפוך את המתנה למושלמת."
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-6 btn-secondary btn-lg w-full"
      >
        {state === "submitting" ? "מעביר לתשלום…" : "המשך לתשלום מאובטח 🎁"}
      </button>
      </div>
    </form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-bold text-brand-black mb-1.5">
        {label}
      </label>
      <input
        {...rest}
        className="w-full rounded-xl border border-[#d4c4a8]/60 bg-white/90 px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
      />
    </div>
  );
}
