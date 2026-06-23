"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const errorCode = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errors: Record<string, string> = {
    not_allowed: "החשבון Google הזה לא מורשה לניהול.",
    invalid_oauth: "התחברות Google נכשלה — נסו שוב.",
    oauth_failed: "שגיאה בהתחברות Google.",
  };

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, next }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      window.location.href = data.next || next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-soft px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 ring-1 ring-black/5 shadow-sm">
        <h1 className="font-display text-2xl font-extrabold text-center">
          7Winds — כניסת ניהול
        </h1>
        <p className="mt-2 text-sm text-brand-dark text-center">
          התחברו עם Google (מומלץ) או עם סיסמת מנהל.
        </p>

        {(errorCode || error) && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
            {error || errors[errorCode!] || decodeURIComponent(errorCode!)}
          </div>
        )}

        <a
          href={`/api/admin/auth/google?next=${encodeURIComponent(next)}`}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 font-bold shadow-sm hover:bg-brand-soft transition"
        >
          <span aria-hidden>🇬</span>
          התחברות עם Google
        </a>

        <div className="my-6 flex items-center gap-3 text-xs text-brand-dark">
          <div className="h-px flex-1 bg-black/10" />
          <span>או סיסמה</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <form onSubmit={onPasswordSubmit} className="space-y-3">
          <label className="block text-sm font-bold" htmlFor="password">
            סיסמת מנהל
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-3"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary btn-md w-full"
          >
            {loading ? "מתחבר…" : "כניסה בסיסמה"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm">טוען…</p>}>
      <LoginForm />
    </Suspense>
  );
}
