import Link from "next/link";

export const metadata = {
  title: "Gmail מחובר",
  robots: { index: false, follow: false },
};

export default async function GmailConnectedPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; email?: string; error?: string }>;
}) {
  const params = await searchParams;
  const connected = params.connected === "1";
  const email = params.email;
  const error = params.error;

  return (
    <main className="min-h-screen bg-brand-soft px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 ring-1 ring-black/5 shadow-sm text-center">
        {connected ? (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="mt-4 font-display text-2xl font-extrabold">
              Gmail חובר בהצלחה
            </h1>
            {email && (
              <p className="mt-2 text-sm text-brand-dark" dir="ltr">
                {email}
              </p>
            )}
            <p className="mt-3 text-sm text-brand-dark">
              חשבון זה ישלח את כל ההתראות (לידים, שוברים, תשלומים). אין צורך בחיבור
              נפרד לכל סוג.
            </p>
            <Link href="/admin/notifications" className="btn-primary btn-md mt-6 inline-block">
              חזרה להגדרות התראות
            </Link>
          </>
        ) : (
          <>
            <div className="text-5xl">⚠️</div>
            <h1 className="mt-4 font-display text-2xl font-extrabold">
              חיבור Gmail נכשל
            </h1>
            <p className="mt-3 text-sm text-red-700">{error || "שגיאה לא ידועה"}</p>
            <Link href="/admin/notifications" className="btn-secondary btn-md mt-6 inline-block">
              נסו שוב
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
