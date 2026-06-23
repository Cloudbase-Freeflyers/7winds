"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type SubscriberRow = {
  _id: string;
  email: string;
  name?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt?: string;
};

type Config = {
  configured: boolean;
  provider: "connected-gmail" | "apps-script" | null;
  connectedSenderEmail: string | null;
  connectedAt: string | null;
  oauthReady: boolean;
  oauthRedirectUri: string | null;
  appsScriptUrl: string | null;
  systemNotifyEmail: string | null;
  approvedSubscriberCount: number;
  pendingCount: number;
};

export default function NotificationManager() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<SubscriberRow[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("connected") === "1") {
      setNotice("Gmail חובר בהצלחה — התראות יישלחו מהחשבון שלכם.");
    } else if (searchParams.get("error")) {
      setError(decodeURIComponent(searchParams.get("error") || "oauth_error"));
    }
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = filter === "all" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/admin/notifications${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "טעינה נכשלה");
      setRows(data.rows);
      setConfig(data.config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function disconnectGmail() {
    if (!confirm("לנתק את חשבון Gmail?")) return;
    setSaving("disconnect");
    try {
      const res = await fetch("/api/admin/email/connect", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ניתוק נכשל");
      setNotice("Gmail נותק.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(null);
    }
  }

  async function setStatus(id: string, status: SubscriberRow["status"]) {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "עדכון נכשל");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("למחוק את המנוי?")) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "מחיקה נכשלה");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(null);
    }
  }

  const subscribePageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/notifications`
      : "/notifications";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
        <h2 className="font-display text-xl font-extrabold">חיבור Gmail לשליחה</h2>
        <p className="mt-1 text-sm text-brand-dark">
          כל אתר שולח התראות מ<strong>חשבון Gmail של הבעלים</strong> — לא מחשבון המפתח.
          התראות על <strong>לידים בלבד</strong>.
        </p>
        <p className="mt-2 text-xs text-brand-dark/80">
          בכניסה לניהול: שם משתמש — כל דבר · סיסמה — <code>ADMIN_PASSWORD</code> מהשרת.
        </p>

        {notice && (
          <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-3 text-green-900 text-sm">
            {notice}
          </div>
        )}

        {config && (
          <div className="mt-4 space-y-3 text-sm">
            <StatusRow
              label="שולח מייל"
              value={
                config.connectedSenderEmail
                  ? config.connectedSenderEmail
                  : "לא מחובר"
              }
              ok={Boolean(config.connectedSenderEmail)}
            />
            {config.connectedAt && (
              <StatusRow
                label="מחובר מ"
                value={new Date(config.connectedAt).toLocaleString("he-IL")}
                ok
              />
            )}
            <StatusRow
              label="מנויים מאושרים"
              value={String(config.approvedSubscriberCount)}
              ok={config.approvedSubscriberCount > 0}
            />
            {config.pendingCount > 0 && (
              <p className="rounded-xl bg-brand-yellow/20 px-3 py-2 text-brand-black font-bold">
                {config.pendingCount} בקשות ממתינות לאישור
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {config.oauthReady ? (
                <a href="/api/admin/email/connect" className="btn-primary btn-sm">
                  {config.connectedSenderEmail ? "חיבור מחדש" : "חבר Gmail שלי"}
                </a>
              ) : (
                <p className="text-red-700 text-xs">
                  הוסיפו <code>GOOGLE_CLIENT_ID</code> ו־<code>GOOGLE_CLIENT_SECRET</code> בשרת.
                </p>
              )}
              {config.connectedSenderEmail && (
                <button
                  type="button"
                  disabled={saving === "disconnect"}
                  onClick={disconnectGmail}
                  className="btn-secondary btn-sm"
                >
                  ניתוק Gmail
                </button>
              )}
            </div>

            {config.oauthRedirectUri && (
              <p className="text-xs text-brand-dark">
                Redirect URI ב־Google Cloud:{" "}
                <code className="bg-brand-soft px-1 rounded break-all" dir="ltr">
                  {config.oauthRedirectUri}
                </code>
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-extrabold">מנויי התראות</h2>
            <p className="mt-1 text-sm text-brand-dark">
              מי מקבל את המיילים (דורש אישור מנהל). בקשות מ:{" "}
              <a
                href={subscribePageUrl}
                target="_blank"
                rel="noopener"
                className="text-brand-sky font-bold underline"
                dir="ltr"
              >
                {subscribePageUrl}
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  filter === f
                    ? "bg-brand-black text-white"
                    : "bg-brand-soft text-brand-dark"
                }`}
              >
                {f === "all" ? "הכל" : f === "pending" ? "ממתין" : f === "approved" ? "מאושר" : "נדחה"}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-6 text-sm text-brand-dark">טוען…</p>
        ) : rows.length === 0 ? (
          <p className="mt-6 text-sm text-brand-dark">אין מנויים.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-soft text-brand-dark">
                <tr>
                  <th className="px-3 py-3 text-start text-xs font-bold">שם</th>
                  <th className="px-3 py-3 text-start text-xs font-bold">אימייל</th>
                  <th className="px-3 py-3 text-start text-xs font-bold">סטטוס</th>
                  <th className="px-3 py-3 text-start text-xs font-bold">תאריך</th>
                  <th className="px-3 py-3 text-start text-xs font-bold">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-t border-black/5">
                    <td className="px-3 py-3">{row.name || "—"}</td>
                    <td className="px-3 py-3 font-mono text-xs" dir="ltr">
                      {row.email}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-3 py-3 text-xs text-brand-dark" dir="ltr">
                      {new Date(row.createdAt).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        {row.status !== "approved" && (
                          <button
                            type="button"
                            disabled={saving === row._id}
                            onClick={() => setStatus(row._id, "approved")}
                            className="btn-primary btn-sm"
                          >
                            אישור
                          </button>
                        )}
                        {row.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={saving === row._id}
                            onClick={() => setStatus(row._id, "rejected")}
                            className="btn-secondary btn-sm"
                          >
                            דחייה
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={saving === row._id}
                          onClick={() => remove(row._id)}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          מחק
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusRow({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-baseline">
      <span className="font-bold min-w-[7rem]">{label}:</span>
      <span className={ok ? "text-green-700" : "text-brand-dark"} dir="ltr">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: SubscriberRow["status"] }) {
  const map = {
    pending: { label: "ממתין", cls: "bg-brand-yellow/30 text-brand-black" },
    approved: { label: "מאושר", cls: "bg-green-100 text-green-800" },
    rejected: { label: "נדחה", cls: "bg-gray-100 text-gray-600" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${cls}`}>
      {label}
    </span>
  );
}
