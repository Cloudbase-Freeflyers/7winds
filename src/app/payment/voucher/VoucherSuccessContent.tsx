"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";
import { CONTACT, PACKAGE_LABELS } from "@/lib/constants";
import VoucherPdfDownload from "@/components/VoucherPdfDownload";

type OrderInfo = {
  id: string;
  paymentStatus: string | null;
  package: string;
  amount: number | null;
  orderType: string | null;
  buyerName: string;
  recipientName: string | null;
  occasion: string | null;
};

const NEXT_STEPS = [
  {
    icon: "📧",
    title: "קבלה באימייל",
    text: "קבלת תשלום וחשבונית נשלחו לכתובת האימייל שהזנתם.",
  },
  {
    icon: "📄",
    title: "הורידו את השובר",
    text: "הורידו את קובץ ה-PDF למטה — מוכן להדפסה או לשליחה בוואטסאפ.",
  },
  {
    icon: "📞",
    title: "תיאום הטיסה",
    text: `המקבל/ת יוצר/ת קשר ב-${CONTACT.phoneDisplay} לתיאום מועד הטיסה.`,
  },
  {
    icon: "🗓️",
    title: "תוקף השובר",
    text: "השובר תקף שנה מיום הרכישה — בהתאם לתנאי מזג האוויר.",
  },
];

export default function VoucherSuccessContent() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen bg-brand-soft flex items-center justify-center p-6"
          dir="rtl"
        >
          <p className="text-brand-dark">טוען…</p>
        </main>
      }
    >
      <VoucherSuccessInner />
    </Suspense>
  );
}

function VoucherSuccessInner() {
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
    (order?.package &&
      PACKAGE_LABELS[order.package as keyof typeof PACKAGE_LABELS]) ??
    order?.package;

  const recipientDisplay =
    order?.recipientName?.trim() || order?.buyerName || "";

  return (
    <main className="min-h-screen bg-brand-soft py-10 px-5 sm:px-8" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Thank you header */}
        <div className="rounded-3xl bg-white ring-1 ring-black/5 shadow-xl p-8 text-center">
          <div className="text-5xl">🎁</div>
          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            תודה! השובר נרכש בהצלחה
          </h1>

          {loading && (
            <p className="mt-3 text-brand-dark">מאשרים את העסקה…</p>
          )}

          {!loading && order && (
            <div className="mt-4 text-brand-dark space-y-1">
              <p className="font-semibold text-brand-black">{pkgLabel}</p>
              {order.amount ? (
                <p className="text-sm">₪{order.amount}</p>
              ) : null}
              {order.paymentStatus === "pending" && (
                <p className="text-sm text-amber-700 mt-2">
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
        </div>

        {/* Next steps */}
        <div className="rounded-3xl bg-white ring-1 ring-black/5 shadow-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-brand-black">
            מה עכשיו?
          </h2>
          <ol className="mt-5 space-y-4">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-lg"
                  aria-hidden
                >
                  {step.icon}
                </span>
                <div>
                  <p className="font-bold text-brand-black">
                    {i + 1}. {step.title}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-dark">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Voucher PDF */}
        <div className="rounded-3xl bg-white ring-1 ring-black/5 shadow-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-brand-black text-center">
            השובר שלכם
          </h2>
          <p className="mt-2 text-sm text-brand-dark text-center">
            {recipientDisplay
              ? `שובר מתנה עבור ${recipientDisplay} — מוכן לשיתוף`
              : "הורידו את השובר ושתפו עם המקבל/ת"}
          </p>
          <div className="mt-6">
            <VoucherPdfDownload
              recipientName={order?.recipientName || order?.buyerName}
              occasion={order?.occasion}
              orderId={orderId}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary btn-md text-center">
            חזרה לדף הבית
          </Link>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="btn-secondary btn-md text-center"
          >
            📞 צרו קשר לתיאום
          </a>
        </div>
      </div>
    </main>
  );
}
