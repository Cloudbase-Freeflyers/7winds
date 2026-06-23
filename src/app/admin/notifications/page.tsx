import { headers } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import NotificationManager from "@/components/admin/NotificationManager";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "התראות אימייל",
  robots: { index: false, follow: false },
};

export default async function AdminNotificationsPage() {
  await headers();

  return (
    <AdminShell
      active="notifications"
      title="התראות אימייל"
      subtitle="חיבור Gmail פעם אחת, אישור מנויים פעם אחת, ואז שליטה בסוגי ההתראות."
    >
      <Suspense fallback={<p className="text-sm text-brand-dark">טוען…</p>}>
        <NotificationManager />
      </Suspense>
    </AdminShell>
  );
}
