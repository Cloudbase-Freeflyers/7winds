"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { VOUCHER_OCCASIONS, VOUCHER_PACKAGES } from "@/lib/constants";

type State = "idle" | "submitting" | "success" | "error";

export default function VoucherForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      buyerName: String(fd.get("buyerName") || "").trim(),
      buyerPhone: String(fd.get("buyerPhone") || "").trim(),
      recipientName: String(fd.get("recipientName") || "").trim(),
      occasion: String(fd.get("occasion") || "").trim(),
      package: String(fd.get("package") || ""),
      notes: String(fd.get("notes") || "").trim(),
    };

    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "שליחה נכשלה. נסו שוב.");
      track.voucher(payload.package);
      setState("success");
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא צפויה");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-3xl bg-brand-soft ring-1 ring-black/5 p-8 text-center">
        <div className="text-5xl">🎁</div>
        <h3 className="mt-4 font-display text-2xl font-extrabold text-brand-black">
          קיבלנו את בקשת השובר!
        </h3>
        <p className="mt-2 text-brand-dark">
          ניצור איתכם קשר לאישור פרטי התשלום ושליחת השובר.
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-6 btn-secondary btn-md"
        >
          להזמין שובר נוסף
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-brand-soft ring-1 ring-black/5 p-7 sm:p-8 shadow-sm flex flex-col h-full"
      noValidate
    >
      <h3 className="font-display text-xl font-extrabold text-brand-black">
        בקשת שובר מתנה
      </h3>

      <div className="mt-5 grid gap-4 flex-1">
        <div>
          <label className="block text-sm font-bold text-brand-black mb-1.5">
            איזה מסלול לכלול בשובר?
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
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
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
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
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
        {state === "submitting" ? "שולח…" : "קנה שובר מתנה 🎁"}
      </button>
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
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
      />
    </div>
  );
}
