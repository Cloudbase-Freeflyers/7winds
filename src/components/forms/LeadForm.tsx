"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { useAffiliateCode } from "@/context/AffiliateContext";

type State = "idle" | "submitting" | "success" | "error";

export default function LeadForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const affiliateCode = useAffiliateCode();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      source: "contact" as const,
      ...(affiliateCode ? { affiliateCode } : {}),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "שליחה נכשלה. נסו שוב.");
      track.lead("contact", affiliateCode ?? undefined);
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
        <div className="text-5xl">🪂</div>
        <h3 className="mt-4 font-display text-2xl font-extrabold text-brand-black">
          תודה! קיבלנו את הפנייה.
        </h3>
        <p className="mt-2 text-brand-dark">
          נחזור אליכם בהקדם לתיאום הטיסה. בינתיים – אפשר לשמור את המספר שלנו 😊
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-6 btn-secondary btn-md"
        >
          לשלוח פנייה נוספת
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-brand-soft ring-1 ring-black/5 p-7 sm:p-8 shadow-sm"
      noValidate
    >
      <div className="grid gap-4">
        <Field
          label="שם מלא"
          name="name"
          placeholder="ישראל ישראלי"
          required
          autoComplete="name"
        />
        <Field
          label="טלפון"
          name="phone"
          type="tel"
          placeholder="050-0000000"
          required
          autoComplete="tel"
          inputMode="tel"
        />
        <div>
          <label className="block text-sm font-bold text-brand-black mb-1.5">
            הודעה (לא חובה)
          </label>
          <textarea
            name="message"
            rows={3}
            maxLength={1000}
            placeholder="ספרו לנו מתי תרצו לטוס, באיזה מקום, או כל דבר אחר…"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
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
        className="mt-6 btn-primary btn-lg w-full"
      >
        {state === "submitting" ? "שולח…" : "אני רוצה לטוס 🪂"}
      </button>

      <p className="mt-3 text-xs text-brand-dark/70 text-center">
        בלחיצה על הכפתור אתם מאשרים שניצור איתכם קשר לתיאום הטיסה.
      </p>
    </form>
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
