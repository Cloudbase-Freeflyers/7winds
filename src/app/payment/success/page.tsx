import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-brand-soft flex items-center justify-center p-6" dir="rtl">
          <p className="text-brand-dark">טוען…</p>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
