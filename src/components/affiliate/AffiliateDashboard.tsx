"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AffiliateStats } from "@/types/affiliates";

interface DashboardData {
  affiliate: {
    id: string;
    code: string;
    name: string;
    email?: string;
    commissionRate: number;
    commissionType: "percent" | "fixed";
    payoutStatus: "none" | "pending" | "paid";
    totalPaid: number;
    url: string;
  };
  stats: AffiliateStats;
}

export default function AffiliateDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/affiliate/me");
      if (res.status === 401) {
        router.replace("/affiliate/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "טעינה נכשלה");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/affiliate/logout", { method: "POST" });
    router.replace("/affiliate/login");
    router.refresh();
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url).catch(() => {});
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-8 text-center text-brand-dark shadow-sm">
        טוען…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-800 text-sm">
        {error || "לא ניתן לטעון את הלוח"}
      </div>
    );
  }

  const { affiliate, stats } = data;
  const commissionLabel =
    affiliate.commissionType === "percent"
      ? "מדורג 10–15% לפי מחזור חודשי"
      : `₪${affiliate.commissionRate} לפעולה`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">
            שלום, {affiliate.name}
          </h1>
          <p className="text-sm text-brand-dark mt-1">
            עמלה: {commissionLabel}
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-secondary btn-sm">
          יציאה
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="ביקורים" value={stats.visits} />
        <StatCard label="לידים" value={stats.leads} />
        <StatCard label="מכירות ששולמו" value={stats.paidOrders} />
        <StatCard label="לחיצות וואטסאפ" value={stats.whatsappClicks} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="מחזור שהופנה" value={`₪${stats.referredRevenue}`} />
        <StatCard
          label="עמלה משוערת"
          value={`₪${stats.estimatedEarnings}`}
          highlight
        />
        <StatCard label="שולם עד כה" value={`₪${affiliate.totalPaid}`} />
        <StatCard
          label="יתרה לתשלום"
          value={`₪${stats.pendingBalance}`}
          highlight
        />
      </div>

      <p className="text-xs text-brand-dark/70 -mt-2">
        * העמלה מחושבת על מכירות ששולמו בלבד, לפי מחזור חודשי (10% / 12% / 15%).
      </p>

      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-sm">
        <h2 className="font-display text-lg font-extrabold">הקישור שלך</h2>
        <p className="mt-2 text-xs text-brand-dark font-mono break-all" dir="ltr">
          {affiliate.url}
        </p>

        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/affiliate/qr"
            alt={`QR code for ${affiliate.code}`}
            className="w-40 h-40 rounded-xl ring-1 ring-black/10 shrink-0"
          />
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => copyLink(affiliate.url)}
              className="btn-secondary btn-sm"
            >
              העתק קישור
            </button>
            <a
              href="/api/affiliate/qr"
              download={`qr-${affiliate.code}.png`}
              className="btn-primary btn-sm text-center"
            >
              הורד QR
            </a>
            <a
              href={affiliate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm text-center"
            >
              צפה בדף השותף
            </a>
          </div>
        </div>

        {affiliate.payoutStatus === "pending" && (
          <p className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-900">
            התשלום שלך מסומן כממתין — ניצור איתך קשר בקרוב.
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-sky-gradient p-[2px] shadow-sm">
        <div className="rounded-[14px] bg-white p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold">תוכנית התגמול</h2>
            <p className="mt-1 text-sm text-brand-dark">
              מבנה העמלות המלא, בונוסים חודשיים ותרחישי רווח — כך מחושבת
              העמלה שלך.
            </p>
          </div>
          <Link href="/affiliate/proposal" className="btn-primary btn-md shrink-0">
            צפה בתוכנית העמלות ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
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
      className={`rounded-2xl px-4 py-4 shadow-sm ring-1 ${
        highlight
          ? "bg-brand-sky/10 ring-brand-sky/20"
          : "bg-white ring-black/5"
      }`}
    >
      <p className="text-xs font-bold text-brand-dark">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}
