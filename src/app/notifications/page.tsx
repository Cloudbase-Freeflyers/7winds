"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

export default function NotificationSubscribePage() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
    };

    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שליחה נכשלה");
      setMessage(data.message || "הבקשה נשלחה.");
      setState("success");
      e.currentTarget.reset();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "שגיאה");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen bg-brand-soft px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 ring-1 ring-black/5 shadow-sm">
        <h1 className="font-display text-2xl font-extrabold text-brand-black">
          התראות על לידים
        </h1>
        <p className="mt-2 text-sm text-brand-dark">
          בקשו לקבל אימייל על פניות חדשות מהאתר (כולל לידים מקמפיינים ושותפים).
          הבקשה דורשת אישור מנהל.
        </p>

        {state === "success" ? (
          <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-900 text-sm">
            {message}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-1">
                שם
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                className="w-full rounded-xl border border-black/10 px-4 py-3"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">
                אימייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-black/10 px-4 py-3"
                autoComplete="email"
                dir="ltr"
              />
            </div>
            {state === "error" && message && (
              <p className="text-sm text-red-600">{message}</p>
            )}
            <button
              type="submit"
              disabled={state === "submitting"}
              className="btn-primary btn-md w-full"
            >
              {state === "submitting" ? "שולח…" : "שליחת בקשה"}
            </button>
          </form>
        )}

        {state === "success" && (
          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-4 btn-secondary btn-sm w-full"
          >
            בקשה נוספת
          </button>
        )}
      </div>
    </main>
  );
}
