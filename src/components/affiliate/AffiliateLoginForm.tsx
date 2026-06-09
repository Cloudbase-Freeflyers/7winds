"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AffiliateLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/affiliate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "התחברות נכשלה");
      router.push("/affiliate/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
      <div className="grid gap-4">
        <label className="block">
          <span className="text-xs font-bold text-brand-dark">אימייל</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            dir="ltr"
            className={inputCls}
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-brand-dark">סיסמה</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            dir="ltr"
            className={inputCls}
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 btn-primary btn-md w-full"
      >
        {loading ? "מתחבר…" : "התחברות"}
      </button>
    </form>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20";
