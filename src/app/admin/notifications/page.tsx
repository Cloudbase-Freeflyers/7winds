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
      subtitle="חברו Gmail שלכם, אשרו מנויים, והתראות על לידים."
    >
      <Suspense fallback={<p className="text-sm text-brand-dark">טוען…</p>}>
        <NotificationManager />
      </Suspense>
    </AdminShell>
  );
}
