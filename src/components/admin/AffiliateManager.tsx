"use client";

import { useCallback, useEffect, useState } from "react";
import { affiliateUrl, slugifyCode } from "@/lib/affiliate-utils";
import type { AffiliateStats } from "@/types/affiliates";

interface AffiliateRow {
  _id: string;
  code: string;
  name: string;
  email?: string;
  hasLogin?: boolean;
  phone?: string;
  commissionRate: number;
  commissionType: "percent" | "fixed";
  status: "active" | "inactive";
  payoutStatus: "none" | "pending" | "paid";
  totalPaid: number;
  notes?: string;
  stats: AffiliateStats;
}

export default function AffiliateManager() {
  const [rows, setRows] = useState<AffiliateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [commissionRate, setCommissionRate] = useState("10");
  const [commissionType, setCommissionType] = useState<"percent" | "fixed">(
    "percent"
  );
  const [notes, setNotes] = useState("");

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [credentialEmail, setCredentialEmail] = useState("");
  const [credentialPassword, setCredentialPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCommissionRate, setEditCommissionRate] = useState("10");
  const [editCommissionType, setEditCommissionType] = useState<"percent" | "fixed">(
    "percent"
  );
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/affiliates");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "טעינה נכשלה");
      setRows(data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = rows.find((r) => r._id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) {
      setCredentialEmail("");
      setCredentialPassword("");
      setEditName("");
      setEditPhone("");
      setEditCommissionRate("10");
      setEditCommissionType("percent");
      setEditNotes("");
      return;
    }
    setCredentialEmail(selected.email || "");
    setCredentialPassword("");
    setEditName(selected.name);
    setEditPhone(selected.phone || "");
    setEditCommissionRate(String(selected.commissionRate));
    setEditCommissionType(selected.commissionType);
    setEditNotes(selected.notes || "");
  }, [selected]);

  function autoCodeFromName(value: string) {
    setName(value);
    if (!code || code === slugifyCode(name)) {
      setCode(slugifyCode(value));
    }
  }

  async function createAffiliate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code: code || slugifyCode(name),
          email,
          password,
          phone,
          commissionRate: Number(commissionRate),
          commissionType,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "יצירה נכשלה");
      setName("");
      setCode("");
      setEmail("");
      setPassword("");
      setPhone("");
      setCommissionRate("10");
      setCommissionType("percent");
      setNotes("");
      await load();
      setSelectedId(data.id);
      setShowCreateForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setCreating(false);
    }
  }

  async function updateAffiliate(
    id: string,
    patch: Record<string, unknown>
  ) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "עדכון נכשל");
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  async function recordPayout(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/affiliates/${selected._id}/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(payoutAmount),
          payoutStatus: "paid",
          notes: payoutNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "רישום תשלום נכשל");
      setPayoutAmount("");
      setPayoutNotes("");
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  async function saveCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await updateAffiliate(selected._id, {
        email: credentialEmail,
        ...(credentialPassword ? { password: credentialPassword } : {}),
      });
      setCredentialPassword("");
    } catch {
      // updateAffiliate already alerts
    } finally {
      setSaving(false);
    }
  }

  async function saveAffiliateDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await updateAffiliate(selected._id, {
        name: editName,
        phone: editPhone,
        commissionRate: Number(editCommissionRate),
        commissionType: editCommissionType,
        notes: editNotes,
      });
    } catch {
      // updateAffiliate already alerts
    } finally {
      setSaving(false);
    }
  }

  function formatCommission(rate: number, type: "percent" | "fixed") {
    return type === "percent" ? `${rate}%` : `₪${rate}`;
  }

  function copyLink(code: string) {
    navigator.clipboard.writeText(affiliateUrl(code)).catch(() => {});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-lg font-extrabold">כל השותפים</h2>
          <p className="text-sm text-brand-dark">
            {rows.length} שותפים · לחצו על שורה לצפייה בפרטים
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-soft text-brand-dark">
              <tr>
                <Th>שם</Th>
                <Th>קוד</Th>
                <Th>כניסה</Th>
                <Th>סטטוס</Th>
                <Th>ביקורים</Th>
                <Th>לידים</Th>
                <Th>שוברים</Th>
                <Th>עמלה</Th>
                <Th>עמלה משוערת</Th>
                <Th>יתרה</Th>
                <Th>תשלום</Th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-brand-dark">
                    טוען…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-brand-dark">
                    אין שותפים עדיין
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => {
                    setSelectedId(r._id);
                    setShowCreateForm(false);
                  }}
                  className={`border-t border-black/5 cursor-pointer hover:bg-brand-soft/50 ${
                    selectedId === r._id && !showCreateForm ? "bg-brand-sky/10" : ""
                  }`}
                >
                  <Td>{r.name}</Td>
                  <Td dir="ltr" className="font-mono text-xs">
                    {r.code}
                  </Td>
                  <Td>
                    {r.hasLogin ? (
                      <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800">
                        פעיל
                      </span>
                    ) : (
                      <span className="text-xs text-brand-dark">—</span>
                    )}
                  </Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                  <Td>{r.stats.visits}</Td>
                  <Td>{r.stats.leads}</Td>
                  <Td>{r.stats.vouchers}</Td>
                  <Td>{formatCommission(r.commissionRate, r.commissionType)}</Td>
                  <Td>₪{r.stats.estimatedEarnings}</Td>
                  <Td>₪{r.stats.pendingBalance}</Td>
                  <Td>
                    <PayoutBadge status={r.payoutStatus} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <button
          type="button"
          onClick={() => {
            setShowCreateForm(true);
            setSelectedId(null);
          }}
          className="btn-primary btn-md w-full"
        >
          + הוסף שותף חדש
        </button>

        {showCreateForm && (
        <form
          onSubmit={createAffiliate}
          className="rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-extrabold">שותף חדש</h2>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-brand-dark/60 hover:text-brand-black text-xl leading-none"
              aria-label="סגור"
            >
              ×
            </button>
          </div>
          <div className="mt-4 grid gap-3">
            <Field label="שם">
              <input
                value={name}
                onChange={(e) => autoCodeFromName(e.target.value)}
                required
                className={inputCls}
                placeholder="דני כהן"
              />
            </Field>
            <Field label="קוד (ב-URL)">
              <input
                value={code}
                onChange={(e) => setCode(slugifyCode(e.target.value))}
                required
                dir="ltr"
                className={inputCls}
                placeholder="dani-cohen"
              />
            </Field>
            <Field label="טלפון (לא חובה)">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className={inputCls}
              />
            </Field>
            <Field label="אימייל לכניסת שותף (לא חובה)">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className={inputCls}
                placeholder="partner@example.com"
              />
            </Field>
            <Field label="סיסמה ראשונית (8+ תווים)">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                className={inputCls}
                minLength={email ? 8 : undefined}
                required={!!email}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="עמלה">
                <input
                  type="number"
                  min={0}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="סוג">
                <select
                  value={commissionType}
                  onChange={(e) =>
                    setCommissionType(e.target.value as "percent" | "fixed")
                  }
                  className={inputCls}
                >
                  <option value="percent">אחוזים %</option>
                  <option value="fixed">סכום קבוע ₪</option>
                </select>
              </Field>
            </div>
            <Field label="הערות">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className={inputCls}
              />
            </Field>
          </div>
          {formError && (
            <p className="mt-3 text-sm text-red-600">{formError}</p>
          )}
          <button
            type="submit"
            disabled={creating}
            className="mt-4 btn-primary btn-md w-full"
          >
            {creating ? "יוצר…" : "צור שותף + QR"}
          </button>
        </form>
        )}

        {!showCreateForm && !selected && (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-8 shadow-sm text-center text-brand-dark">
            <p className="text-4xl">🤝</p>
            <p className="mt-3 font-bold text-brand-black">בחרו שותף מהרשימה</p>
            <p className="mt-1 text-sm">
              תראו QR, באנרים, כרטיסים להדפסה וקישורים לשיתוף
            </p>
          </div>
        )}

        {!showCreateForm && selected && (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-sm space-y-5">
            <div>
              <h2 className="font-display text-lg font-extrabold">{selected.name}</h2>
              <p className="mt-1 text-xs text-brand-dark font-mono break-all" dir="ltr">
                {affiliateUrl(selected.code)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={selected.status} />
                <span className="text-xs text-brand-dark">
                  עמלה: {formatCommission(selected.commissionRate, selected.commissionType)}
                </span>
              </div>
            </div>

            {/* Marketing assets */}
            <div className="border border-black/5 rounded-xl p-4 bg-brand-soft/30">
              <h3 className="font-bold text-sm">חומרי שיווק</h3>
              <div className="mt-3 grid gap-2">
                <AssetLink
                  href={`/api/admin/affiliates/${selected._id}/qr`}
                  download={`qr-${selected.code}.png`}
                  label="📱 QR Code"
                  sub="הורדת תמונת QR"
                />
                <AssetLink
                  href={`/api/admin/affiliates/${selected._id}/banner`}
                  target="_blank"
                  label="🖼️ באנר שיווקי"
                  sub="פתיחה / הדפסה / שמירה כ-PDF"
                />
                <AssetLink
                  href={`/api/admin/affiliates/${selected._id}/card`}
                  target="_blank"
                  label="🪪 כרטיסים להדפסה"
                  sub="4 כרטיסים לדף — PDF"
                />
                <button
                  type="button"
                  onClick={() => copyLink(selected.code)}
                  className="flex items-center justify-between w-full rounded-xl bg-white ring-1 ring-black/5 px-4 py-3 text-start hover:bg-brand-soft/50 transition"
                >
                  <span>
                    <span className="block font-bold text-sm">🔗 קישור לשיתוף</span>
                    <span className="block text-xs text-brand-dark">העתקה ללוח</span>
                  </span>
                  <span className="text-brand-sky font-bold text-sm">העתק</span>
                </button>
                <a
                  href={affiliateUrl(selected.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full rounded-xl bg-white ring-1 ring-black/5 px-4 py-3 text-start hover:bg-brand-soft/50 transition"
                >
                  <span>
                    <span className="block font-bold text-sm">👁️ צפייה בדף השותף</span>
                    <span className="block text-xs text-brand-dark font-mono" dir="ltr">
                      /a/{selected.code}
                    </span>
                  </span>
                  <span className="text-brand-sky font-bold text-sm">פתח ↗</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/admin/affiliates/${selected._id}/qr`}
                alt={`QR code for ${selected.code}`}
                className="w-40 h-40 rounded-xl ring-1 ring-black/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <Stat label="ביקורים" value={selected.stats.visits} />
              <Stat label="לידים" value={selected.stats.leads} />
              <Stat label="שוברים" value={selected.stats.vouchers} />
              <Stat label="וואטסאפ" value={selected.stats.whatsappClicks} />
              <Stat
                label="עמלה משוערת"
                value={`₪${selected.stats.estimatedEarnings}`}
              />
              <Stat
                label="יתרה לתשלום"
                value={`₪${selected.stats.pendingBalance}`}
                highlight
              />
            </div>

            <details className="group">
              <summary className="cursor-pointer font-bold text-sm text-brand-dark hover:text-brand-black">
                ⚙️ עריכה וניהול
              </summary>
              <div className="mt-4 space-y-4">
            <p className="text-xs text-brand-dark">
              כניסת שותף:{" "}
              <a
                href="/affiliate/login"
                className="text-brand-sky font-bold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                /affiliate/login
              </a>
            </p>

            <form
              onSubmit={saveAffiliateDetails}
              className="border border-black/5 rounded-xl p-4 bg-brand-soft/40"
            >
              <h3 className="font-bold text-sm">עריכת פרטי שותף</h3>
              <div className="mt-3 grid gap-2">
                <Field label="שם">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className={inputCls}
                  />
                </Field>
                <Field label="טלפון">
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    dir="ltr"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="עמלה">
                    <input
                      type="number"
                      min={0}
                      value={editCommissionRate}
                      onChange={(e) => setEditCommissionRate(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </Field>
                  <Field label="סוג עמלה">
                    <select
                      value={editCommissionType}
                      onChange={(e) =>
                        setEditCommissionType(e.target.value as "percent" | "fixed")
                      }
                      className={inputCls}
                    >
                      <option value="percent">אחוזים %</option>
                      <option value="fixed">סכום קבוע ₪</option>
                    </select>
                  </Field>
                </div>
                <Field label="הערות">
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={2}
                    className={inputCls}
                  />
                </Field>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-3 btn-primary btn-sm w-full"
              >
                {saving ? "שומר…" : "שמור פרטי שותף"}
              </button>
            </form>

            <form
              onSubmit={saveCredentials}
              className="border border-black/5 rounded-xl p-4 bg-brand-soft/40"
            >
              <h3 className="font-bold text-sm">פרטי כניסה לשותף</h3>
              <div className="mt-3 grid gap-2">
                <input
                  type="email"
                  value={credentialEmail}
                  onChange={(e) => setCredentialEmail(e.target.value)}
                  dir="ltr"
                  placeholder="אימייל"
                  className={inputCls}
                />
                <input
                  type="password"
                  value={credentialPassword}
                  onChange={(e) => setCredentialPassword(e.target.value)}
                  dir="ltr"
                  placeholder="סיסמה חדשה (השאר ריק לשמירה)"
                  className={inputCls}
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-3 btn-secondary btn-sm w-full"
              >
                {saving ? "שומר…" : "שמור פרטי כניסה"}
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  updateAffiliate(selected._id, {
                    status: selected.status === "active" ? "inactive" : "active",
                  })
                }
                className="btn-secondary btn-sm"
              >
                {selected.status === "active" ? "השבת" : "הפעל"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  updateAffiliate(selected._id, {
                    payoutStatus:
                      selected.payoutStatus === "pending" ? "none" : "pending",
                  })
                }
                className="btn-secondary btn-sm"
              >
                {selected.payoutStatus === "pending"
                  ? "בטל ממתין לתשלום"
                  : "סמן ממתין לתשלום"}
              </button>
            </div>

            <form onSubmit={recordPayout} className="border-t border-black/5 pt-4">
              <h3 className="font-bold text-sm">רישום תשלום</h3>
              <div className="mt-2 grid gap-2">
                <input
                  type="number"
                  min={1}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  required
                  placeholder="סכום ₪"
                  className={inputCls}
                />
                <input
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="הערה (אופציונלי)"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-3 btn-primary btn-sm w-full"
              >
                {saving ? "שומר…" : "רשום תשלום"}
              </button>
            </form>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

function AssetLink({
  href,
  label,
  sub,
  download,
  target,
}: {
  href: string;
  label: string;
  sub: string;
  download?: string;
  target?: string;
}) {
  return (
    <a
      href={href}
      download={download}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="flex items-center justify-between w-full rounded-xl bg-white ring-1 ring-black/5 px-4 py-3 text-start hover:bg-brand-soft/50 transition"
    >
      <span>
        <span className="block font-bold text-sm">{label}</span>
        <span className="block text-xs text-brand-dark">{sub}</span>
      </span>
      <span className="text-brand-sky font-bold text-sm">↓</span>
    </a>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-3 text-start text-xs font-bold uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...rest}
      className={`px-3 py-3 align-top text-brand-black ${className}`}
    >
      {children}
    </td>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-brand-dark">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2 ${
        highlight ? "bg-brand-sky/10 ring-1 ring-brand-sky/20" : "bg-brand-soft"
      }`}
    >
      <p className="text-xs text-brand-dark">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status === "active" ? "פעיל" : "מושבת"}
    </span>
  );
}

function PayoutBadge({ status }: { status: "none" | "pending" | "paid" }) {
  const labels = { none: "—", pending: "ממתין", paid: "שולם" };
  const colors = {
    none: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20";
