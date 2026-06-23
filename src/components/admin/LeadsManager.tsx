"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LEAD_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  VOUCHER_STATUS_OPTIONS,
  leadStatusBadgeClass,
  paymentStatusBadgeClass,
  voucherStatusBadgeClass,
} from "@/lib/admin-submissions";
import { PACKAGE_LABELS } from "@/lib/constants";
import type {
  LeadStatus,
  PaymentStatus,
  VoucherAdminStatus,
} from "@/types/submissions";

type LeadRow = {
  _id: string;
  name: string;
  phone: string;
  message?: string;
  source: string;
  status?: LeadStatus;
  affiliateCode?: string;
  createdAt: string;
};

type VoucherRow = {
  _id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  recipientName?: string;
  occasion?: string;
  package: string;
  notes?: string;
  paymentStatus?: PaymentStatus;
  status?: VoucherAdminStatus;
  affiliateCode?: string;
  orderType?: string;
  amount?: number;
  createdAt: string;
};

type EditTarget =
  | { type: "lead"; row: LeadRow }
  | { type: "voucher"; row: VoucherRow }
  | null;

export default function LeadsManager() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, vouchersRes] = await Promise.all([
        fetch("/api/admin/list?type=leads"),
        fetch("/api/admin/list?type=vouchers"),
      ]);
      const leadsData = await leadsRes.json();
      const vouchersData = await vouchersRes.json();
      if (!leadsRes.ok) throw new Error(leadsData.error || "טעינת לידים נכשלה");
      if (!vouchersRes.ok)
        throw new Error(vouchersData.error || "טעינת שוברים נכשלה");
      setLeads(leadsData.rows);
      setVouchers(vouchersData.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function patchLead(id: string, patch: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
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

  async function patchVoucher(id: string, patch: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, {
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

  async function deleteLead(id: string, name: string) {
    if (!window.confirm(`למחוק את הליד "${name}"?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "מחיקה נכשלה");
      if (editTarget?.type === "lead" && editTarget.row._id === id) {
        setEditTarget(null);
      }
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  async function deleteVoucher(id: string, name: string) {
    if (!window.confirm(`למחוק את בקשת השובר "${name}"?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "מחיקה נכשלה");
      if (editTarget?.type === "voucher" && editTarget.row._id === id) {
        setEditTarget(null);
      }
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  const q = query.trim().toLowerCase();
  const match = (...vals: (string | undefined)[]) =>
    !q || vals.filter(Boolean).some((v) => v!.toLowerCase().includes(q));
  const filteredLeads = leads.filter((l) =>
    match(l.name, l.phone, l.message, l.affiliateCode)
  );
  const filteredVouchers = vouchers.filter((v) =>
    match(v.buyerName, v.buyerPhone, v.buyerEmail, v.recipientName, v.affiliateCode)
  );

  return (
    <>
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-brand-dark text-sm mb-4">טוען…</p>
      )}

      <div className="relative mb-6">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-brand-dark/40">
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש לפי שם, טלפון, אימייל או קוד שותף…"
          className={`${inputCls} ps-9`}
        />
      </div>

      <section>
        <h2 className="font-display text-xl font-extrabold">
          לידים ({q ? `${filteredLeads.length}/${leads.length}` : leads.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-soft text-brand-dark">
              <tr>
                <Th>תאריך</Th>
                <Th>שם</Th>
                <Th>טלפון</Th>
                <Th>הודעה</Th>
                <Th>סטטוס</Th>
                <Th>מקור</Th>
                <Th>שותף</Th>
                <Th>פעולות</Th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-brand-dark">
                    {q ? `אין תוצאות עבור “${query}”` : "אין לידים עדיין"}
                  </td>
                </tr>
              )}
              {filteredLeads.map((l) => (
                <tr key={l._id} className="border-t border-black/5">
                  <Td>{formatDate(l.createdAt)}</Td>
                  <Td>{l.name}</Td>
                  <Td dir="ltr">{l.phone}</Td>
                  <Td className="max-w-[200px] truncate">{l.message || "—"}</Td>
                  <Td>
                    <StatusSelect
                      value={l.status || "new"}
                      options={LEAD_STATUS_OPTIONS}
                      badgeClass={leadStatusBadgeClass(l.status)}
                      disabled={saving}
                      onChange={(status) => patchLead(l._id, { status })}
                    />
                  </Td>
                  <Td>{l.source}</Td>
                  <Td dir="ltr">{l.affiliateCode || "—"}</Td>
                  <Td>
                    <RowActions
                      disabled={saving}
                      onEdit={() => setEditTarget({ type: "lead", row: l })}
                      onDelete={() => deleteLead(l._id, l.name)}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-extrabold">
          בקשות שובר ({q ? `${filteredVouchers.length}/${vouchers.length}` : vouchers.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-soft text-brand-dark">
              <tr>
                <Th>תאריך</Th>
                <Th>קונה</Th>
                <Th>טלפון</Th>
                <Th>מסלול</Th>
                <Th>תשלום</Th>
                <Th>סטטוס</Th>
                <Th>מקבל</Th>
                <Th>שותף</Th>
                <Th>פעולות</Th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredVouchers.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-brand-dark">
                    {q ? `אין תוצאות עבור “${query}”` : "אין בקשות שובר עדיין"}
                  </td>
                </tr>
              )}
              {filteredVouchers.map((v) => (
                <tr key={v._id} className="border-t border-black/5">
                  <Td>{formatDate(v.createdAt)}</Td>
                  <Td>{v.buyerName}</Td>
                  <Td dir="ltr">{v.buyerPhone}</Td>
                  <Td>
                    {PACKAGE_LABELS[v.package as keyof typeof PACKAGE_LABELS] ||
                      v.package}
                  </Td>
                  <Td>
                    <StatusSelect
                      value={v.paymentStatus || "pending"}
                      options={PAYMENT_STATUS_OPTIONS}
                      badgeClass={paymentStatusBadgeClass(v.paymentStatus)}
                      disabled={saving}
                      onChange={(paymentStatus) =>
                        patchVoucher(v._id, { paymentStatus })
                      }
                    />
                  </Td>
                  <Td>
                    <StatusSelect
                      value={v.status || "new"}
                      options={VOUCHER_STATUS_OPTIONS}
                      badgeClass={voucherStatusBadgeClass(v.status)}
                      disabled={saving}
                      onChange={(status) => patchVoucher(v._id, { status })}
                    />
                  </Td>
                  <Td>{v.recipientName || "—"}</Td>
                  <Td dir="ltr">{v.affiliateCode || "—"}</Td>
                  <Td>
                    <RowActions
                      disabled={saving}
                      onEdit={() => setEditTarget({ type: "voucher", row: v })}
                      onDelete={() => deleteVoucher(v._id, v.buyerName)}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editTarget?.type === "lead" && (
        <EditModal
          title="עריכת ליד"
          onClose={() => setEditTarget(null)}
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await patchLead(editTarget.row._id, {
              name: String(fd.get("name") || "").trim(),
              phone: String(fd.get("phone") || "").trim(),
              message: String(fd.get("message") || "").trim(),
              status: String(fd.get("status") || "new"),
            });
            setEditTarget(null);
          }}
          saving={saving}
        >
          <Field label="שם" name="name" defaultValue={editTarget.row.name} required />
          <Field
            label="טלפון"
            name="phone"
            defaultValue={editTarget.row.phone}
            required
            dir="ltr"
          />
          <Field label="הודעה" name="message" defaultValue={editTarget.row.message || ""} />
          <SelectField
            label="סטטוס"
            name="status"
            defaultValue={editTarget.row.status || "new"}
            options={LEAD_STATUS_OPTIONS}
          />
        </EditModal>
      )}

      {editTarget?.type === "voucher" && (
        <EditModal
          title="עריכת שובר"
          onClose={() => setEditTarget(null)}
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await patchVoucher(editTarget.row._id, {
              buyerName: String(fd.get("buyerName") || "").trim(),
              buyerPhone: String(fd.get("buyerPhone") || "").trim(),
              buyerEmail: String(fd.get("buyerEmail") || "").trim(),
              recipientName: String(fd.get("recipientName") || "").trim(),
              occasion: String(fd.get("occasion") || "").trim(),
              notes: String(fd.get("notes") || "").trim(),
              paymentStatus: String(fd.get("paymentStatus") || "pending"),
              status: String(fd.get("status") || "new"),
            });
            setEditTarget(null);
          }}
          saving={saving}
        >
          <Field
            label="שם קונה"
            name="buyerName"
            defaultValue={editTarget.row.buyerName}
            required
          />
          <Field
            label="טלפון"
            name="buyerPhone"
            defaultValue={editTarget.row.buyerPhone}
            required
            dir="ltr"
          />
          <Field
            label="אימייל"
            name="buyerEmail"
            type="email"
            defaultValue={editTarget.row.buyerEmail || ""}
            dir="ltr"
          />
          <Field
            label="שם מקבל/ת"
            name="recipientName"
            defaultValue={editTarget.row.recipientName || ""}
          />
          <Field
            label="אירוע"
            name="occasion"
            defaultValue={editTarget.row.occasion || ""}
          />
          <Field label="הערות" name="notes" defaultValue={editTarget.row.notes || ""} />
          <SelectField
            label="סטטוס תשלום"
            name="paymentStatus"
            defaultValue={editTarget.row.paymentStatus || "pending"}
            options={PAYMENT_STATUS_OPTIONS}
          />
          <SelectField
            label="סטטוס טיפול"
            name="status"
            defaultValue={editTarget.row.status || "new"}
            options={VOUCHER_STATUS_OPTIONS}
          />
        </EditModal>
      )}
    </>
  );
}

function StatusSelect<T extends string>({
  value,
  options,
  badgeClass,
  disabled,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  badgeClass: string;
  disabled?: boolean;
  onChange: (value: T) => void;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as T)}
      className={`rounded-full px-2 py-0.5 text-xs font-bold border-0 cursor-pointer ${badgeClass}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function RowActions({
  onEdit,
  onDelete,
  disabled,
}: {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title="עריכה"
        disabled={disabled}
        onClick={onEdit}
        className="rounded-lg px-2 py-1 text-xs font-bold text-brand-sky hover:bg-brand-sky/10 transition disabled:opacity-50"
      >
        ✏️
      </button>
      <button
        type="button"
        title="מחק"
        disabled={disabled}
        onClick={onDelete}
        className="rounded-lg px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
      >
        🗑️
      </button>
    </div>
  );
}

function EditModal({
  title,
  children,
  onClose,
  onSubmit,
  saving,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-dark/60 hover:text-brand-black text-xl leading-none"
            aria-label="סגור"
          >
            ×
          </button>
        </div>
        <div className="mt-4 grid gap-3">{children}</div>
        <div className="mt-5 flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary btn-sm flex-1">
            {saving ? "שומר…" : "שמור"}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary btn-sm">
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  dir,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  dir?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-brand-dark">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        dir={dir}
        className={inputCls}
      />
    </label>
  );
}

function SelectField<T extends string>({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: T;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-brand-dark">{label}</span>
      <select name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-start text-xs font-bold uppercase tracking-wide">
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
    <td {...rest} className={`px-4 py-3 align-top text-brand-black ${className}`}>
      {children}
    </td>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const inputCls =
  "mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20";
