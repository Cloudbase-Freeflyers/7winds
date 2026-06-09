"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";
import { PACKAGE_LABELS } from "@/lib/constants";

type OrderInfo = {
  id: string;
  paymentStatus: string | null;
  package: string;
  amount: number | null;
  orderType: string | null;
  buyerName: string;
};

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const tracked = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/payments/order?order=${encodeURIComponent(orderId!)}`
        );
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data.ok) {
          setOrder(data.order);
          if (data.order.paymentStatus === "paid" && !tracked.current) {
            tracked.current = true;
            track.purchase(data.order.package, data.order.amount ?? undefined);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, 3000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [orderId]);

  const pkgLabel =
    (order?.package && PACKAGE_LABELS[order.package as keyof typeof PACKAGE_LABELS]) ??
    order?.package;

  return (
    <main
      className="min-h-screen bg-brand-soft flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="max-w-lg w-full rounded-3xl bg-white ring-1 ring-black/5 shadow-xl p-8 text-center">
        <div className="text-5xl">🪂</div>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-brand-black">
          תודה! התשלום התקבל
        </h1>

        {loading && <p className="mt-3 text-brand-dark">מאשרים את העסקה…</p>}

        {!loading && order && (
          <div className="mt-4 text-brand-dark space-y-2">
            <p>
              {order.orderType === "voucher"
                ? "השובר בדרך אליכם — נשלח אימייל עם הקבלה והפרטים."
                : "קיבלנו את התשלום — ניצור קשר לתיאום הטיסה."}
            </p>
            <p className="text-sm">
              {pkgLabel}
              {order.amount ? ` · ₪${order.amount}` : ""}
            </p>
            {order.paymentStatus === "pending" && (
              <p className="text-sm text-amber-700">
                העסקה עדיין מאושרת — הקבלה תגיע בדקות הקרובות.
              </p>
            )}
          </div>
        )}

        {!loading && !order && (
          <p className="mt-3 text-brand-dark">
            התשלום התקבל. אם לא קיבלתם קבלה — בדקו את תיבת האימייל.
          </p>
        )}

        <Link href="/" className="mt-8 inline-block btn-primary btn-md">
          חזרה לדף הבית
        </Link>
      </div>
    </main>
  );
}
