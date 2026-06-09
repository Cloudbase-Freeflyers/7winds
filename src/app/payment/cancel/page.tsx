import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-brand-soft flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-lg w-full rounded-3xl bg-white ring-1 ring-black/5 shadow-xl p-8 text-center">
        <div className="text-5xl">↩️</div>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-brand-black">
          התשלום בוטל
        </h1>
        <p className="mt-3 text-brand-dark">
          לא חויבתם. אפשר לנסות שוב מתי שתרצו.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/#voucher" className="btn-secondary btn-md">
            חזרה לשובר מתנה
          </Link>
          <Link href="/#pricing" className="btn-primary btn-md">
            חזרה למחירון
          </Link>
        </div>
      </div>
    </main>
  );
}
