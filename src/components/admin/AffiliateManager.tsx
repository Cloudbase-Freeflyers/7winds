"use client";

import { useCallback, useEffect, useState } from "react";
import { affiliateUrl, slugifyCode } from "@/lib/affiliate-utils";
import type { AffiliateStats } from "@/types/affiliates";

interface AffiliateRow {
  _id: string;
  code: string;
  name: string;
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
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [commissionRate, setCommissionRate] = useState("10");
  const [commissionType, setCommissionType] = useState<"percent" | "fixed">(
    "percent"
  );
  const [notes, setNotes] = useState("");

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
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
      setPhone("");
      setCommissionRate("10");
      setCommissionType("percent");
      setNotes("");
      await load();
      setSelectedId(data.id);
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

  function copyLink(code: string) {
    navigator.clipboard.writeText(affiliateUrl(code)).catch(() => {});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
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
                <Th>סטטוס</Th>
                <Th>ביקורים</Th>
                <Th>לידים</Th>
                <Th>שוברים</Th>
                <Th>עמלה משוערת</Th>
                <Th>יתרה</Th>
                <Th>תשלום</Th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-brand-dark">
                    טוען…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-brand-dark">
                    אין שותפים עדיין
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => setSelectedId(r._id)}
                  className={`border-t border-black/5 cursor-pointer hover:bg-brand-soft/50 ${
                    selectedId === r._id ? "bg-brand-sky/10" : ""
                  }`}
                >
                  <Td>{r.name}</Td>
                  <Td dir="ltr" className="font-mono text-xs">
                    {r.code}
                  </Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                  <Td>{r.stats.visits}</Td>
                  <Td>{r.stats.leads}</Td>
                  <Td>{r.stats.vouchers}</Td>
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

      <div className="space-y-6">
        <form
          onSubmit={createAffiliate}
          className="rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-sm"
        >
          <h2 className="font-display text-lg font-extrabold">שותף חדש</h2>
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

        {selected && (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-sm">
            <h2 className="font-display text-lg font-extrabold">{selected.name}</h2>
            <p className="mt-1 text-xs text-brand-dark font-mono" dir="ltr">
              {affiliateUrl(selected.code)}
            </p>

            <div className="mt-4 flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/admin/affiliates/${selected._id}/qr`}
                alt={`QR code for ${selected.code}`}
                className="w-48 h-48 rounded-xl ring-1 ring-black/10"
              />
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => copyLink(selected.code)}
                  className="btn-secondary btn-sm flex-1"
                >
                  העתק קישור
                </button>
                <a
                  href={`/api/admin/affiliates/${selected._id}/qr`}
                  download={`qr-${selected.code}.png`}
                  className="btn-primary btn-sm flex-1 text-center"
                >
                  הורד QR
                </a>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Stat label="ביקורים" value={selected.stats.visits} />
              <Stat label="לידים" value={selected.stats.leads} />
              <Stat label="שוברים" value={selected.stats.vouchers} />
              <Stat label="וואטסאפ" value={selected.stats.whatsappClicks} />
              <Stat
                label="עמלה משוערת"
                value={`₪${selected.stats.estimatedEarnings}`}
              />
              <Stat
                label="שולם עד כה"
                value={`₪${selected.totalPaid}`}
              />
              <Stat
                label="יתרה לתשלום"
                value={`₪${selected.stats.pendingBalance}`}
                highlight
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
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

            <form onSubmit={recordPayout} className="mt-4 border-t border-black/5 pt-4">
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
        )}
      </div>
    </div>
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
